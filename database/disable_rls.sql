-- Run this in your Supabase SQL Editor to allow public access
-- This disables RLS for development (you can enable it later when you add authentication)
-- Disable RLS on all tables for now
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE production_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
-- OR if you want to keep RLS enabled but allow public access, run these instead:
-- (Comment out the above and uncomment below)
/*
 -- Drop existing restrictive policies
 DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
 DROP POLICY IF EXISTS "Allow authenticated users to manage employees" ON employees;
 DROP POLICY IF EXISTS "Allow authenticated users to read hospitals" ON hospitals;
 DROP POLICY IF EXISTS "Allow authenticated users to manage hospitals" ON hospitals;
 DROP POLICY IF EXISTS "Allow authenticated users to read categories" ON product_categories;
 DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON product_categories;
 DROP POLICY IF EXISTS "Allow authenticated users to read products" ON products;
 DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
 DROP POLICY IF EXISTS "Allow authenticated users to read production entries" ON production_entries;
 DROP POLICY IF EXISTS "Allow authenticated users to manage production entries" ON production_entries;
 DROP POLICY IF EXISTS "Allow authenticated users to delete production entries" ON production_entries;
 DROP POLICY IF EXISTS "Allow authenticated users to read logs" ON activity_logs;
 DROP POLICY IF EXISTS "Allow authenticated users to insert logs" ON activity_logs;
 
 -- Create public access policies
 CREATE POLICY "Allow public read" ON employees FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON employees FOR INSERT WITH CHECK (true);
 CREATE POLICY "Allow public update" ON employees FOR UPDATE USING (true);
 CREATE POLICY "Allow public delete" ON employees FOR DELETE USING (true);
 
 CREATE POLICY "Allow public read" ON hospitals FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON hospitals FOR INSERT WITH CHECK (true);
 CREATE POLICY "Allow public update" ON hospitals FOR UPDATE USING (true);
 CREATE POLICY "Allow public delete" ON hospitals FOR DELETE USING (true);
 
 CREATE POLICY "Allow public read" ON product_categories FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON product_categories FOR INSERT WITH CHECK (true);
 CREATE POLICY "Allow public update" ON product_categories FOR UPDATE USING (true);
 CREATE POLICY "Allow public delete" ON product_categories FOR DELETE USING (true);
 
 CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
 CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
 CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
 
 CREATE POLICY "Allow public read" ON production_entries FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON production_entries FOR INSERT WITH CHECK (true);
 CREATE POLICY "Allow public update" ON production_entries FOR UPDATE USING (true);
 CREATE POLICY "Allow public delete" ON production_entries FOR DELETE USING (true);
 
 CREATE POLICY "Allow public read" ON activity_logs FOR SELECT USING (true);
 CREATE POLICY "Allow public insert" ON activity_logs FOR INSERT WITH CHECK (true);
 */