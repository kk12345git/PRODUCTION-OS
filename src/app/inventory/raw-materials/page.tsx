"use client";
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Save, X, RefreshCw, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
    getInventoryItemsByType,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    createStockTransaction,
    getItemTransactionHistory,
    getAllProductCategories
} from '../../../lib/db-helpers';

export default function RawMaterials() {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [stockAction, setStockAction] = useState<'IN' | 'OUT'>('IN');

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        sku: '',
        unit: 'kg',
        minimum_stock: 0,
        unit_cost: 0,
        description: '',
    });

    const [stockFormData, setStockFormData] = useState({
        quantity: 0,
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [itemsData, categoriesData] = await Promise.all([
                getInventoryItemsByType('RAW_MATERIAL'),
                getAllProductCategories()
            ]);
            setItems(itemsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim()) {
            alert('Please enter item name');
            return;
        }
        try {
            await createInventoryItem({
                ...formData,
                item_type: 'RAW_MATERIAL',
                category_id: formData.category_id || null,
                unit_cost: formData.unit_cost || null,
            });
            await loadData();
            setIsAdding(false);
            resetForm();
            alert('✅ Raw material added successfully!');
        } catch (error) {
            console.error('Failed to create item:', error);
            alert('❌ Failed to create item');
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setIsAdding(false);
        setFormData({
            name: item.name,
            category_id: item.category_id || '',
            sku: item.sku || '',
            unit: item.unit,
            minimum_stock: item.minimum_stock,
            unit_cost: item.unit_cost || 0,
            description: item.description || '',
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {
            await updateInventoryItem(editingId, formData);
            await loadData();
            setEditingId(null);
            resetForm();
            alert('✅ Item updated successfully!');
        } catch (error) {
            console.error('Failed to update item:', error);
            alert('❌ Failed to update item');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteInventoryItem(id);
                await loadData();
                alert('✅ Item deleted');
            } catch (error) {
                console.error('Failed to delete item:', error);
                alert('❌ Failed to delete item');
            }
        }
    };

    const openStockModal = (item: any, action: 'IN' | 'OUT') => {
        setSelectedItem(item);
        setStockAction(action);
        setShowStockModal(true);
        setStockFormData({
            quantity: 0,
            notes: '',
            transaction_date: new Date().toISOString().split('T')[0],
        });
    };

    const handleStockTransaction = async () => {
        if (!selectedItem || stockFormData.quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }
        try {
            await createStockTransaction({
                item_id: selectedItem.id,
                transaction_type: stockAction,
                quantity: Math.abs(stockFormData.quantity),
                notes: stockFormData.notes,
                transaction_date: stockFormData.transaction_date,
                reference_type: stockAction === 'IN' ? 'PURCHASE' : 'USAGE',
            });
            await loadData();
            setShowStockModal(false);
            setSelectedItem(null);
            alert(`✅ Stock ${stockAction === 'IN' ? 'added' : 'removed'} successfully!`);
        } catch (error: any) {
            console.error('Failed to create transaction:', error);
            alert(`❌ Failed: ${error?.message || 'Unknown error'}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category_id: '',
            sku: '',
            unit: 'kg',
            minimum_stock: 0,
            unit_cost: 0,
            description: '',
        });
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center -m-8">
                <RefreshCw className="animate-spin text-emerald-400" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Package className="text-blue-400" size={36} />
                            Raw Materials
                        </h1>
                        <p className="text-slate-400">Manage raw material inventory and stock levels</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setEditingId(null);
                            resetForm();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isAdding ? 'Add New Raw Material' : 'Edit Raw Material'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., Cotton Fabric, Plastic Roll..."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>SKU</label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className={inputClass}
                                    placeholder="Stock Keeping Unit"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Category</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Unit *</label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="pieces">Pieces</option>
                                    <option value="liters">Liters</option>
                                    <option value="meters">Meters</option>
                                    <option value="boxes">Boxes</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Minimum Stock Level</label>
                                <input
                                    type="number"
                                    value={formData.minimum_stock}
                                    onChange={(e) => setFormData({ ...formData, minimum_stock: Number(e.target.value) })}
                                    className={inputClass}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Unit Cost</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.unit_cost}
                                    onChange={(e) => setFormData({ ...formData, unit_cost: Number(e.target.value) })}
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={inputClass}
                                    rows={2}
                                    placeholder="Additional details..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={isAdding ? handleAdd : handleUpdate}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all"
                            >
                                <Save size={18} />
                                {isAdding ? 'Add Item' : 'Update'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 transition-all"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => {
                        const isLowStock = item.current_stock <= item.minimum_stock;
                        const stockPercentage = item.minimum_stock > 0
                            ? Math.min((item.current_stock / item.minimum_stock) * 100, 100)
                            : 100;

                        return (
                            <div key={item.id} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                        {item.sku && (
                                            <p className="text-sm text-slate-400">SKU: {item.sku}</p>
                                        )}
                                    </div>
                                    {isLowStock && (
                                        <AlertTriangle className="text-amber-400" size={20} />
                                    )}
                                </div>

                                {/* Stock Level */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Current Stock</span>
                                        <span className={`font-bold ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {item.current_stock} {item.unit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                            style={{ width: `${stockPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>Min: {item.minimum_stock}</span>
                                        {item.unit_cost && (
                                            <span>Value: ₹{(item.current_stock * item.unit_cost).toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                        onClick={() => openStockModal(item, 'IN')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium"
                                    >
                                        <TrendingUp size={16} />
                                        Stock IN
                                    </button>
                                    <button
                                        onClick={() => openStockModal(item, 'OUT')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm font-medium"
                                    >
                                        <TrendingDown size={16} />
                                        Stock OUT
                                    </button>
                                </div>

                                {/* Edit/Delete */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all text-sm"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {items.length === 0 && !loading && (
                        <div className="col-span-full text-center py-16 text-slate-500">
                            No raw materials found. Add one to get started.
                        </div>
                    )}
                </div>

                {/* Stock Transaction Modal */}
                {showStockModal && selectedItem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Stock {stockAction === 'IN' ? 'IN' : 'OUT'}: {selectedItem.name}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Quantity ({selectedItem.unit}) *</label>
                                    <input
                                        type="number"
                                        value={stockFormData.quantity}
                                        onChange={(e) => setStockFormData({ ...stockFormData, quantity: Number(e.target.value) })}
                                        className={inputClass}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Date</label>
                                    <input
                                        type="date"
                                        value={stockFormData.transaction_date}
                                        onChange={(e) => setStockFormData({ ...stockFormData, transaction_date: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Notes</label>
                                    <textarea
                                        value={stockFormData.notes}
                                        onChange={(e) => setStockFormData({ ...stockFormData, notes: e.target.value })}
                                        className={inputClass}
                                        rows={3}
                                        placeholder="Optional notes..."
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleStockTransaction}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 ${stockAction === 'IN'
                                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                                                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                                            } text-white rounded-xl font-bold transition-all`}
                                    >
                                        <Save size={18} />
                                        Confirm {stockAction}
                                    </button>
                                    <button
                                        onClick={() => setShowStockModal(false)}
                                        className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
