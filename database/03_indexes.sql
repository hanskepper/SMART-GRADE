-- ============================================================
-- SMART GRADE - INDEXES
-- Performance optimization indexes
-- ============================================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class);
CREATE INDEX IF NOT EXISTS idx_students_number ON public.students(number);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(name);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);

-- Subjects indexes
CREATE INDEX IF NOT EXISTS idx_subjects_name ON public.subjects(name);

-- Student_subjects indexes
CREATE INDEX IF NOT EXISTS idx_student_subjects_student_id ON public.student_subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_subject_id ON public.student_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_term ON public.student_subjects(term);

-- Grades indexes
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON public.grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_sequence_id ON public.grades(sequence_id);
CREATE INDEX IF NOT EXISTS idx_grades_date ON public.grades(date);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_student_id ON public.achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_id ON public.achievements(badge_id);

-- Flashcards indexes
CREATE INDEX IF NOT EXISTS idx_flashcards_student_id ON public.flashcards(student_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_subject_id ON public.flashcards(subject_id);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_student_id ON public.notes(student_id);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON public.notes(pinned);
CREATE INDEX IF NOT EXISTS idx_notes_important ON public.notes(important);

-- Homeworks indexes
CREATE INDEX IF NOT EXISTS idx_homeworks_subject ON public.homeworks(subject);
CREATE INDEX IF NOT EXISTS idx_homeworks_due_date ON public.homeworks(due_date);