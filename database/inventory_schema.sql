-- Inventory Management System - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================
-- 1. INVENTORY ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (
        item_type IN ('RAW_MATERIAL', 'IPP', 'ANCILLARY')
    ),
    category_id UUID REFERENCES product_categories(id) ON DELETE
    SET NULL,
        sku TEXT UNIQUE,
        -- Stock Keeping Unit
        unit TEXT NOT NULL DEFAULT 'pieces',
        -- 'kg', 'pieces', 'liters', 'meters', etc.
        current_stock DECIMAL(12, 2) DEFAULT 0 CHECK (current_stock >= 0),
        minimum_stock DECIMAL(12, 2) DEFAULT 0,
        unit_cost DECIMAL(12, 2),
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================
-- 2. STOCK TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity DECIMAL(12, 2) NOT NULL CHECK (quantity != 0),
    reference_type TEXT,
    -- 'PURCHASE', 'PRODUCTION', 'USAGE', 'RETURN', 'ADJUSTMENT'
    reference_id UUID,
    -- Link to production entry or other record
    notes TEXT,
    performed_by UUID REFERENCES employees(id) ON DELETE
    SET NULL,
        transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================
-- 3. INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_inventory_items_type ON inventory_items(item_type);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_item ON stock_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_date ON stock_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_type ON stock_transactions(transaction_type);
-- ============================================
-- 4. FUNCTION: Update stock on transaction
-- ============================================
CREATE OR REPLACE FUNCTION update_inventory_stock() RETURNS TRIGGER AS $$ BEGIN -- Update current stock based on transaction type
    IF NEW.transaction_type = 'IN'
    OR NEW.transaction_type = 'ADJUSTMENT' THEN
UPDATE inventory_items
SET current_stock = current_stock + ABS(NEW.quantity),
    updated_at = NOW()
WHERE id = NEW.item_id;
ELSIF NEW.transaction_type = 'OUT' THEN
UPDATE inventory_items
SET current_stock = current_stock - ABS(NEW.quantity),
    updated_at = NOW()
WHERE id = NEW.item_id;
-- Prevent negative stock
IF (
    SELECT current_stock
    FROM inventory_items
    WHERE id = NEW.item_id
) < 0 THEN RAISE EXCEPTION 'Insufficient stock for this transaction';
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- ============================================
-- 5. TRIGGER: Auto-update stock on transaction
-- ============================================
DROP TRIGGER IF EXISTS trigger_update_stock ON stock_transactions;
CREATE TRIGGER trigger_update_stock
AFTER
INSERT ON stock_transactions FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();
-- ============================================
-- 6. FUNCTION: Update timestamp on item update
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
CREATE TRIGGER update_inventory_items_updated_at BEFORE
UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ============================================
-- 7. ROW LEVEL SECURITY (Disable for now)
-- ============================================
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions DISABLE ROW LEVEL SECURITY;
-- ============================================
-- 8. VIEW: Low Stock Items
-- ============================================
CREATE OR REPLACE VIEW low_stock_items AS
SELECT id,
    name,
    item_type,
    sku,
    current_stock,
    minimum_stock,
    unit,
    (minimum_stock - current_stock) as shortage
FROM inventory_items
WHERE current_stock <= minimum_stock
ORDER BY (minimum_stock - current_stock) DESC;
-- ============================================
-- Verification Query
-- ============================================
SELECT 'Tables created successfully!' as status;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('inventory_items', 'stock_transactions');