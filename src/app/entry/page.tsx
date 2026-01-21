"use client";
import React, { useState, useEffect } from 'react';
import { Save, Calculator, AlertCircle, RefreshCw, PenTool, Building2, Warehouse } from 'lucide-react';
import { type Shift, type ProductionEntryInput, type Hospital, type Product, type ProductCategory, type Employee, type DestinationType } from '../../types';
import { createProductionEntry, getAllHospitals, getAllProducts, getAllProductCategories, getAllEmployees } from '../../lib/db-helpers';

export default function ProductionEntry() {
    const [destinationType, setDestinationType] = useState<DestinationType>('HOSPITAL');
    const [formData, setFormData] = useState<ProductionEntryInput>({
        date: new Date().toISOString().split('T')[0],
        shift: 'A',
        destination_type: 'HOSPITAL',
        hospital_id: '',
        production_category: '',
        product_id: '',
        employee_id: '',
        planned_qty: 0,
        actual_qty: 0,
        rejected_qty: 0,
        efficiency: 0,
        discipline_score: 0,
        remarks: '',
    });

    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [hospitalsData, productsData, categoriesData, employeesData] = await Promise.all([
                    getAllHospitals(),
                    getAllProducts(),
                    getAllProductCategories(),
                    getAllEmployees()
                ]);
                setHospitals(hospitalsData);
                setProducts(productsData);
                setCategories(categoriesData);
                setEmployees(employeesData);
            } catch (error) {
                console.error('Failed to load metadata:', error);
            }
        };
        loadMetadata();
    }, []);

    useEffect(() => {
        const savedDraft = localStorage.getItem('production_entry_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed);
                if (parsed.destination_type) {
                    setDestinationType(parsed.destination_type);
                }
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('production_entry_draft', JSON.stringify(formData));
            setLastSaved(new Date());
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData]);

    // Sync destination type with form data
    useEffect(() => {
        setFormData(prev => ({ ...prev, destination_type: destinationType }));
        // Clear hospital_id if switching to warehouse
        if (destinationType === 'WAREHOUSE') {
            setFormData(prev => ({ ...prev, hospital_id: '' }));
        }
    }, [destinationType]);

    const calculateEfficiency = () => {
        if (formData.planned_qty > 0) {
            const efficiency = (formData.actual_qty / formData.planned_qty) * 100;
            setFormData(prev => ({ ...prev, efficiency: Number(efficiency.toFixed(2)) }));
        }
    };

    useEffect(() => {
        if (formData.planned_qty > 0 && formData.actual_qty >= 0) {
            const efficiency = (formData.actual_qty / formData.planned_qty) * 100;
            if (formData.efficiency !== Number(efficiency.toFixed(2))) {
                setFormData(prev => ({ ...prev, efficiency: Number(efficiency.toFixed(2)) }));
            }
        }
    }, [formData.planned_qty, formData.actual_qty]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};

        // Only require hospital if destination is HOSPITAL
        if (destinationType === 'HOSPITAL' && !formData.hospital_id) {
            newErrors.hospital_id = 'Hospital is required';
        }
        if (!formData.production_category) newErrors.production_category = 'Category is required';
        if (!formData.product_id) newErrors.product_id = 'Product is required';
        if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
        if (formData.planned_qty <= 0) newErrors.planned_qty = 'Planned quantity must be greater than 0';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSaving(true);

            // Prepare data - remove destination_type (UI only) and set hospital_id for warehouse
            const { destination_type, ...restFormData } = formData;
            const entryData = {
                ...restFormData,
                hospital_id: destinationType === 'WAREHOUSE' ? null : formData.hospital_id || null,
            };

            await createProductionEntry(entryData);
            localStorage.removeItem('production_entry_draft');

            // Reset form
            setFormData({
                date: new Date().toISOString().split('T')[0],
                shift: 'A',
                destination_type: 'HOSPITAL',
                hospital_id: '',
                production_category: '',
                product_id: '',
                employee_id: '',
                planned_qty: 0,
                actual_qty: 0,
                rejected_qty: 0,
                efficiency: 0,
                discipline_score: 0,
                remarks: '',
            });
            setDestinationType('HOSPITAL');
            alert('✅ Production entry saved successfully!');
        } catch (error: any) {
            console.error('Failed to save entry:', error);
            const errorMsg = error?.message || error?.code || JSON.stringify(error) || 'Unknown error';
            alert(`❌ Failed to save entry: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";
    const errorInputClass = "border-red-500 focus:ring-red-500";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                        <PenTool className="text-emerald-400" size={36} />
                        Production Entry
                    </h1>
                    <p className="text-slate-400">Record new production data</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">New Entry</h2>
                        {lastSaved && (
                            <div className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full">
                                <RefreshCw size={12} />
                                Auto-saved at {lastSaved.toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* DESTINATION TYPE TOGGLE */}
                        <div className="mb-6">
                            <label className={labelClass}>Destination *</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setDestinationType('HOSPITAL')}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${destinationType === 'HOSPITAL'
                                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                                        : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <Building2 size={24} />
                                    <div className="text-left">
                                        <div className="font-bold">Hospital Order</div>
                                        <div className="text-xs opacity-70">Direct delivery to hospital</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDestinationType('WAREHOUSE')}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${destinationType === 'WAREHOUSE'
                                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                        : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <Warehouse size={24} />
                                    <div className="text-left">
                                        <div className="font-bold">Warehouse Stock</div>
                                        <div className="text-xs opacity-70">Store in inventory</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Date and Shift */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Shift</label>
                                <select
                                    value={formData.shift}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as Shift }))}
                                    className={inputClass}
                                >
                                    <option value="A">Shift A (Morning)</option>
                                    <option value="B">Shift B (Afternoon)</option>
                                    <option value="C">Shift C (Night)</option>
                                </select>
                            </div>
                        </div>

                        {/* Hospital (Only show if destination is HOSPITAL) */}
                        {destinationType === 'HOSPITAL' && (
                            <div>
                                <label className={labelClass}>Hospital *</label>
                                <select
                                    value={formData.hospital_id || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hospital_id: e.target.value }))}
                                    className={`${inputClass} ${errors.hospital_id ? errorInputClass : ''}`}
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map(hospital => (
                                        <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                                    ))}
                                </select>
                                {errors.hospital_id && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.hospital_id}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Warehouse info banner */}
                        {destinationType === 'WAREHOUSE' && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
                                <Warehouse className="text-blue-400" size={24} />
                                <div>
                                    <p className="text-blue-400 font-medium">Warehouse Stock Entry</p>
                                    <p className="text-slate-400 text-sm">This production will be stored in warehouse inventory</p>
                                </div>
                            </div>
                        )}

                        {/* Production Category */}
                        <div>
                            <label className={labelClass}>Production Category *</label>
                            <select
                                value={formData.production_category}
                                onChange={(e) => setFormData(prev => ({ ...prev, production_category: e.target.value }))}
                                className={`${inputClass} ${errors.production_category ? errorInputClass : ''}`}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            {errors.production_category && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.production_category}
                                </p>
                            )}
                        </div>

                        {/* Product */}
                        <div>
                            <label className={labelClass}>Product *</label>
                            <select
                                value={formData.product_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                                className={`${inputClass} ${errors.product_id ? errorInputClass : ''}`}
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (Target: {product.target_per_hour}/hr)
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.product_id}
                                </p>
                            )}
                        </div>

                        {/* Employee */}
                        <div>
                            <label className={labelClass}>Operator/Responsible *</label>
                            <select
                                value={formData.employee_id || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                                className={`${inputClass} ${errors.employee_id ? errorInputClass : ''}`}
                            >
                                <option value="">Select Employee</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name} ({employee.role})
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.employee_id}
                                </p>
                            )}
                        </div>

                        {/* Quantities */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Planned Quantity *</label>
                                <input
                                    type="number"
                                    value={formData.planned_qty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, planned_qty: Number(e.target.value) }))}
                                    className={`${inputClass} ${errors.planned_qty ? errorInputClass : ''}`}
                                />
                                {errors.planned_qty && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.planned_qty}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>Actual Quantity</label>
                                <input
                                    type="number"
                                    value={formData.actual_qty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, actual_qty: Number(e.target.value) }))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Rejected Quantity</label>
                                <input
                                    type="number"
                                    value={formData.rejected_qty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rejected_qty: Number(e.target.value) }))}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Efficiency and Discipline Score */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Efficiency (%)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={formData.efficiency || 0}
                                        readOnly
                                        className={`${inputClass} bg-slate-700 font-bold text-emerald-400`}
                                    />
                                    <button
                                        type="button"
                                        onClick={calculateEfficiency}
                                        className="p-3 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors"
                                        title="Recalculate Efficiency"
                                    >
                                        <Calculator size={20} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Discipline Score (0-100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discipline_score || 0}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discipline_score: Number(e.target.value) }))}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className={labelClass}>Remarks</label>
                            <textarea
                                value={formData.remarks || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                                rows={3}
                                className={inputClass}
                                placeholder="Add any additional notes..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Entry'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}