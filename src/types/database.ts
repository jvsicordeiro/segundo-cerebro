// Generated types for Segundo Cérebro Supabase schema
// Run `npx supabase gen types typescript` to regenerate from live DB

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type PersonCategory = 'family' | 'partner' | 'friend' | 'work' | 'professional' | 'other'
export type MemoryType = 'memory' | 'thought' | 'event' | 'milestone' | 'quote' | 'advice' | 'dream'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'
export type Recurrence = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'
export type FinanceType = 'income' | 'expense'
export type ExpenseKind = 'fixed' | 'variable' | 'installment'
export type GoalHorizon = 'week' | 'month' | '6months' | '1year' | '2years' | '3years' | '5years' | 'life'
export type ReviewPeriod = 'weekly' | 'monthly' | 'yearly'
export type TagType = 'emotion' | 'place' | 'person' | 'topic' | 'custom'

// ─── Row types ────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string
  nickname: string
  avatar_url: string | null
  birth_date: string | null
  bio: string | null
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
    family_mode: boolean
    weekly_review_day: number
  }
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  user_id: string
  name: string
  category: PersonCategory
  role: string | null
  emoji: string
  color: string
  birth_date: string | null
  since_date: string | null
  notes: string | null
  is_group: boolean
  group_size: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  type: TagType
  color: string | null
}

export interface Memory {
  id: string
  user_id: string
  type: MemoryType
  title: string
  body: string | null
  date_start: string | null
  date_end: string | null
  date_display: string | null
  location: string | null
  emoji: string | null
  is_legacy: boolean
  is_favorite: boolean
  media_urls: string[]
  voice_url: string | null
  metadata: Json
  collection_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
  // Joined
  people?: Person[]
  tags?: Tag[]
  collection?: Collection | null
}

export interface Task {
  id: string
  user_id: string
  title: string
  notes: string | null
  priority: TaskPriority
  due_date: string | null
  due_time: string | null
  done: boolean
  done_at: string | null
  recurrence: Recurrence | null
  category: string | null
  person_id: string | null
  collection_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
  // Joined
  person?: Person | null
}

export interface Habit {
  id: string
  user_id: string
  name: string
  emoji: string
  frequency: Recurrence
  target: number
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  date: string
  value: number
}

export interface MoodLog {
  id: string
  user_id: string
  date: string
  mood: number // 1-5
  note: string | null
}

export interface FinanceCategory {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  type: FinanceType
  sort_order: number
}

export interface Transaction {
  id: string
  user_id: string
  type: FinanceType
  kind: ExpenseKind | null
  category_id: string | null
  description: string
  amount: number
  date: string
  is_recurring: boolean
  recurrence: Recurrence | null
  installment_current: number | null
  installment_total: number | null
  installment_group: string | null
  notes: string | null
  person_id: string | null
  created_at: string
  updated_at: string
  // Joined
  category?: FinanceCategory | null
}

export interface Bill {
  id: string
  user_id: string
  description: string
  amount: number
  due_day: number
  category_id: string | null
  active: boolean
  notify_days_before: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface FinancialGoal {
  id: string
  user_id: string
  name: string
  target: number
  current: number
  emoji: string
  deadline: string | null
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  user_id: string
  name: string
  type: string | null
  institution: string | null
  amount: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string | null
  frequency: string
  time_of_day: string | null
  active: boolean
  notify: boolean
  created_at: string
  updated_at: string
}

export interface MedicationLog {
  id: string
  user_id: string
  medication_id: string
  date: string
  taken: boolean
}

export interface Appointment {
  id: string
  user_id: string
  title: string
  person_id: string | null
  date: string
  time: string | null
  location: string | null
  notes: string | null
  gcal_id: string | null
  created_at: string
  updated_at: string
  // Joined
  person?: Person | null
}

export interface Symptom {
  id: string
  user_id: string
  description: string
  severity: number | null
  date: string
  notes: string | null
  created_at: string
}

export interface BodyMeasure {
  id: string
  user_id: string
  date: string
  weight_kg: number | null
  height_cm: number | null
  notes: string | null
  extra: Json
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  horizon: GoalHorizon
  progress: number
  target_value: string | null
  current_value: string | null
  emoji: string
  category: string | null
  done: boolean
  done_at: string | null
  deadline: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  emoji: string
  status: 'active' | 'paused' | 'done' | 'archived'
  goal_id: string | null
  created_at: string
  updated_at: string
}

export interface GroceryItem {
  id: string
  user_id: string
  name: string
  category: string | null
  quantity: string | null
  checked: boolean
  sort_order: number
  created_at: string
}

export interface CleaningTask {
  id: string
  user_id: string
  name: string
  area: string | null
  recurrence: Recurrence
  last_done: string | null
  next_due: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  user_id: string
  name: string
  platform: string | null
  url: string | null
  progress: number
  status: 'in_progress' | 'paused' | 'done'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ArchaeologistQuest {
  id: string
  user_id: string
  title: string
  description: string | null
  emoji: string
  status: 'pending' | 'in_progress' | 'done'
  memories_count: number
  sort_order: number
  completed_at: string | null
  created_at: string
}

export interface Letter {
  id: string
  user_id: string
  recipient: string
  title: string
  body: string
  open_date: string | null
  open_condition: string | null
  is_opened: boolean
  person_id: string | null
  created_at: string
  updated_at: string
}

export interface AiMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Json
  created_at: string
}

export interface VoiceEntry {
  id: string
  user_id: string
  audio_url: string
  transcript: string | null
  duration_sec: number | null
  parsed_type: string | null
  parsed_ref_id: string | null
  processed: boolean
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  period: ReviewPeriod
  start_date: string
  end_date: string
  content: string | null
  stats: Json
  created_at: string
}

export interface ScheduleItem {
  id: string
  user_id: string
  title: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  person_id: string | null
  gcal_id: string | null
  color: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Database interface for Supabase client ──────────

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> }
      people: { Row: Person; Insert: Omit<Person, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Person> }
      collections: { Row: Collection; Insert: Omit<Collection, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Collection> }
      tags: { Row: Tag; Insert: Omit<Tag, 'id'>; Update: Partial<Tag> }
      memories: { Row: Memory; Insert: Omit<Memory, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Memory> }
      tasks: { Row: Task; Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Task> }
      habits: { Row: Habit; Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Habit> }
      habit_logs: { Row: HabitLog; Insert: Omit<HabitLog, 'id'>; Update: Partial<HabitLog> }
      mood_logs: { Row: MoodLog; Insert: Omit<MoodLog, 'id'>; Update: Partial<MoodLog> }
      finance_categories: { Row: FinanceCategory; Insert: Omit<FinanceCategory, 'id'>; Update: Partial<FinanceCategory> }
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Transaction> }
      bills: { Row: Bill; Insert: Omit<Bill, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Bill> }
      financial_goals: { Row: FinancialGoal; Insert: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>; Update: Partial<FinancialGoal> }
      investments: { Row: Investment; Insert: Omit<Investment, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Investment> }
      medications: { Row: Medication; Insert: Omit<Medication, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Medication> }
      medication_logs: { Row: MedicationLog; Insert: Omit<MedicationLog, 'id'>; Update: Partial<MedicationLog> }
      appointments: { Row: Appointment; Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Appointment> }
      symptoms: { Row: Symptom; Insert: Omit<Symptom, 'id' | 'created_at'>; Update: Partial<Symptom> }
      body_measures: { Row: BodyMeasure; Insert: Omit<BodyMeasure, 'id'>; Update: Partial<BodyMeasure> }
      goals: { Row: Goal; Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Goal> }
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Project> }
      grocery_items: { Row: GroceryItem; Insert: Omit<GroceryItem, 'id' | 'created_at'>; Update: Partial<GroceryItem> }
      cleaning_tasks: { Row: CleaningTask; Insert: Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>; Update: Partial<CleaningTask> }
      courses: { Row: Course; Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Course> }
      archaeologist_quests: { Row: ArchaeologistQuest; Insert: Omit<ArchaeologistQuest, 'id' | 'created_at'>; Update: Partial<ArchaeologistQuest> }
      letters: { Row: Letter; Insert: Omit<Letter, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Letter> }
      ai_messages: { Row: AiMessage; Insert: Omit<AiMessage, 'id' | 'created_at'>; Update: Partial<AiMessage> }
      voice_entries: { Row: VoiceEntry; Insert: Omit<VoiceEntry, 'id' | 'created_at'>; Update: Partial<VoiceEntry> }
      reviews: { Row: Review; Insert: Omit<Review, 'id' | 'created_at'>; Update: Partial<Review> }
      schedule_items: { Row: ScheduleItem; Insert: Omit<ScheduleItem, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ScheduleItem> }
    }
    Views: {
      v_finance_monthly: { Row: { user_id: string; month: string; income: number; expenses: number; balance: number } }
      v_habit_streaks: { Row: { habit_id: string; user_id: string; best_streak: number; current_streak: number | null } }
      v_today_briefing: { Row: { user_id: string; overdue_tasks: number; upcoming_bills: number; today_appointments: number; today_mood: number | null } }
    }
    Functions: Record<string, never>
    Enums: {
      person_category: PersonCategory
      memory_type: MemoryType
      task_priority: TaskPriority
      task_recurrence: Recurrence
      finance_type: FinanceType
      expense_kind: ExpenseKind
      goal_horizon: GoalHorizon
      review_period: ReviewPeriod
      tag_type: TagType
    }
  }
}
