-- ═══════════════════════════════════════════════════════════════════════════════
-- SEGUNDO CÉREBRO - SUPABASE SCHEMA v3
-- Entity-Based Architecture
-- Complete rewrite replacing module-based structure with universal entity system
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ═══════════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PROFILES TABLE (kept from v2)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  nickname text,
  avatar_url text,
  birth_date date,
  bio text,
  settings jsonb DEFAULT '{"theme":"system","notifications":true,"family_mode":false,"language":"pt-BR"}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENTITIES TABLE (THE CORE)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Core table for all entity types with flexible metadata
-- Entity types: memory, product, task, event, place, note, purchase, habit, goal, wish,
-- document, routine_entry, mood_entry, person, and custom types
--
-- Metadata examples by type:
-- - product: {brand, price, store, category, rating, size, color, condition}
-- - memory: {emotion, importance, location, participants, duration_hours}
-- - task: {due_date, priority, completed, category, effort_hours}
-- - event: {start_time, end_time, location, participants, category}
-- - place: {latitude, longitude, city, country, visited_count}
-- - purchase: {amount, store, category, payment_method, warranty_months}
-- - habit: {frequency, streak_days, last_done, goal_count}
-- - mood_entry: {mood_score, energy, sleep_quality, weather, notes}

CREATE TABLE IF NOT EXISTS entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  date date,
  is_archived boolean DEFAULT false,
  is_favorite boolean DEFAULT false,
  is_legacy boolean DEFAULT false,
  privacy_level text DEFAULT 'private' CHECK (privacy_level IN ('private', 'shared', 'emergency')),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entities"
  ON entities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entities"
  ON entities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entities"
  ON entities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entities"
  ON entities
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER entities_updated_at_trigger
  BEFORE UPDATE ON entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Indexes for entity queries
CREATE INDEX idx_entities_user_id ON entities(user_id);
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_date ON entities(date);
CREATE INDEX idx_entities_is_archived ON entities(is_archived);
CREATE INDEX idx_entities_user_date ON entities(user_id, date);
CREATE INDEX idx_entities_metadata ON entities USING GIN(metadata);
CREATE INDEX idx_entities_title_trgm ON entities USING GIN(title gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TAGS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  icon text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tags"
  ON tags
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tags"
  ON tags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_tags_user_id ON tags(user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENTITY TAGS (Many-to-Many)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS entity_tags (
  entity_id uuid NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, tag_id)
);

ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tags on their entities"
  ON entity_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM entities WHERE id = entity_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tags on their entities"
  ON entity_tags
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM entities WHERE id = entity_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tags from their entities"
  ON entity_tags
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM entities WHERE id = entity_id AND user_id = auth.uid()
    )
  );

CREATE INDEX idx_entity_tags_entity_id ON entity_tags(entity_id);
CREATE INDEX idx_entity_tags_tag_id ON entity_tags(tag_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CONNECTIONS TABLE (Entity-to-Entity Relationships)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Establishes relationships between entities
-- Relationship types: part_of, bought_at, with_person, used_in, related_to, triggered_by, etc.

CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_a_id uuid NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  entity_b_id uuid NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  relationship text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_a_id, entity_b_id, relationship)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view connections between their entities"
  ON connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create connections between their entities"
  ON connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete connections between their entities"
  ON connections
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_connections_entity_a_id ON connections(entity_a_id);
CREATE INDEX idx_connections_entity_b_id ON connections(entity_b_id);
CREATE INDEX idx_connections_relationship ON connections(relationship);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MEDIA TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Stores references to media associated with entities
-- Types: image, video, audio, document

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
  caption text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view media from their entities"
  ON media
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload media to their entities"
  ON media
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete media from their entities"
  ON media
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_entity_id ON media(entity_id);
CREATE INDEX idx_media_type ON media(type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PEOPLE TABLE (Dedicated)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Dedicated table for important people relationships
-- Relationships: pai, mãe, esposa, marido, filho, filha, amigo, namorado, namorada, colega, chefe, mentor, etc.
-- Categories: family, friends, work, professional, acquaintance

CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text,
  category text,
  phone text,
  email text,
  birth_date date,
  avatar_url text,
  notes text,
  is_favorite boolean DEFAULT false,
  last_contact timestamptz,
  contact_frequency_days int,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their people"
  ON people
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their people"
  ON people
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their people"
  ON people
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their people"
  ON people
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER people_updated_at_trigger
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_entity_id ON people(entity_id);
CREATE INDEX idx_people_category ON people(category);
CREATE INDEX idx_people_is_favorite ON people(is_favorite);

-- ═══════════════════════════════════════════════════════════════════════════════
-- COLLECTIONS TABLE (User-Defined Flexible Collections)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Allows users to create custom collections with custom fields
-- Example collections: "Meus Carros", "Jogos do SPFC", "Produtos de Cabelo"
--
-- fields_schema structure: [
--   {"name":"modelo","type":"text","required":true},
--   {"name":"ano","type":"number","required":false},
--   {"name":"foto","type":"image","required":false}
-- ]

CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text,
  color text,
  fields_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their collections"
  ON collections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections"
  ON collections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their collections"
  ON collections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their collections"
  ON collections
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER collections_updated_at_trigger
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_collections_user_id ON collections(user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- COLLECTION ITEMS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Items within collections with field values matching the collection's schema
-- field_values structure matches the collection's fields_schema

CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES entities(id) ON DELETE SET NULL,
  field_values jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their collection items"
  ON collection_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their collections"
  ON collection_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their collection items"
  ON collection_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their collection items"
  ON collection_items
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER collection_items_updated_at_trigger
  BEFORE UPDATE ON collection_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_collection_items_user_id ON collection_items(user_id);
CREATE INDEX idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX idx_collection_items_entity_id ON collection_items(entity_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROUTINES TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- User-defined routines (morning routine, skincare, etc.)
-- Time of day: morning, afternoon, evening, night
--
-- steps structure: [
--   {"order":1,"name":"Banho","duration_min":15,"linked_entity_id":"...",icon":"shower"},
--   {"order":2,"name":"Café","duration_min":10,"icon":"coffee"}
-- ]

CREATE TABLE IF NOT EXISTS routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  icon text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their routines"
  ON routines
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create routines"
  ON routines
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their routines"
  ON routines
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their routines"
  ON routines
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER routines_updated_at_trigger
  BEFORE UPDATE ON routines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routines_is_active ON routines(is_active);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROUTINE LOGS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tracks completion of routine steps
-- completed_steps: [0, 1, 2] (array of completed step indexes)

CREATE TABLE IF NOT EXISTS routine_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id uuid NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  date date NOT NULL,
  completed_steps jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE routine_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their routine logs"
  ON routine_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create routine logs"
  ON routine_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their routine logs"
  ON routine_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_routine_logs_user_id ON routine_logs(user_id);
CREATE INDEX idx_routine_logs_routine_id ON routine_logs(routine_id);
CREATE INDEX idx_routine_logs_date ON routine_logs(date);
CREATE INDEX idx_routine_logs_user_date ON routine_logs(user_id, date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- RECURRING ITEMS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Subscriptions, recurring purchases, maintenance tasks, medical appointments
-- Categories: subscription, purchase, maintenance, medical, financial
-- Frequencies: daily, weekly, monthly, quarterly, semi_annual, annual, custom

CREATE TABLE IF NOT EXISTS recurring_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES entities(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text CHECK (category IN ('subscription', 'purchase', 'maintenance', 'medical', 'financial')),
  amount decimal(10,2),
  currency text DEFAULT 'BRL',
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual', 'custom')),
  frequency_days int,
  next_due date,
  last_completed date,
  auto_renew boolean DEFAULT true,
  reminder_days_before int DEFAULT 3,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE recurring_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their recurring items"
  ON recurring_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create recurring items"
  ON recurring_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their recurring items"
  ON recurring_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their recurring items"
  ON recurring_items
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER recurring_items_updated_at_trigger
  BEFORE UPDATE ON recurring_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_recurring_items_user_id ON recurring_items(user_id);
CREATE INDEX idx_recurring_items_entity_id ON recurring_items(entity_id);
CREATE INDEX idx_recurring_items_category ON recurring_items(category);
CREATE INDEX idx_recurring_items_next_due ON recurring_items(next_due);
CREATE INDEX idx_recurring_items_is_active ON recurring_items(is_active);

-- ═══════════════════════════════════════════════════════════════════════════════
-- EMERGENCY CARD TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Medical emergency information
-- emergency_contacts structure: [
--   {"name":"João","phone":"11999999999","relationship":"Esposa"},
--   {"name":"Maria","phone":"11988888888","relationship":"Mãe"}
-- ]

CREATE TABLE IF NOT EXISTS emergency_card (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  blood_type text,
  allergies text[],
  medications text[],
  conditions text[],
  emergency_contacts jsonb DEFAULT '[]'::jsonb,
  doctor_name text,
  doctor_phone text,
  health_insurance text,
  health_insurance_number text,
  organ_donor boolean,
  notes text,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE emergency_card ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their emergency card"
  ON emergency_card
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their emergency card"
  ON emergency_card
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER emergency_card_updated_at_trigger
  BEFORE UPDATE ON emergency_card
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_emergency_card_user_id ON emergency_card(user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- IDENTITY INSIGHTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- AI-generated observations about user identity, preferences, and patterns
-- Categories: preference, pattern, personality, habit, prediction
-- Confidence: 0 to 1 (0.5 = neutral, 0.9 = high confidence)

CREATE TABLE IF NOT EXISTS identity_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('preference', 'pattern', 'personality', 'habit', 'prediction')),
  insight text NOT NULL,
  confidence decimal(3,2) DEFAULT 0.5,
  evidence_count int DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE identity_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their identity insights"
  ON identity_insights
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their identity insights"
  ON identity_insights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their identity insights"
  ON identity_insights
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER identity_insights_updated_at_trigger
  BEFORE UPDATE ON identity_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_identity_insights_user_id ON identity_insights(user_id);
CREATE INDEX idx_identity_insights_category ON identity_insights(category);
CREATE INDEX idx_identity_insights_is_active ON identity_insights(is_active);
CREATE INDEX idx_identity_insights_confidence ON identity_insights(confidence);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MICRO JOURNAL TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Daily micro journal entries with AI-generated questions
-- Mood: 1-5 scale (1=very sad, 5=very happy)
-- One entry per day per user

CREATE TABLE IF NOT EXISTS micro_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  question text NOT NULL,
  answer text,
  mood int CHECK (mood >= 1 AND mood <= 5),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

ALTER TABLE micro_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their micro journal entries"
  ON micro_journal
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create micro journal entries"
  ON micro_journal
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their micro journal entries"
  ON micro_journal
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_micro_journal_user_id ON micro_journal(user_id);
CREATE INDEX idx_micro_journal_date ON micro_journal(date);
CREATE INDEX idx_micro_journal_user_date ON micro_journal(user_id, date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DAILY FEED TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- AI-generated proactive feed items
-- Types: alert, reminder, insight, suggestion, memory, milestone
-- Priority: higher values = more important

CREATE TABLE IF NOT EXISTS daily_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'reminder', 'insight', 'suggestion', 'memory', 'milestone')),
  title text NOT NULL,
  body text,
  priority int DEFAULT 0,
  linked_entity_id uuid REFERENCES entities(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE daily_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their feed"
  ON daily_feed
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their feed items"
  ON daily_feed
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_daily_feed_user_id ON daily_feed(user_id);
CREATE INDEX idx_daily_feed_date ON daily_feed(date);
CREATE INDEX idx_daily_feed_type ON daily_feed(type);
CREATE INDEX idx_daily_feed_priority ON daily_feed(priority DESC);
CREATE INDEX idx_daily_feed_is_read ON daily_feed(is_read);
CREATE INDEX idx_daily_feed_user_date ON daily_feed(user_id, date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- IMPORTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tracks imported data sources (Google Photos, bank CSVs, WhatsApp, Spotify, Google Calendar)
-- Status: pending, processing, completed, failed

CREATE TABLE IF NOT EXISTS imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('google_photos', 'bank_csv', 'whatsapp', 'spotify', 'google_calendar')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  entities_created int DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz
);

ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their imports"
  ON imports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create import jobs"
  ON imports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their import jobs"
  ON imports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_imports_user_id ON imports(user_id);
CREATE INDEX idx_imports_source ON imports(source);
CREATE INDEX idx_imports_status ON imports(status);
CREATE INDEX idx_imports_created_at ON imports(created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SCHEMA COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════
-- Total tables: 17
-- All tables have RLS enabled
-- All tables with updated_at have triggers
-- Full text search enabled with pg_trgm
-- Complete indexing for performance
-- ═══════════════════════════════════════════════════════════════════════════════
