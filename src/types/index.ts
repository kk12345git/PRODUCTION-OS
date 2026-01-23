// Re-export database types from lib
export type { Database } from '../lib/database.types';

// User types
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
}

// Hospital types
export type HospitalStatus = 'ACTIVE' | 'INACTIVE';

export interface Hospital {
    id: string;
    name: string;
    location: string | null;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    status: HospitalStatus;
    created_at: string;
}

// Product Category types
export interface ProductCategory {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

// Product types
export interface Product {
    id: string;
    name: string;
    category_id: string | null;
    gsm?: number | null;
    size1?: string | null;
    size2?: string | null;
    size3?: string | null;
    target_per_hour: number;
    created_at: string;
    // Joined data
    category?: ProductCategory;
}


// Employee types
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
    id: string;
    name: string;
    role: string;
    email: string | null;
    phone: string | null;
    status: EmployeeStatus;
    created_at: string;
}

// Production Entry types
export type Shift = 'A' | 'B' | 'C';
export type ProductionStatus = 'DRAFT' | 'COMPLETED' | 'APPROVED';
export type DestinationType = 'HOSPITAL' | 'WAREHOUSE';

// Activity Log types
export interface ActivityLog {
    id: string;
    user_id: string | null;
    action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
    entity_type: 'ENTRY' | 'EMPLOYEE' | 'HOSPITAL' | 'CATEGORY' | 'PRODUCT';
    entity_id: string | null;
    details: Record<string, any> | null;
    created_at: string;
}

export interface ChecklistData {
    lineStartOnTime?: boolean;
    cleanlinessCheck?: boolean;
    safetyCheck?: boolean;
    qualityCheck?: boolean;
    [key: string]: boolean | undefined;
}

export interface ProductionEntry {
    id: string;
    created_at: string;
    date: string;
    shift: Shift;
    hospital_id: string | null;
    production_category: string;
    product_id: string | null;
    category_id: string | null;
    employee_id: string | null;
    start_time: string | null;
    end_time: string | null;
    planned_qty: number;
    actual_qty: number;
    rejected_qty: number;
    efficiency: number | null;
    discipline_score: number | null;
    checklist_data: ChecklistData | null;
    remarks: string | null;
    additional_notes: string | null;
    status: ProductionStatus;
}

// Form input types
export interface ProductionEntryInput {
    date: string;
    shift: Shift;
    destination_type: DestinationType;
    hospital_id?: string;
    production_category: string;
    product_id: string;
    category_id?: string;
    employee_id?: string;
    start_time?: string;
    end_time?: string;
    planned_qty: number;
    actual_qty: number;
    rejected_qty: number;
    efficiency?: number;
    discipline_score?: number;
    checklist_data?: ChecklistData;
    remarks?: string;
    additional_notes?: string;
    status?: ProductionStatus;
}

// Constants for the application
export const PRODUCTION_CATEGORIES = [
    'Assembly',
    'Packaging',
    'Quality Control',
    'Sterilization',
    'Labeling',
    'Final Inspection',
];

// Note: Employee roles are now user-defined (free text input)
// Common examples: Operator, Supervisor, Quality Inspector, Maintenance, Line Leader, Manager, etc.

// ============================================
// INVENTORY MANAGEMENT TYPES
// ============================================

export type ItemType = 'RAW_MATERIAL' | 'IPP' | 'ANCILLARY';
export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT';
export type ReferenceType = 'PURCHASE' | 'PRODUCTION' | 'USAGE' | 'RETURN' | 'ADJUSTMENT';

export interface InventoryItem {
    id: string;
    name: string;
    item_type: ItemType;
    category_id: string | null;
    sku: string | null;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    unit_cost: number | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    // Joined data
    category?: ProductCategory;
}

export interface StockTransaction {
    id: string;
    item_id: string;
    transaction_type: TransactionType;
    quantity: number;
    reference_type: string | null;
    reference_id: string | null;
    notes: string | null;
    performed_by: string | null;
    transaction_date: string;
    created_at: string;
    // Joined data
    item?: InventoryItem;
    employee?: Employee;
}

export interface InventoryItemInput {
    name: string;
    item_type: ItemType;
    category_id?: string;
    sku?: string;
    unit: string;
    minimum_stock?: number;
    unit_cost?: number;
    description?: string;
}

export interface StockTransactionInput {
    item_id: string;
    transaction_type: TransactionType;
    quantity: number;
    reference_type?: ReferenceType;
    reference_id?: string;
    notes?: string;
    performed_by?: string;
    transaction_date?: string;
}

export interface LowStockItem {
    id: string;
    name: string;
    item_type: ItemType;
    sku: string | null;
    current_stock: number;
    minimum_stock: number;
    unit: string;
    shortage: number;
}

