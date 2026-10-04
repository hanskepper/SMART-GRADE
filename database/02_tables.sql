-- ============================================================
-- SMART GRADE - TABLES
-- Complete table structure with all columns and constraints
-- ============================================================

-- Table: students
CREATE TABLE public.students (
  id bigint NOT NULL DEFAULT nextval('students_id_seq'::regclass),
  name text NOT NULL,
  class text NOT NULL CHECK (class = ANY (ARRAY['B1'::text, 'B2'::text])),
  number integer NOT NULL CHECK (number >= 1 AND number <= 70),
  gender text NOT NULL DEFAULT 'boy'::text CHECK (gender = ANY (ARRAY['boy'::text, 'girl'::text])),
  pin_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  has_fingerprint boolean DEFAULT false,
  fingerprint_hash text,
  CONSTRAINT students_pkey PRIMARY KEY (id)
);

-- Table: profiles
CREATE TABLE public.profiles (
  id bigint NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
  student_id bigint NOT NULL UNIQUE,
  avatar_base64 text DEFAULT ''::text,
  bio text DEFAULT ''::text,
  goal numeric DEFAULT 12,
  streak_days integer DEFAULT 0,
  last_login date,
  favorites jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);

-- Table: subjects
CREATE TABLE public.subjects (
  id integer NOT NULL DEFAULT nextval('subjects_id_seq'::regclass),
  name text NOT NULL UNIQUE,
  code text NOT NULL,
  icon text DEFAULT 'fa-book'::text,
  default_coefficient integer DEFAULT 5 CHECK (default_coefficient >= 1 AND default_coefficient <= 10),
  CONSTRAINT subjects_pkey PRIMARY KEY (id)
);

-- Table: student_subjects
CREATE TABLE public.student_subjects (
  id bigint NOT NULL DEFAULT nextval('student_subjects_id_seq'::regclass),
  student_id bigint NOT NULL,
  subject_id integer NOT NULL,
  term integer NOT NULL CHECK (term = ANY (ARRAY[1, 2, 3])),
  coefficient integer DEFAULT 5 CHECK (coefficient >= 1 AND coefficient <= 10),
  CONSTRAINT student_subjects_pkey PRIMARY KEY (id),
  CONSTRAINT student_subjects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
  CONSTRAINT student_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE
);

-- Table: grades
CREATE TABLE public.grades (
  id bigint NOT NULL DEFAULT nextval('grades_id_seq'::regclass),
  student_id bigint NOT NULL,
  subject_id integer NOT NULL,
  sequence_id integer NOT NULL CHECK (sequence_id >= 1 AND sequence_id <= 6),
  value numeric NOT NULL CHECK (value >= 0::numeric AND value <= 20::numeric),
  date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grades_pkey PRIMARY KEY (id),
  CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
  CONSTRAINT grades_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE
);

-- Table: achievements
CREATE TABLE public.achievements (
  id bigint NOT NULL DEFAULT nextval('achievements_id_seq'::regclass),
  student_id bigint NOT NULL,
  badge_id integer NOT NULL,
  unlocked boolean DEFAULT true,
  unlock_date date DEFAULT CURRENT_DATE,
  CONSTRAINT achievements_pkey PRIMARY KEY (id),
  CONSTRAINT achievements_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);

-- Table: flashcards
CREATE TABLE public.flashcards (
  id bigint NOT NULL DEFAULT nextval('flashcards_id_seq'::regclass),
  student_id bigint NOT NULL,
  subject_id integer NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  is_original boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT flashcards_pkey PRIMARY KEY (id),
  CONSTRAINT flashcards_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
  CONSTRAINT flashcards_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE
);

-- Table: notes
CREATE TABLE public.notes (
  id bigint NOT NULL DEFAULT nextval('notes_id_seq'::regclass),
  student_id bigint NOT NULL,
  title text DEFAULT 'Untitled'::text,
  content text DEFAULT ''::text,
  subject text DEFAULT 'General'::text,
  color text DEFAULT '#3498db'::text,
  pinned boolean DEFAULT false,
  important boolean DEFAULT false,
  tags text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE
);

-- Table: homeworks
CREATE TABLE public.homeworks (
  id bigint NOT NULL DEFAULT nextval('homeworks_id_seq'::regclass),
  subject text NOT NULL,
  title text NOT NULL,
  description text DEFAULT ''::text,
  due_date date,
  files jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT homeworks_pkey PRIMARY KEY (id)
);