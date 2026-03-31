/**
 * Segundo Cérebro - Supabase Schema v3 TypeScript Types
 * Entity-based architecture with flexible metadata system
 *
 * Generated for use with @supabase/ssr in Next.js 16
 */

// ═══════════════════════════════════════════════════════════════════════════
// BASE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type PrivacyLevel = 'private' | 'shared' | 'emergency'
export type MediaType = 'image' | 'video' | 'audio' | 'document'
export type RelationshipType = 'part_of' | 'bought_at' | 'with_person' | 'used_in' | 'related_to' | 'triggered_by' | 'similar_to' | 'parent_of' | 'child_of'
export type RelationshipCategory = 'family' | 'friends' | 'work' | 'professional' | 'acquaintance'
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'
export type RoutineStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type RecurrencyFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom'
export type InsightCategory = 'preference' | 'pattern' | 'personality' | 'habit' | 'prediction'
export type FeedType = 'alert' | 'reminder' | 'insight' | 'suggestion' | 'memory' | 'milestone'
export type ImportSource = 'google_photos' | 'bank_csv' | 'whatsapp' | 'spotify' | 'google_calendar'

// ═══════════════════════════════════════════════════════════════════════════
// ENTITY TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export type EntityType = 'memory' | 'product' | 'task' | 'event' | 'place' | 'note' | 'purchase' | 'habit' | 'goal' | 'wish' | 'document' | 'routine_entry' | 'mood_entry' | 'person' | string

export const ENTITY_TYPES = {
  memory: 'memory',
  product: 'product',
  task: 'task',
  event: 'event',
  place: 'place',
  note: 'note',
  purchase: 'purchase',
  habit: 'habit',
  goal: 'goal',
  wish: 'wish',
  document: 'document',
  routine_entry: 'routine_entry',
  mood_entry: 'mood_entry',
  person: 'person',
} as const

// ═══════════════════════════════════════════════════════════════════════════
// METADATA TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface MemoryMetadata {
  emotion?: string
  importance?: 1 | 2 | 3 | 4 | 5
  location?: string
  weather?: string
  people_present?: string[]
  duration_hours?: number
}

export interface ProductMetadata {
  brand?: string
  price?: number
  store?: string
  category?: string
  duration_days?: number
  rating?: number
  repurchase?: boolean
  size?: string
  color?: string
}

export interface TaskMetadata {
  due_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  completed?: boolean
  completed_at?: string
  category?: string
  effort_hours?: number
}

export interface EventMetadata {
  start_time?: string
  end_time?: string
  location?: string
  participants?: string[]
  recurrence?: RecurrencyFrequency
  category?: string
}

export interface PlaceMetadata {
  address?: string
  category?: string
  rating?: number
  last_visit?: string
  google_maps_url?: string
  latitude?: number
  longitude?: number
}

export interface PurchaseMetadata {
  amount?: number
  store?: string
  category?: string
  payment_method?: string
  receipt_url?: string
  warranty_months?: number
}

export interface HabitMetadata {
  target_frequency?: RecurrencyFrequency
  current_streak?: number
  best_streak?: number
  last_done?: string
  goal_count?: number
}

export interface GoalMetadata {
  target_date?: string
  progress_pct?: number
  milestones?: string[]
  category?: string
}

export interface WishMetadata {
  category?: string
  estimated_cost?: number
  priority?: 'low' | 'medium' | 'high'
  url?: string
}

export interface DocumentMetadata {
  doc_type?: string
  expiry_date?: string
  file_url?: string
  issuer?: string
}

export interface MoodEntryMetadata {
  mood_score?: 1 | 2 | 3 | 4 | 5
  energy?: 1 | 2 | 3 | 4 | 5
  sleep_quality?: 1 | 2 | 3 | 4 | 5
  weather?: string
  notes?: string
}

export type EntityMetadata = MemoryMetadata | ProductMetadata | TaskMetadata | EventMetadata | PlaceMetadata | PurchaseMetadata | HabitMetadata | GoalMetadata | WishMetadata | DocumentMetadata | MoodEntryMetadata | Record<string, Json>

// Generic metadata mapper for type safety
export interface MetadataMap {
  memory: MemoryMetadata
  product: ProductMetadata
  task: TaskMetadata
  event: EventMetadata
  place: PlaceMetadata
  purchase: PurchaseMetadata
  habit: HabitMetadata
  goal: GoalMetadata
  wish: WishMetadata
  document: DocumentMetadata
  mood_entry: MoodEntryMetadata
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE TABLE ROW TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Profile {
  id: string
  full_name: string | null
  nickname: string | null
  avatar_url: string | null
  birth_date: string | null
  bio: string | null
  settings: {
    theme?: 'light' | 'dark' | 'system'
    notifications?: boolean
    family_mode?: boolean
    language?: string
  }
  created_at: string
  updated_at: string
}

export interface Entity {
  id: string
  user_id: string
  type: EntityType
  title: string
  description: string | null
  metadata: Record<string, Json>
  date: string | null
  is_archived: boolean
  is_favorite: boolean
  is_legacy: boolean
  privacy_level: PrivacyLevel
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string | null
  icon: string | null
  created_at: string
}

export interface EntityTag {
  entity_id: string
  tag_id: string
}

export interface Connection {
  id: string
  user_id: string
  entity_a_id: string
  entity_b_id: string
  relationship: RelationshipType
  metadata: Record<string, Json>
  created_at: string
}

export interface Media {
  id: string
  user_id: string
  entity_id: string
  url: string
  type: MediaType
  caption: string | null
  order_index: number
  created_at: string
}

export interface Person {
  id: string
  user_id: string
  entity_id: string
  name: string
  relationship: string | null
  category: RelationshipCategory | null
  phone: string | null
  email: string | null
  birth_date: string | null
  avatar_url: string | null
  notes: string | null
  is_favorite: boolean
  last_contact: string | null
  contact_frequency_days: number | null
  metadata: Record<string, Json>
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  fields_schema: Array<{
    name: string
    type: string
    required?: boolean
  }>
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CollectionItem {
  id: string
  user_id: string
  collection_id: string
  entity_id: string | null
  field_values: Record<string, Json>
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Routine {
  id: string
  user_id: string
  name: string
  description: string | null
  time_of_day: TimeOfDay | null
  icon: string | null
  steps: Array<{
    order: number
    name: string
    duration_min?: number
    linked_entity_id?: string
    icon?: string
  }>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RoutineLog {
  id: string
  user_id: string
  routine_id: string
  date: string
  completed_steps: number[]
  started_at: string | null
  completed_at: string | null
  notes: string | null
  created_at: string
}

export interface RecurringItem {
  id: string
  user_id: string
  entity_id: string | null
  name: string
  category: 'subscription' | 'purchase' | 'maintenance' | 'medical' | 'financial'
  amount: number | null
  currency: string
  frequency: RecurrencyFrequency
  frequency_days: number | null
  next_due: string | null
  last_completed: string | null
  auto_renew: boolean
  reminder_days_before: number
  notes: string | null
  metadata: Record<string, Json>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmergencyCard {
  id: string
  user_id: string
  blood_type: string | null
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergency_contacts: Array<{
    name: string
    phone: string
    relationship: string
  }>
  doctor_name: string | null
  doctor_phone: string | null
  health_insurance: string | null
  health_insurance_number: string | null
  organ_donor: boolean
  notes: string | null
  updated_at: string
}

export interface IdentityInsight {
  id: string
  user_id: string
  category: InsightCategory
  insight: string
  confidence: number
  evidence_count: number
  metadata: Record<string, Json>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MicroJournal {
  id: string
  user_id: string
  date: string
  question: string
  answer: string | null
  mood: 1 | 2 | 3 | 4 | 5 | null
  created_at: string
}

export interface DailyFeed {
  id: string
  user_id: string
  date: string
  type: FeedType
  title: string
  body: string | null
  priority: number
  linked_entity_id: string | null
  is_read: boolean
  is_dismissed: boolean
  created_at: string
}

export interface Import {
  id: string
  user_id: string
  source: ImportSource
  status: RoutineStatus
  entities_created: number
  metadata: Record<string, Json>
  created_at: string
  completed_at: string | null
}

// ═══════════════════════════════════════════════════════════════════════════
// INSERT/UPDATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & { id: string }
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

export type EntityInsert = Omit<Entity, 'id' | 'created_at' | 'updated_at'>
export type EntityUpdate = Partial<Omit<Entity, 'id' | 'created_at' | 'updated_at'>>

export type TagInsert = Omit<Tag, 'id' | 'created_at'>
export type TagUpdate = Partial<Omit<Tag, 'id' | 'created_at'>>

export type ConnectionInsert = Omit<Connection, 'id' | 'created_at'>
export type ConnectionUpdate = Partial<Omit<Connection, 'id' | 'created_at'>>

export type MediaInsert = Omit<Media, 'id' | 'created_at'>
export type MediaUpdate = Partial<Omit<Media, 'id' | 'created_at'>>

export type PersonInsert = Omit<Person, 'id' | 'created_at' | 'updated_at'>
export type PersonUpdate = Partial<Omit<Person, 'id' | 'created_at' | 'updated_at'>>

export type CollectionInsert = Omit<Collection, 'id' | 'created_at' | 'updated_at'>
export type CollectionUpdate = Partial<Omit<Collection, 'id' | 'created_at' | 'updated_at'>>

export type CollectionItemInsert = Omit<CollectionItem, 'id' | 'created_at' | 'updated_at'>
export type CollectionItemUpdate = Partial<Omit<CollectionItem, 'id' | 'created_at' | 'updated_at'>>

export type RoutineInsert = Omit<Routine, 'id' | 'created_at' | 'updated_at'>
export type RoutineUpdate = Partial<Omit<Routine, 'id' | 'created_at' | 'updated_at'>>

export type RoutineLogInsert = Omit<RoutineLog, 'id' | 'created_at'>
export type RoutineLogUpdate = Partial<Omit<RoutineLog, 'id' | 'created_at'>>

export type RecurringItemInsert = Omit<RecurringItem, 'id' | 'created_at' | 'updated_at'>
export type RecurringItemUpdate = Partial<Omit<RecurringItem, 'id' | 'created_at' | 'updated_at'>>

export type EmergencyCardInsert = Omit<EmergencyCard, 'updated_at'>
export type EmergencyCardUpdate = Partial<Omit<EmergencyCard, 'updated_at'>>

export type IdentityInsightInsert = Omit<IdentityInsight, 'id' | 'created_at' | 'updated_at'>
export type IdentityInsightUpdate = Partial<Omit<IdentityInsight, 'id' | 'created_at' | 'updated_at'>>

export type MicroJournalInsert = Omit<MicroJournal, 'id' | 'created_at'>
export type MicroJournalUpdate = Partial<Omit<MicroJournal, 'id' | 'created_at'>>

export type DailyFeedInsert = Omit<DailyFeed, 'id' | 'created_at'>
export type DailyFeedUpdate = Partial<Omit<DailyFeed, 'id' | 'created_at'>>

export type ImportInsert = Omit<Import, 'id' | 'created_at' | 'completed_at'>
export type ImportUpdate = Partial<Omit<Import, 'id' | 'created_at'>>

// ═══════════════════════════════════════════════════════════════════════════
// UNION TYPES FOR POLYMORPHIC QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export type AnyEntity = Entity
export type AnyEntityRow = Entity

export type EntityWithRelations = Entity & {
  tags?: Tag[]
  connections?: Connection[]
  media?: Media[]
  people?: Person[]
}

// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE DATABASE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      entities: {
        Row: Entity
        Insert: EntityInsert
        Update: EntityUpdate
      }
      tags: {
        Row: Tag
        Insert: TagInsert
        Update: TagUpdate
      }
      entity_tags: {
        Row: EntityTag
        Insert: EntityTag
        Update: never
      }
      connections: {
        Row: Connection
        Insert: ConnectionInsert
        Update: ConnectionUpdate
      }
      media: {
        Row: Media
        Insert: MediaInsert
        Update: MediaUpdate
      }
      people: {
        Row: Person
        Insert: PersonInsert
        Update: PersonUpdate
      }
      collections: {
        Row: Collection
        Insert: CollectionInsert
        Update: CollectionUpdate
      }
      collection_items: {
        Row: CollectionItem
        Insert: CollectionItemInsert
        Update: CollectionItemUpdate
      }
      routines: {
        Row: Routine
        Insert: RoutineInsert
        Update: RoutineUpdate
      }
      routine_logs: {
        Row: RoutineLog
        Insert: RoutineLogInsert
        Update: RoutineLogUpdate
      }
      recurring_items: {
        Row: RecurringItem
        Insert: RecurringItemInsert
        Update: RecurringItemUpdate
      }
      emergency_card: {
        Row: EmergencyCard
        Insert: EmergencyCardInsert
        Update: EmergencyCardUpdate
      }
      identity_insights: {
        Row: IdentityInsight
        Insert: IdentityInsightInsert
        Update: IdentityInsightUpdate
      }
      micro_journal: {
        Row: MicroJournal
        Insert: MicroJournalInsert
        Update: MicroJournalUpdate
      }
      daily_feed: {
        Row: DailyFeed
        Insert: DailyFeedInsert
        Update: DailyFeedUpdate
      }
      imports: {
        Row: Import
        Insert: ImportInsert
        Update: ImportUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      privacy_level: PrivacyLevel
      media_type: MediaType
      relationship_type: RelationshipType
      relationship_category: RelationshipCategory
      time_of_day: TimeOfDay
      recurrence_frequency: RecurrencyFrequency
      insight_category: InsightCategory
      feed_type: FeedType
      import_source: ImportSource
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES FOR TYPED QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export type TypedEntityMetadata<T extends EntityType> = T extends keyof MetadataMap ? MetadataMap[T] : Record<string, Json>

export interface TypedEntity<T extends EntityType = EntityType> extends Omit<Entity, 'type' | 'metadata'> {
  type: T
  metadata: TypedEntityMetadata<T>
}

// Helper function to type-cast entity with correct metadata
export function typedEntity<T extends EntityType>(entity: Entity, type: T): TypedEntity<T> {
  return {
    ...entity,
    type,
    metadata: entity.metadata as TypedEntityMetadata<T>,
  }
}
