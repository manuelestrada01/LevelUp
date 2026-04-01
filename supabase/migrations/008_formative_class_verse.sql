-- Add Bible verse fields to formative_classes
alter table formative_classes
  add column if not exists verse_text text,
  add column if not exists verse_reference text;
