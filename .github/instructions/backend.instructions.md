---
applyTo: "supabase/**/*.sql, lib/**/*.ts, app/api/**/*.ts"
description: |
  Use when designing database schema, writing queries, or implementing API routes in AMIKO.
  Ensures security, performance, query optimization, and RLS policies.
---

# Backend Best Practices

## Database Security

### Row-Level Security (RLS)

**Always enable RLS** on tables with sensitive data:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Adults see only their own profile
CREATE POLICY "Users see own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Adults can update own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Students are visible to their guardians
CREATE POLICY "Adults see their students" ON student_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT profiles.id FROM profiles 
      WHERE profiles.id = student_profiles.created_by
    )
  );
```

### Environment Variables

**NEVER put in client code**:
- `SUPABASE_SERVICE_ROLE_KEY` (admin key)
- `OPENAI_API_KEY`
- Database credentials

**Safe to expose** (already public):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### API Route Security

```typescript
// app/api/adapt-task/route.ts
import { createServerClient } from '@supabase/ssr';
import { OpenAI } from 'openai';

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ Server-only
);

export async function POST(request: Request) {
  const { task, studentId } = await request.json();
  
  // Verify user is guardian of student
  const { data, error } = await supabase
    .from('student_profiles')
    .select('created_by')
    .eq('id', studentId)
    .single();

  if (data?.created_by !== (await supabase.auth.getSession()).session?.user.id) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Call OpenAI with API key
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // ... adapt task
}
```

## Query Optimization

### Avoid N+1

❌ Bad:
```typescript
const students = await supabase.from('student_profiles').select();
for (const student of students) {
  const tasks = await supabase // N queries!
    .from('tasks').select().eq('student_id', student.id);
}
```

✅ Good:
```typescript
const data = await supabase
  .from('student_profiles')
  .select(`
    id, name,
    tasks(id, title, created_at)
  `);
```

### Add Indexes

```sql
-- Frequently filtered columns
CREATE INDEX idx_tasks_student_id ON tasks(student_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_profiles_created_by ON profiles(created_by);
```

### Pagination

```typescript
const pageSize = 10;
const page = 0;

const { data, count } = await supabase
  .from('tasks')
  .select('*', { count: 'exact' })
  .eq('student_id', studentId)
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

## API Patterns

### Task Adaptation Endpoint

```typescript
// POST /api/adapt-task
{
  "task": "Escribe una redacción sobre tu animal favorito en 500 palabras",
  "studentId": "uuid",
  "studentAge": 10,
  "specialNeeds": ["sensory_sensitivity", "attention_difficulty"]
}

// Response
{
  "steps": [
    { "step": 1, "instruction": "Elige tu animal favorito.", "pictogram": "animal" },
    { "step": 2, "instruction": "Piensa en 3 cosas que te gustan de ese animal.", "pictogram": "thinking" },
    ...
  ],
  "estimatedMinutes": 20,
  "supportiveTips": ["Toma descansos cada 5 minutos"]
}
```

### Progress Tracking

```sql
-- Simplified: track which steps child completed
CREATE TABLE IF NOT EXISTS step_progress (
  id uuid PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  step_index int NOT NULL,
  completed_at timestamp DEFAULT now(),
  feedback text, -- 'lo_hice', 'necesito_ayuda', 'me_frustre'
  UNIQUE(task_id, student_id, step_index)
);
```

---

*Updated: 2026-06-05*
