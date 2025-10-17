# Database Schema - SpecChem Safety LMS

## Overview

The Safety LMS uses PostgreSQL via Supabase with Drizzle ORM for type-safe database access. The schema is organized into three main domains:

1. **Core Safety Training** - Courses, progress, enrollments
2. **LMS Content** - Structured course content, sections, blocks, quizzes  
3. **Safety Business** - CRM-like features for managing accounts, territories, opportunities

## Entity Relationship Diagram

```
auth.users (Supabase)
    ↓
profiles ←→ plants
    ↓
    ├── enrollments → courses ← course_sections ← content_blocks
    ├── progress              ← course_sections ← quiz_questions
    ├── user_progress         ← course_sections
    ├── quiz_attempts         ← quiz_questions
    ├── activity_events
    ├── question_events
    └── admin_roles
```

## Core Safety Training Tables

### `profiles`
User profile information linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `auth_user_id` | uuid | Foreign key to `auth.users.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `first_name` | text | User's first name |
| `last_name` | text | User's last name |
| `email` | text | User's email (synced with auth) |
| `role` | text | Role: 'employee', 'manager', 'admin' |
| `is_active` | boolean | Account status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Key Relationships:**
- One-to-one with `auth.users`
- Many-to-one with `plants`
- One-to-many with `enrollments`, `progress`, `activity_events`

**RLS Policies:**
- Users can read own profile
- Admins can read all profiles
- Managers can read profiles in their plant

---

### `plants`
Manufacturing facilities (multi-tenancy).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Plant name |
| `location` | text | Physical location |
| `code` | text | Unique plant code |
| `is_active` | boolean | Operational status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Key Relationships:**
- One-to-many with `profiles`
- One-to-many with `enrollments`, `progress`, `admin_roles`

**Purpose:** Provides multi-tenancy by scoping all training data to specific plants.

---

### `courses`
Training courses.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `slug` | text | URL-friendly identifier (unique) |
| `title` | text | Course title |
| `version` | text | Version number (default: "1.0") |
| `is_published` | boolean | Publication status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Key Relationships:**
- One-to-many with `course_sections`
- One-to-many with `enrollments`, `progress`

**Notes:**
- Slug is used in URLs: `/courses/hazmat-function-specific`
- Version allows content updates without breaking existing progress

---

### `enrollments`
User course assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `course_id` | uuid | Foreign key to `courses.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `enrolled_at` | timestamp | Enrollment date |
| `completed_at` | timestamp | Completion date (nullable) |
| `status` | text | 'active', 'completed', 'expired' |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(user_id, course_id, plant_id)`

**Key Relationships:**
- Many-to-one with `profiles`, `courses`, `plants`

**Purpose:** Tracks which users are assigned to which courses.

---

### `progress`
User course progress tracking (legacy table, being replaced by `user_progress`).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `course_id` | uuid | Foreign key to `courses.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `status` | text | 'not_started', 'in_progress', 'completed' |
| `progress_percent` | integer | Completion percentage (0-100) |
| `last_activity_at` | timestamp | Last interaction time |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Note:** This is being phased out in favor of more granular `user_progress` table.

---

### `activity_events`
User activity logging for courses.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `course_id` | uuid | Foreign key to `courses.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `event_type` | text | Event type: 'start', 'complete', 'pause' |
| `event_data` | jsonb | Additional event data |
| `created_at` | timestamp | Event timestamp |

**Purpose:** Audit trail and analytics for user engagement.

---

### `question_events`
Quiz interaction logging.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `course_id` | uuid | Foreign key to `courses.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `question_id` | uuid | Question identifier |
| `user_answer` | jsonb | User's submitted answer |
| `is_correct` | boolean | Whether answer was correct |
| `created_at` | timestamp | Event timestamp |

**Purpose:** Track quiz performance and identify learning gaps.

---

### `admin_roles`
Administrative role assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `plant_id` | uuid | Foreign key to `plants.id` |
| `role` | text | Admin role type |
| `granted_at` | timestamp | Role grant date |
| `created_at` | timestamp | Record creation time |

**Purpose:** Track administrative permissions per plant.

---

### `audit_log`
System-wide audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `action` | text | Action type |
| `entity_type` | text | Affected entity type |
| `entity_id` | uuid | Affected entity ID |
| `old_values` | jsonb | Pre-change values |
| `new_values` | jsonb | Post-change values |
| `created_at` | timestamp | Action timestamp |

**Purpose:** Compliance and security auditing.

---

## LMS Content Tables

### `course_sections`
Course chapters/modules.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `course_id` | uuid | Foreign key to `courses.id` |
| `section_key` | text | Unique identifier within course |
| `title` | text | Section title |
| `order_index` | integer | Display order |
| `icon_name` | text | Icon identifier (nullable) |
| `is_published` | boolean | Publication status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraints:**
- `(course_id, section_key)`
- `(course_id, order_index)`

**Key Relationships:**
- Many-to-one with `courses`
- One-to-many with `content_blocks`, `quiz_questions`, `user_progress`

**Purpose:** Organizes course content into logical sections.

---

### `content_blocks`
Structured content elements within sections.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `section_id` | uuid | Foreign key to `course_sections.id` |
| `block_type` | enum | Content type (see below) |
| `order_index` | integer | Display order |
| `content` | jsonb | Block content data |
| `metadata` | jsonb | Additional metadata (nullable) |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Block Types (enum `content_block_type`):**
- `hero` - Section introduction with badges
- `text` - Rich text content
- `card` - Information cards
- `image` - Visual content
- `table` - Data tables
- `list` - Bulleted/numbered lists
- `grid` - Multi-column layouts
- `callout` - Important notices (info, warning, error, success, tip)
- `quote` - Testimonials/quotes
- `divider` - Visual separators
- `video` - Video embeds
- `audio` - Audio embeds

**Unique Constraint:** `(section_id, order_index)`

**Content Structure (JSONB):**
Each block type has specific required fields in the `content` column:

```typescript
// Hero block
{ title: string; subtitle?: string; badges?: string[] }

// Text block
{ text: string; format?: 'plain' | 'markdown' | 'html' }

// Callout block
{ type: 'info'|'warning'|'error'|'success'|'tip'; title: string; content: string }

// Image block
{ src: string; alt: string; caption?: string }

// ... etc
```

**Purpose:** Provides flexible, structured course content rendering.

---

### `quiz_questions`
Assessment questions within sections.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `section_id` | uuid | Foreign key to `course_sections.id` |
| `question_key` | text | Unique identifier within section |
| `question_type` | enum | Question type: 'true_false', 'multiple_choice' |
| `question_text` | text | Question content |
| `order_index` | integer | Display order |
| `options` | jsonb | Answer options |
| `correct_answer` | jsonb | Correct answer(s) |
| `explanation` | text | Explanation for correct answer |
| `points` | integer | Point value (default: 1) |
| `is_required` | boolean | Must answer to proceed |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraints:**
- `(section_id, question_key)`
- `(section_id, order_index)`

**Options/Answer Structure (JSONB):**

```typescript
// True/False
options: { type: 'boolean' }
correct_answer: { value: true | false }

// Multiple Choice
options: { 
  type: 'multiple_choice',
  choices: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
    { id: 'c', text: 'Option C' }
  ]
}
correct_answer: { value: 'a' }
```

**Purpose:** Embedded assessments to verify learning.

---

### `quiz_attempts`
User quiz submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `question_id` | uuid | Foreign key to `quiz_questions.id` |
| `user_answer` | jsonb | Submitted answer |
| `is_correct` | boolean | Whether answer was correct |
| `points_earned` | integer | Points awarded |
| `submitted_at` | timestamp | Submission time |
| `created_at` | timestamp | Record creation time |

**Key Relationships:**
- Many-to-one with `profiles`, `quiz_questions`

**Purpose:** Track quiz performance and allow retries.

---

### `user_progress`
Granular section-level progress tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `section_id` | uuid | Foreign key to `course_sections.id` |
| `status` | text | 'not_started', 'in_progress', 'completed' |
| `time_spent_seconds` | integer | Time spent in section |
| `completed_at` | timestamp | Completion time (nullable) |
| `last_accessed_at` | timestamp | Last interaction time |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(user_id, section_id)`

**Purpose:** Track detailed progress at section level, replacing course-level `progress` table.

---

### `content_interactions`
User interactions with specific content blocks.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to `profiles.id` |
| `content_block_id` | uuid | Foreign key to `content_blocks.id` |
| `interaction_type` | text | Type: 'view', 'complete', 'download' |
| `interaction_data` | jsonb | Additional interaction data |
| `created_at` | timestamp | Interaction timestamp |

**Purpose:** Track engagement with specific content elements.

---

## Translation Tables (i18n Support)

### `course_translations`
Translated course metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `course_id` | uuid | Foreign key to `courses.id` |
| `language_code` | text | ISO language code (e.g., 'es', 'en') |
| `title` | text | Translated title |
| `description` | text | Translated description |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(course_id, language_code)`

---

### `section_translations`
Translated section metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `section_id` | uuid | Foreign key to `course_sections.id` |
| `language_code` | text | ISO language code |
| `title` | text | Translated title |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(section_id, language_code)`

---

### `content_block_translations`
Translated content block data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `content_block_id` | uuid | Foreign key to `content_blocks.id` |
| `language_code` | text | ISO language code |
| `content` | jsonb | Translated content |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(content_block_id, language_code)`

---

### `quiz_question_translations`
Translated quiz questions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `quiz_question_id` | uuid | Foreign key to `quiz_questions.id` |
| `language_code` | text | ISO language code |
| `question_text` | text | Translated question |
| `options` | jsonb | Translated answer options |
| `explanation` | text | Translated explanation |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

**Unique Constraint:** `(quiz_question_id, language_code)`

---

## Safety Business Tables

### `territories`
Sales/service territories.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Territory name |
| `code` | text | Unique territory code |
| `region` | text | Geographic region |
| `is_active` | boolean | Operational status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `user_profiles`
Extended user profiles for business features.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `auth_user_id` | uuid | Foreign key to `auth.users.id` |
| `territory_id` | uuid | Foreign key to `territories.id` |
| `first_name` | text | User's first name |
| `last_name` | text | User's last name |
| `email` | text | User's email |
| `phone` | text | Phone number (nullable) |
| `job_title` | text | Job title (nullable) |
| `role` | text | Business role |
| `is_active` | boolean | Account status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `accounts`
Customer/client accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `territory_id` | uuid | Foreign key to `territories.id` |
| `owner_id` | uuid | Foreign key to `user_profiles.id` |
| `name` | text | Account name |
| `type` | text | Account type |
| `industry` | text | Industry (nullable) |
| `website` | text | Website URL (nullable) |
| `phone` | text | Phone number (nullable) |
| `email` | text | Email (nullable) |
| `status` | text | Account status |
| `is_active` | boolean | Active status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `branches`
Account branch locations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` |
| `name` | text | Branch name |
| `address` | text | Physical address (nullable) |
| `city` | text | City (nullable) |
| `state` | text | State (nullable) |
| `zip_code` | text | ZIP code (nullable) |
| `is_primary` | boolean | Primary location flag |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `contacts`
Account contact persons.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` |
| `branch_id` | uuid | Foreign key to `branches.id` (nullable) |
| `owner_id` | uuid | Foreign key to `user_profiles.id` |
| `first_name` | text | Contact's first name |
| `last_name` | text | Contact's last name |
| `email` | text | Email |
| `phone` | text | Phone number (nullable) |
| `mobile` | text | Mobile number (nullable) |
| `job_title` | text | Job title (nullable) |
| `department` | text | Department (nullable) |
| `role` | text | Role (nullable) |
| `is_primary` | boolean | Primary contact flag |
| `is_active` | boolean | Active status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `opportunities`
Sales opportunities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` |
| `contact_id` | uuid | Foreign key to `contacts.id` (nullable) |
| `owner_id` | uuid | Foreign key to `user_profiles.id` |
| `name` | text | Opportunity name |
| `description` | text | Description (nullable) |
| `type` | text | Opportunity type |
| `stage` | text | Current stage |
| `source` | text | Lead source (nullable) |
| `probability` | text | Win probability (nullable) |
| `amount` | numeric | Estimated value (nullable) |
| `close_date` | date | Expected close date (nullable) |
| `status` | text | Status |
| `is_active` | boolean | Active status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `activity_logs`
Business activity tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` (nullable) |
| `contact_id` | uuid | Foreign key to `contacts.id` (nullable) |
| `user_id` | uuid | Foreign key to `user_profiles.id` |
| `type` | text | Activity type |
| `subject` | text | Activity subject |
| `description` | text | Description (nullable) |
| `status` | text | Status (nullable) |
| `priority` | text | Priority (nullable) |
| `scheduled_at` | timestamp | Scheduled time (nullable) |
| `duration` | interval | Duration (nullable) |
| `outcome` | text | Outcome (nullable) |
| `created_at` | timestamp | Record creation time |

---

### `products`
Product catalog.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `territory_id` | uuid | Foreign key to `territories.id` (nullable) |
| `name` | text | Product name |
| `sku` | text | SKU code (nullable) |
| `description` | text | Description (nullable) |
| `category` | text | Product category (nullable) |
| `unit_price` | numeric | Unit price (nullable) |
| `unit_of_measure` | text | Unit (nullable) |
| `is_active` | boolean | Active status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `projects`
Project tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` |
| `owner_id` | uuid | Foreign key to `user_profiles.id` |
| `name` | text | Project name |
| `description` | text | Description (nullable) |
| `status` | text | Project status |
| `start_date` | date | Start date (nullable) |
| `end_date` | date | End date (nullable) |
| `estimated_hours` | numeric | Estimated hours (nullable) |
| `actual_hours` | numeric | Actual hours (nullable) |
| `is_active` | boolean | Active status |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

---

### `sales_facts`
Sales analytics/reporting data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `account_id` | uuid | Foreign key to `accounts.id` (nullable) |
| `opportunity_id` | uuid | Foreign key to `opportunities.id` (nullable) |
| `user_id` | uuid | Foreign key to `user_profiles.id` |
| `fact_type` | text | Type of fact/metric |
| `fact_date` | date | Fact date |
| `amount` | numeric | Amount (nullable) |
| `quantity` | numeric | Quantity (nullable) |
| `metadata` | jsonb | Additional data (nullable) |
| `created_at` | timestamp | Record creation time |

---

## Indexes

### Performance Indexes
Key indexes for common query patterns:

```sql
-- Profiles
CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_plant_id ON profiles(plant_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enrollments
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_enrollments_plant_id ON enrollments(plant_id);

-- Course Sections
CREATE INDEX idx_course_sections_course_id ON course_sections(course_id);
CREATE INDEX idx_course_sections_order ON course_sections(course_id, order_index);

-- Content Blocks
CREATE INDEX idx_content_blocks_section_id ON content_blocks(section_id);
CREATE INDEX idx_content_blocks_order ON content_blocks(section_id, order_index);

-- Quiz Questions
CREATE INDEX idx_quiz_questions_section_id ON quiz_questions(section_id);

-- User Progress
CREATE INDEX idx_user_progress_user_section ON user_progress(user_id, section_id);
```

---

## RLS (Row Level Security) Policies

All tables have RLS enabled. Key policies:

### Profiles
- Users can read their own profile
- Managers can read profiles in their plant
- Admins can read all profiles

### Courses & Content
- All authenticated users can read published content
- Admins can read unpublished content
- Only admins can create/update/delete

### Progress & Attempts
- Users can read/update their own progress
- Managers can read progress for their plant users
- Admins can read all progress

### Business Tables
- Scoped by territory_id
- Users can only access data in their territory
- Managers can see all data in their territory
- Admins have full access

---

## Migration Management

Migrations are managed by Drizzle Kit:

```bash
# Generate new migration from schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# Push schema directly (dev only, skips migration files)
pnpm db:push
```

Migration files are stored in `/drizzle/` directory.

---

## Data Integrity Rules

### Cascade Deletes
- Deleting a course → deletes all sections, content blocks, quizzes
- Deleting a section → deletes all content blocks and quizzes
- Deleting a plant → does NOT delete profiles (set to NULL instead)
- Deleting a user → maintains audit trail (soft delete preferred)

### Required Relationships
- Every `profile` must have a valid `plant_id`
- Every `enrollment` requires valid `user_id`, `course_id`, `plant_id`
- Every `content_block` requires valid `section_id`
- Every `quiz_question` requires valid `section_id`

### Unique Constraints
- `profiles.email` must be unique
- `courses.slug` must be unique
- `(course_id, section_key)` must be unique
- `(section_id, order_index)` must be unique

---

## Best Practices

### Querying
- Always use Drizzle ORM (type-safe)
- Use prepared statements for repeated queries
- Implement pagination for large result sets
- Use indexes for frequently queried columns

### Data Modification
- Always validate input with Zod schemas
- Use transactions for multi-table operations
- Update `updated_at` timestamps
- Log significant changes in `audit_log`

### Multi-Tenancy
- Always scope queries by `plant_id` or `territory_id`
- Verify RLS policies are active
- Never bypass RLS in application code
- Use Supabase client for automatic RLS enforcement

---

For implementation details, see:
- Schema definitions: `apps/safety-lms/src/lib/db/schema/`
- Query functions: `apps/safety-lms/src/lib/db/queries/`
- Validation schemas: `apps/safety-lms/src/lib/validations/`

