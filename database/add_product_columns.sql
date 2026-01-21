-- Run this in Supabase SQL Editor to add GSM and size columns to products table
-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS gsm INTEGER;
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size1 TEXT;
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size2 TEXT;
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size3 TEXT;
-- Verify the changes
SELECT column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'products';