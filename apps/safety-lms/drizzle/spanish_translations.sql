-- Spanish translations for Function-Specific HazMat Training course
-- Generated: 2025-10-17

-- =====================================================================================
-- COURSE TRANSLATION
-- =====================================================================================

INSERT INTO course_translations (id, course_id, language_code, title, description, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '6d533fa3-5305-4a34-a42c-17d58900f9d5',
  'es',
  'Capacitación Específica por Función - Materiales Peligrosos',
  'Manejo, Empaque y Envío de Materiales Regulados por DOT',
  NOW(),
  NOW()
);

-- =====================================================================================
-- SECTION TRANSLATIONS
-- =====================================================================================

-- Section 1: Introduction & Overview
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'es',
  'Introducción y Resumen',
  NOW(),
  NOW()
);

-- Section 2: UN-Rated Packaging Fundamentals
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'es',
  'Fundamentos del Empaque Calificado UN',
  NOW(),
  NOW()
);

-- Section 3: When UN-Rated Packaging is Required
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  'es',
  'Cuándo se Requiere Empaque Calificado UN',
  NOW(),
  NOW()
);

-- Section 4: Responsibility & Compliance
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444444',
  'es',
  'Responsabilidad y Cumplimiento',
  NOW(),
  NOW()
);

-- Section 5: Finding Information Sources
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '55555555-5555-5555-5555-555555555555',
  'es',
  'Fuentes de Información sobre Empaque',
  NOW(),
  NOW()
);

-- Section 6: Information Sources Quiz (no translation needed - it's a quiz section)
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '66666666-6666-6666-6666-666666666666',
  'es',
  'Verificación de Conocimiento',
  NOW(),
  NOW()
);

-- Section 7: Closing Instructions Source
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '77777777-7777-7777-7777-777777777777',
  'es',
  'Procedimientos de Cierre del Empaque',
  NOW(),
  NOW()
);

-- Section 8: Package Marking Requirements
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '88888888-8888-8888-8888-888888888888',
  'es',
  'Marcado y Etiquetado de Empaque',
  NOW(),
  NOW()
);

-- Section 9: Proper Closure Procedures
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '99999999-9999-9999-9999-999999999999',
  'es',
  'Mejores Prácticas y Procedimientos',
  NOW(),
  NOW()
);

-- Section 10: Final Knowledge Check (quiz section)
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'es',
  'Verificación de Conocimiento Final',
  NOW(),
  NOW()
);

-- Section 11: Course Summary & Completion
INSERT INTO section_translations (id, section_id, language_code, title, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'es',
  'Conclusión y Certificación',
  NOW(),
  NOW()
);

-- =====================================================================================
-- CONTENT BLOCK TRANSLATIONS - SECTION 1 (Introduction)
-- =====================================================================================

-- Hero block (11111111-1111-1111-1111-111111111101)
INSERT INTO content_block_translations (id, content_block_id, language_code, content, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111101',
  'es',
  jsonb_build_object(
    'title', 'Capacitación Profesional SpecChem',
    'subtitle', 'Bienvenido a la Capacitación Específica por Función de SpecChem',
    'badge', 'Capacitación Certificada'
  ),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM content_blocks WHERE id = '11111111-1111-1111-1111-111111111101');

-- Text block - Welcome message (11111111-1111-1111-1111-111111111102)
INSERT INTO content_block_translations (id, content_block_id, language_code, content, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111102',
  'es',
  jsonb_build_object(
    'content', 'Este curso integral de capacitación cubre los requisitos y expectativas para el manejo, empaque y envío de materiales regulados por DOT en su trabajo en SpecChem.'
  ),
  NOW(),
  NOW()
WHERE EXISTS (SELECT 1 FROM content_blocks WHERE id = '11111111-1111-1111-1111-111111111102');

-- Note: Additional content blocks would follow the same pattern
-- For brevity, I'll create a script to handle these programmatically

-- =====================================================================================
-- QUIZ QUESTION TRANSLATIONS - Example
-- =====================================================================================

-- Quiz question about UN packaging substitution (Section 3)
-- This would need the actual quiz question IDs from the database
-- Example format:
-- INSERT INTO quiz_question_translations (id, quiz_question_id, language_code, question_text, options, correct_answer, explanation, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   '<quiz_question_id>',
--   'es',
--   'Si está empacando material regulado por DOT y encuentra que no tiene suficientes contenedores calificados UN para completar la producción, puede sustituir contenedores no calificados UN siempre que el número de cubetas no calificadas UN sea menos del 10% del total empacado.',
--   NULL,
--   jsonb_build_object('type', 'boolean', 'value', false),
--   'Falso. Nunca es aceptable sustituir empaque no calificado UN cuando se trabaja con materiales clasificados como peligrosos. No hay excepciones.',
--   NOW(),
--   NOW()
-- );


