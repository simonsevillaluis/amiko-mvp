-- Migration 001: add birth_date and email to student_profiles
--
-- Por qué existe esta migración:
--   schema.sql usa CREATE TABLE IF NOT EXISTS, que NO agrega columnas nuevas
--   a una tabla que ya existe. Estas dos columnas fueron agregadas al CREATE TABLE
--   después de que la tabla ya estaba creada en la base de datos de producción,
--   por lo que el INSERT en create-student.ts fallaba con error 42703
--   ("column does not exist").
--
-- Cómo aplicarla:
--   1. Abre Supabase Dashboard → SQL Editor
--   2. Pega y ejecuta este script completo
--   3. Verifica en Table Editor que student_profiles tiene birth_date y email
--
-- Esta migración es idempotente: ADD COLUMN IF NOT EXISTS no falla si la columna
-- ya existe (por ejemplo, en entornos recién creados desde schema.sql).

alter table public.student_profiles
  add column if not exists birth_date date,
  add column if not exists email text;
