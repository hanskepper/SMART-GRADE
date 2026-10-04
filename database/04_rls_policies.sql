-- ============================================================
-- SMART GRADE - ROW LEVEL SECURITY (RLS) POLICIES
-- Complete security rules for all tables
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;

-- Table: students
CREATE POLICY "students_select_own" ON students
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = id
);

CREATE POLICY "students_insert_new" ON students
FOR INSERT WITH CHECK (true);

CREATE POLICY "students_update_own" ON students
FOR UPDATE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = id
);

-- Table: profiles
CREATE POLICY "profiles_select_own" ON profiles
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "profiles_insert_own" ON profiles
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "profiles_update_own" ON profiles
FOR UPDATE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: subjects (public read)
CREATE POLICY "subjects_read_all" ON subjects
FOR SELECT USING (true);

-- Table: student_subjects
CREATE POLICY "student_subjects_select_own" ON student_subjects
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "student_subjects_insert_own" ON student_subjects
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "student_subjects_update_own" ON student_subjects
FOR UPDATE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: grades
CREATE POLICY "grades_select_own" ON grades
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "grades_insert_own" ON grades
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "grades_update_own" ON grades
FOR UPDATE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "grades_delete_own" ON grades
FOR DELETE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: achievements
CREATE POLICY "achievements_select_own" ON achievements
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "achievements_insert_own" ON achievements
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: flashcards
CREATE POLICY "flashcards_select_own" ON flashcards
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "flashcards_insert_own" ON flashcards
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "flashcards_delete_own" ON flashcards
FOR DELETE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: notes
CREATE POLICY "notes_select_own" ON notes
FOR SELECT USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "notes_insert_own" ON notes
FOR INSERT WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "notes_update_own" ON notes
FOR UPDATE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

CREATE POLICY "notes_delete_own" ON notes
FOR DELETE USING (
  (current_setting('request.headers', true)::json ->> 'x-student-id')::bigint = student_id
);

-- Table: homeworks (public read)
CREATE POLICY "homeworks_read_all" ON homeworks
FOR SELECT USING (true);