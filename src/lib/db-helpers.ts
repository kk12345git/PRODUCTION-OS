/**
 * Database helper functions for Supabase operations
 * This file demonstrates how to interact with the database
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from './supabase';
import type { Database } from './database.types';
import type {
    ProductionEntry as FrontendProductionEntry,
    ActivityLog as FrontendActivityLog
} from '../types';

// Type aliases for cleaner code
type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
type Hospital = Database['public']['Tables']['hospitals']['Row'];
type HospitalInsert = Database['public']['Tables']['hospitals']['Insert'];
type HospitalUpdate = Database['public']['Tables']['hospitals']['Update'];
type Employee = Database['public']['Tables']['employees']['Row'];
type ProductionEntry = Database['public']['Tables']['production_entries']['Row'];
type ProductionEntryInsert = Database['public']['Tables']['production_entries']['Insert'];
type ProductionEntryUpdate = Database['public']['Tables']['production_entries']['Update'];
type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

// ============================================
// ACTIVITY LOGGING (INTERNAL HELPER)
// ============================================

async function logActivity(
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: 'ENTRY' | 'EMPLOYEE' | 'HOSPITAL' | 'CATEGORY' | 'PRODUCT',
    entityId: string | null,
    details: any = null
) {
    try {
        await supabase
            .from('activity_logs')
            .insert({
                action_type: actionType,
                entity_type: entityType,
                entity_id: entityId,
                details: details
            } as any);
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error to prevent blocking main operation
    }
}

// ============================================
// ACTIVITY LOGS
// ============================================

export async function getRecentActivityLogs(limit = 20): Promise<FrontendActivityLog[]> {
    const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return (data as unknown as FrontendActivityLog[]) || [];
}

// ============================================
// HOSPITALS
// ============================================

/**
 * Fetch all hospitals
 */
export async function getAllHospitals(): Promise<Hospital[]> {
    const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');

    if (error) throw error;
    return (data as Hospital[]) || [];
}

/**
 * Create a new hospital
 */
export async function createHospital(hospital: HospitalInsert): Promise<Hospital> {
    const { data, error } = await supabase
        .from('hospitals')
        .insert(hospital as any)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Hospital;

    // Log activity
    await logActivity('CREATE', 'HOSPITAL', row.id, { name: row.name });

    return row;
}

/**
 * Update an existing hospital
 */
export async function updateHospital(
    id: string,
    updates: HospitalUpdate
): Promise<Hospital> {
    const { data, error } = await supabase
        .from('hospitals')
        // @ts-expect-error - Supabase type inference limitation
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Hospital;

    // Log activity
    await logActivity('UPDATE', 'HOSPITAL', row.id, updates);

    return row;
}

/**
 * Delete a hospital
 */
export async function deleteHospital(id: string): Promise<void> {
    const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', id);

    if (error) throw error;

    // Log activity
    await logActivity('DELETE', 'HOSPITAL', id);
}

// ============================================
// EMPLOYEES
// ============================================

/**
 * Fetch all employees
 */
export async function getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');

    if (error) throw error;
    return (data as Employee[]) || [];
}

/**
 * Create a new employee
 */
export async function createEmployee(employee: any): Promise<Employee> {
    const { data, error } = await supabase
        .from('employees')
        .insert(employee as any)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Employee;

    // Log activity
    await logActivity('CREATE', 'EMPLOYEE', row.id, { name: row.name });

    return row;
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: string, updates: any): Promise<Employee> {
    const { data, error } = await supabase
        .from('employees')
        // @ts-expect-error - Supabase type inference
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Employee;

    // Log activity
    await logActivity('UPDATE', 'EMPLOYEE', row.id, updates);

    return row;
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

    if (error) throw error;

    // Log activity
    await logActivity('DELETE', 'EMPLOYEE', id);
}

// ============================================
// PRODUCT CATEGORIES
// ============================================

/**
 * Fetch all product categories
 */
export async function getAllProductCategories(): Promise<ProductCategory[]> {
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

    if (error) throw error;
    return (data as ProductCategory[]) || [];
}

/**
 * Create a new category
 */
export async function createProductCategory(category: any): Promise<ProductCategory> {
    const { data, error } = await supabase
        .from('product_categories')
        .insert(category as any)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as ProductCategory;

    // Log activity
    await logActivity('CREATE', 'CATEGORY', row.id, { name: row.name });

    return row;
}

/**
 * Update an existing category
 */
export async function updateProductCategory(id: string, updates: any): Promise<ProductCategory> {
    const { data, error } = await supabase
        .from('product_categories')
        // @ts-expect-error - Supabase type inference
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as ProductCategory;

    // Log activity
    await logActivity('UPDATE', 'CATEGORY', row.id, updates);

    return row;
}

/**
 * Delete a category
 */
export async function deleteProductCategory(id: string): Promise<void> {
    const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

    if (error) throw error;

    // Log activity
    await logActivity('DELETE', 'CATEGORY', id);
}

// ============================================
// PRODUCTS
// ============================================

/**
 * Fetch all products
 */
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(name)')
        .order('name');

    if (error) throw error;
    return (data as Product[]) || [];
}

/**
 * Create a new product
 */
export async function createProduct(product: any): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert(product as any)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Product;

    // Log activity
    await logActivity('CREATE', 'PRODUCT', row.id, { name: row.name });

    return row;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: any): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        // @ts-expect-error - Supabase type inference
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as Product;

    // Log activity
    await logActivity('UPDATE', 'PRODUCT', row.id, updates);

    return row;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;

    // Log activity
    await logActivity('DELETE', 'PRODUCT', id);
}

// ============================================
// PRODUCTION ENTRIES
// ============================================


/**
 * Fetch production entries with optional filters
 */
export async function getProductionEntries(filters?: {
    date?: string;
    shift?: 'A' | 'B' | 'C';
    hospital_id?: string;
    production_category?: string;
}): Promise<FrontendProductionEntry[]> {
    let query = supabase
        .from('production_entries')
        .select(`
      *,
      products (
        id,
        name,
        target_per_hour
      ),
      hospitals (
        id,
        name
      ),
      employees (
        id,
        name
      )
    `)
        .order('created_at', { ascending: false });

    if (filters?.date) {
        query = query.eq('date', filters.date);
    }
    if (filters?.shift) {
        query = query.eq('shift', filters.shift);
    }
    if (filters?.hospital_id) {
        query = query.eq('hospital_id', filters.hospital_id);
    }
    if (filters?.production_category) {
        query = query.eq('production_category', filters.production_category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data as unknown as FrontendProductionEntry[]) || [];
}

/**
 * Create a new production entry
 */
export async function createProductionEntry(
    entry: ProductionEntryInsert
): Promise<ProductionEntry> {
    const { data, error } = await supabase
        .from('production_entries')
        .insert(entry as any)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as ProductionEntry;

    // Log activity
    await logActivity('CREATE', 'ENTRY', row.id, {
        date: row.date,
        shift: row.shift,
        category: row.production_category,
        hospital: row.hospital_id
    });

    return row;
}

/**
 * Update an existing production entry
 */
export async function updateProductionEntry(
    id: string,
    updates: ProductionEntryUpdate
): Promise<ProductionEntry> {
    const { data, error } = await supabase
        .from('production_entries')
        // @ts-expect-error - Supabase type inference limitation
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw error;
    const row = data as ProductionEntry;

    // Log activity
    await logActivity('UPDATE', 'ENTRY', row.id, updates);

    return row;
}

/**
 * Delete a production entry
 */
export async function deleteProductionEntry(id: string): Promise<void> {
    const { error } = await supabase
        .from('production_entries')
        .delete()
        .eq('id', id);

    if (error) throw error;

    // Log activity
    await logActivity('DELETE', 'ENTRY', id);
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Get production summary for a date range
 */
export async function getProductionSummary(startDate: string, endDate: string) {
    const { data, error } = await supabase
        .from('production_entries')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) throw error;

    const entries = (data as ProductionEntry[]) || [];

    // Calculate totals
    const summary = {
        totalPlanned: entries.reduce((sum, entry) => sum + (entry.planned_qty || 0), 0),
        totalActual: entries.reduce((sum, entry) => sum + (entry.actual_qty || 0), 0),
        totalRejected: entries.reduce((sum, entry) => sum + (entry.rejected_qty || 0), 0),
        averageEfficiency: entries.length
            ? entries.reduce((sum, entry) => sum + (entry.efficiency || 0), 0) / entries.length
            : 0,
        entriesCount: entries.length,
        averageDiscipline: entries.length
            ? entries.reduce((sum, entry) => sum + (entry.discipline_score || 0), 0) / entries.length
            : 0,
    };

    return summary;
}

/**
 * Get daily production stats for the last 7 days for charts
 */
export async function getWeeklyStats(): Promise<any[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('production_entries')
        .select('date, planned_qty, actual_qty, efficiency')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');

    if (error) throw error;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Group by date
    const statsMap = (data as any[] || []).reduce((acc: any, curr) => {
        const date = new Date(curr.date);
        const dayName = dayNames[date.getDay()];
        if (!acc[dayName]) {
            acc[dayName] = { name: dayName, planned: 0, actual: 0, effSum: 0, count: 0, date: curr.date };
        }
        acc[dayName].planned += curr.planned_qty || 0;
        acc[dayName].actual += curr.actual_qty || 0;
        acc[dayName].effSum += curr.efficiency || 0;
        acc[dayName].count += 1;
        return acc;
    }, {});

    // Ensure we have all last 7 days even if no data
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = dayNames[d.getDay()];
        const stat = statsMap[dayName] || { name: dayName, planned: 0, actual: 0, effSum: 0, count: 0 };
        result.push({
            name: stat.name,
            planned: stat.planned,
            actual: stat.actual,
            eff: stat.count > 0 ? Number((stat.effSum / stat.count).toFixed(2)) : 0
        });
    }

    return result;
}

/**
 * Get production grouped by category
 */
export async function getStatsByCategory(startDate: string, endDate: string): Promise<any[]> {
    const { data, error } = await supabase
        .from('production_entries')
        .select('production_category, actual_qty, planned_qty, efficiency')
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) throw error;

    const stats = (data as any[] || []).reduce((acc: any, curr) => {
        const cat = curr.production_category || 'Uncategorized';
        if (!acc[cat]) {
            acc[cat] = { category: cat, actual: 0, planned: 0, effSum: 0, count: 0 };
        }
        acc[cat].actual += curr.actual_qty || 0;
        acc[cat].planned += curr.planned_qty || 0;
        acc[cat].effSum += curr.efficiency || 0;
        acc[cat].count += 1;
        return acc;
    }, {});

    return Object.values(stats).map((s: any) => ({
        name: s.category,
        actual: s.actual,
        planned: s.planned,
        efficiency: s.count > 0 ? Number((s.effSum / s.count).toFixed(2)) : 0
    }));
}

// ============================================
// ADVANCED ANALYTICS
// ============================================

/**
 * Get comparative summary - compares current period with previous period
 */
export async function getComparativeSummary(startDate: string, endDate: string) {
    // Calculate previous period dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - daysDiff);

    const prevStartStr = prevStart.toISOString().split('T')[0];
    const prevEndStr = prevEnd.toISOString().split('T')[0];

    // Get both periods
    const [current, previous] = await Promise.all([
        getProductionSummary(startDate, endDate),
        getProductionSummary(prevStartStr, prevEndStr)
    ]);

    // Calculate percentage changes
    const calcChange = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    return {
        current,
        previous,
        changes: {
            production: calcChange(current.totalActual, previous.totalActual),
            efficiency: calcChange(current.averageEfficiency, previous.averageEfficiency),
            rejections: calcChange(current.totalRejected, previous.totalRejected),
            discipline: calcChange(current.averageDiscipline, previous.averageDiscipline),
        }
    };
}

/**
 * Get employee rankings by performance
 */
export async function getEmployeeRankings(startDate: string, endDate: string) {
    const { data, error } = await supabase
        .from('production_entries')
        .select(`
            employee_id,
            actual_qty,
            planned_qty,
            efficiency,
            rejected_qty,
            employees (
                id,
                name,
                role
            )
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .not('employee_id', 'is', null);

    if (error) throw error;

    // Group by employee
    const employeeStats: any = {};
    (data || []).forEach((entry: any) => {
        const empId = entry.employee_id;
        if (!empId) return;

        if (!employeeStats[empId]) {
            employeeStats[empId] = {
                employee_id: empId,
                name: entry.employees?.name || 'Unknown',
                role: entry.employees?.role || 'N/A',
                totalActual: 0,
                totalPlanned: 0,
                totalRejected: 0,
                efficiencySum: 0,
                entryCount: 0
            };
        }

        employeeStats[empId].totalActual += entry.actual_qty || 0;
        employeeStats[empId].totalPlanned += entry.planned_qty || 0;
        employeeStats[empId].totalRejected += entry.rejected_qty || 0;
        employeeStats[empId].efficiencySum += entry.efficiency || 0;
        employeeStats[empId].entryCount += 1;
    });

    // Calculate averages and sort
    const rankings = Object.values(employeeStats).map((emp: any) => ({
        employee_id: emp.employee_id,
        name: emp.name,
        role: emp.role,
        totalProduction: emp.totalActual,
        averageEfficiency: emp.entryCount > 0 ? Number((emp.efficiencySum / emp.entryCount).toFixed(1)) : 0,
        rejectionRate: emp.totalActual > 0 ? Number(((emp.totalRejected / emp.totalActual) * 100).toFixed(2)) : 0,
        shiftsWorked: emp.entryCount,
        score: emp.entryCount > 0 ? Number((emp.efficiencySum / emp.entryCount).toFixed(1)) : 0
    }));

    // Sort by score (efficiency) descending
    rankings.sort((a, b) => b.score - a.score);

    return rankings;
}

/**
 * Get deep analysis report - multi-dimensional aggregation
 */
export async function getDeepAnalysisReport(startDate: string, endDate: string) {
    const { data, error } = await supabase
        .from('production_entries')
        .select(`
            *,
            products (name, category_id),
            hospitals (name),
            employees (name, role)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) throw error;

    const entries = data || [];

    // Shift analysis
    const shiftStats: any = {};
    entries.forEach((entry: any) => {
        const shift = entry.shift || 'Unknown';
        if (!shiftStats[shift]) {
            shiftStats[shift] = { shift, actual: 0, planned: 0, rejected: 0, effSum: 0, count: 0 };
        }
        shiftStats[shift].actual += entry.actual_qty || 0;
        shiftStats[shift].planned += entry.planned_qty || 0;
        shiftStats[shift].rejected += entry.rejected_qty || 0;
        shiftStats[shift].effSum += entry.efficiency || 0;
        shiftStats[shift].count += 1;
    });

    // Hospital analysis
    const hospitalStats: any = {};
    entries.forEach((entry: any) => {
        const hospital = entry.hospitals?.name || 'Unknown';
        if (!hospitalStats[hospital]) {
            hospitalStats[hospital] = { hospital, actual: 0, planned: 0, rejected: 0, effSum: 0, count: 0 };
        }
        hospitalStats[hospital].actual += entry.actual_qty || 0;
        hospitalStats[hospital].planned += entry.planned_qty || 0;
        hospitalStats[hospital].rejected += entry.rejected_qty || 0;
        hospitalStats[hospital].effSum += entry.efficiency || 0;
        hospitalStats[hospital].count += 1;
    });

    // Product analysis
    const productStats: any = {};
    entries.forEach((entry: any) => {
        const product = entry.products?.name || 'Unknown';
        if (!productStats[product]) {
            productStats[product] = { product, actual: 0, planned: 0, rejected: 0, effSum: 0, count: 0 };
        }
        productStats[product].actual += entry.actual_qty || 0;
        productStats[product].planned += entry.planned_qty || 0;
        productStats[product].rejected += entry.rejected_qty || 0;
        productStats[product].effSum += entry.efficiency || 0;
        productStats[product].count += 1;
    });

    // Format results
    const formatStats = (stats: any) => Object.values(stats).map((s: any) => ({
        ...s,
        efficiency: s.count > 0 ? Number((s.effSum / s.count).toFixed(1)) : 0,
        rejectionRate: s.actual > 0 ? Number(((s.rejected / s.actual) * 100).toFixed(2)) : 0
    }));

    return {
        byShift: formatStats(shiftStats),
        byHospital: formatStats(hospitalStats),
        byProduct: formatStats(productStats),
        totalEntries: entries.length
    };
}

/**
 * Generate simple insights from data
 */
export async function getInsights(startDate: string, endDate: string) {
    const insights: string[] = [];

    try {
        const [summary, comparative, rankings] = await Promise.all([
            getProductionSummary(startDate, endDate),
            getComparativeSummary(startDate, endDate),
            getEmployeeRankings(startDate, endDate)
        ]);

        // Efficiency insights
        if (comparative.changes.efficiency > 5) {
            insights.push(`🚀 Efficiency is up ${comparative.changes.efficiency}% compared to the previous period!`);
        } else if (comparative.changes.efficiency < -5) {
            insights.push(`⚠️ Efficiency has dropped ${Math.abs(comparative.changes.efficiency)}% - review may be needed.`);
        }

        // Production insights
        if (comparative.changes.production > 10) {
            insights.push(`📈 Production volume increased by ${comparative.changes.production}%`);
        }

        // Quality insights
        if (comparative.changes.rejections > 15) {
            insights.push(`🔴 Rejection rate is rising - up ${comparative.changes.rejections}%`);
        } else if (comparative.changes.rejections < -10) {
            insights.push(`✅ Quality improving - rejections down ${Math.abs(comparative.changes.rejections)}%`);
        }

        // Top performer
        if (rankings.length > 0) {
            insights.push(`⭐ Top performer: ${rankings[0].name} with ${rankings[0].averageEfficiency}% efficiency`);
        }

        // Overall health
        if (summary.averageEfficiency >= 90) {
            insights.push(`💪 System operating at peak performance (${summary.averageEfficiency.toFixed(1)}% efficiency)`);
        } else if (summary.averageEfficiency < 70) {
            insights.push(`⚡ System efficiency below target at ${summary.averageEfficiency.toFixed(1)}%`);
        }

    } catch (error) {
        console.error('Failed to generate insights:', error);
    }

    return insights.length > 0 ? insights : ['📊 Analyzing production data...'];
}
