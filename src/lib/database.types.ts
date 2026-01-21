// Database types generated from Supabase schema
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    role: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    role?: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | null
                    created_at?: string
                }
            }
            hospitals: {
                Row: {
                    id: string
                    name: string
                    location: string | null
                    contact_person: string | null
                    phone: string | null
                    email: string | null
                    status: 'ACTIVE' | 'INACTIVE'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    location?: string | null
                    contact_person?: string | null
                    phone?: string | null
                    email?: string | null
                    status?: 'ACTIVE' | 'INACTIVE'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    location?: string | null
                    contact_person?: string | null
                    phone?: string | null
                    email?: string | null
                    status?: 'ACTIVE' | 'INACTIVE'
                    created_at?: string
                }
            }
            product_categories: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    category_id: string | null
                    target_per_hour: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category_id?: string | null
                    target_per_hour: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category_id?: string | null
                    target_per_hour?: number
                    created_at?: string
                }
            }
            employees: {
                Row: {
                    id: string
                    name: string
                    role: string
                    email: string | null
                    phone: string | null
                    status: 'ACTIVE' | 'INACTIVE'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    role: string
                    email?: string | null
                    phone?: string | null
                    status?: 'ACTIVE' | 'INACTIVE'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    role?: string
                    email?: string | null
                    phone?: string | null
                    status?: 'ACTIVE' | 'INACTIVE'
                    created_at?: string
                }
            }
            production_entries: {
                Row: {
                    id: string
                    created_at: string
                    date: string
                    shift: 'A' | 'B' | 'C' | null
                    hospital_id: string | null
                    production_category: string
                    product_id: string | null
                    category_id: string | null
                    employee_id: string | null
                    start_time: string | null
                    end_time: string | null
                    planned_qty: number
                    actual_qty: number
                    rejected_qty: number
                    efficiency: number | null
                    discipline_score: number | null
                    checklist_data: Json | null
                    remarks: string | null
                    additional_notes: string | null
                    status: 'DRAFT' | 'COMPLETED' | 'APPROVED'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    date: string
                    shift?: 'A' | 'B' | 'C' | null
                    hospital_id?: string | null
                    production_category: string
                    product_id?: string | null
                    category_id?: string | null
                    employee_id?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    planned_qty?: number
                    actual_qty?: number
                    rejected_qty?: number
                    efficiency?: number | null
                    discipline_score?: number | null
                    checklist_data?: Json | null
                    remarks?: string | null
                    additional_notes?: string | null
                    status?: 'DRAFT' | 'COMPLETED' | 'APPROVED'
                }
                Update: {
                    id?: string
                    created_at?: string
                    date?: string
                    shift?: 'A' | 'B' | 'C' | null
                    hospital_id?: string | null
                    production_category?: string
                    product_id?: string | null
                    category_id?: string | null
                    employee_id?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    planned_qty?: number
                    actual_qty?: number
                    rejected_qty?: number
                    efficiency?: number | null
                    discipline_score?: number | null
                    checklist_data?: Json | null
                    remarks?: string | null
                    additional_notes?: string | null
                    status?: 'DRAFT' | 'COMPLETED' | 'APPROVED'
                }
            }
            activity_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    action_type: string
                    entity_type: string
                    entity_id: string | null
                    details: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    action_type: string
                    entity_type: string
                    entity_id?: string | null
                    details?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    action_type?: string
                    entity_type?: string
                    entity_id?: string | null
                    details?: Json | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
