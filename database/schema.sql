-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Create Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'SUPERVISOR', 'OPERATOR')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Create Hospitals Table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    location TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Create Product Categories Table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Create Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category_id UUID REFERENCES product_categories(id) ON DELETE
    SET NULL,
        target_per_hour INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 5. Create Employees Table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 6. Create Production Entries Table
CREATE TABLE production_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date DATE NOT NULL,
    shift TEXT CHECK (shift IN ('A', 'B', 'C')),
    -- Hospital and Category
    hospital_id UUID REFERENCES hospitals(id),
    production_category TEXT NOT NULL,
    product_id UUID REFERENCES products(id),
    category_id UUID REFERENCES product_categories(id),
    -- Employee Assignment
    employee_id UUID REFERENCES employees(id),
    -- Time Tracking
    start_time TIME,
    end_time TIME,
    -- The Numbers
    planned_qty INTEGER DEFAULT 0,
    actual_qty INTEGER DEFAULT 0,
    rejected_qty INTEGER DEFAULT 0,
    efficiency DECIMAL(5, 2),
    -- The Discipline Score
    discipline_score INTEGER,
    checklist_data JSONB,
    -- Remarks and Status
    remarks TEXT,
    additional_notes TEXT,
    status TEXT CHECK (status IN ('DRAFT', 'COMPLETED', 'APPROVED')) DEFAULT 'DRAFT'
);
-- 7. Create Activity Logs Table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    -- Nullable if auth is optional
    action_type TEXT NOT NULL,
    -- 'CREATE', 'UPDATE', 'DELETE'
    entity_type TEXT NOT NULL,
    -- 'ENTRY', 'EMPLOYEE', 'HOSPITAL', 'CATEGORY', 'PRODUCT'
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 8. Create RLS Policies
ALTER TABLE production_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
-- Indexes for better performance
CREATE INDEX idx_production_entries_date ON production_entries(date);
CREATE INDEX idx_production_entries_shift ON production_entries(shift);
CREATE INDEX idx_production_entries_product_id ON production_entries(product_id);
CREATE INDEX idx_production_entries_hospital_id ON production_entries(hospital_id);
CREATE INDEX idx_production_entries_employee_id ON production_entries(employee_id);
CREATE INDEX idx_production_entries_category_id ON production_entries(category_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
-- RLS Policies
-- Production Entries
CREATE POLICY "Allow authenticated users to read production entries" ON production_entries FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert production entries" ON production_entries FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update production entries" ON production_entries FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete production entries" ON production_entries FOR DELETE TO authenticated USING (true);
-- Employees
CREATE POLICY "Allow authenticated users to read employees" ON employees FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage employees" ON employees FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Product Categories
CREATE POLICY "Allow authenticated users to read categories" ON product_categories FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage categories" ON product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Hospitals
CREATE POLICY "Allow authenticated users to read hospitals" ON hospitals FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage hospitals" ON hospitals FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Activity Logs
CREATE POLICY "Allow authenticated users to read logs" ON activity_logs FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert logs" ON activity_logs FOR
INSERT TO authenticated WITH CHECK (true);