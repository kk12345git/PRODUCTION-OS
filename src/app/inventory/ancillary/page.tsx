"use client";
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import {
    getInventoryItemsByType,
    createInventoryItem,
    createStockTransaction,
    getAllProductCategories
} from '../../../lib/db-helpers';

export default function AncillaryProducts() {
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [stockAction, setStockAction] = useState<'IN' | 'OUT'>('IN');
    const [showAddModal, setShowAddModal] = useState(false);

    const [addFormData, setAddFormData] = useState({
        name: '',
        sku: '',
        unit: 'pieces',
    });

    const [stockFormData, setStockFormData] = useState({
        quantity: 0,
        notes: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [itemsData, categoriesData] = await Promise.all([
                getInventoryItemsByType('ANCILLARY'),
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
        if (!addFormData.name.trim()) {
            alert('Please enter item name');
            return;
        }
        try {
            await createInventoryItem({
                name: addFormData.name,
                item_type: 'ANCILLARY',
                sku: addFormData.sku || null,
                unit: addFormData.unit,
                minimum_stock: 0,
            });
            await loadData();
            setShowAddModal(false);
            setAddFormData({ name: '', sku: '', unit: 'pieces' });
            alert('✅ Ancillary item added successfully!');
        } catch (error) {
            console.error('Failed to create item:', error);
            alert('❌ Failed to create item');
        }
    };

    const openStockModal = (item: any, action: 'IN' | 'OUT') => {
        setSelectedItem(item);
        setStockAction(action);
        setShowStockModal(true);
        setStockFormData({ quantity: 0, notes: '' });
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

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center -m-8">
                <RefreshCw className="animate-spin text-purple-400" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Wrench className="text-purple-400" size={36} />
                            Ancillary Products
                        </h1>
                        <p className="text-slate-400">Simple IN/OUT tracking for ancillary items</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>

                {/* Items Table */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Name</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                                <th className="text-center py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                                <th className="text-center py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-500 italic">
                                        No ancillary items found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                    <Wrench className="text-purple-400" size={20} />
                                                </div>
                                                <span className="text-white font-medium">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400">
                                            {item.sku || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full font-medium">
                                                {item.current_stock} {item.unit}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openStockModal(item, 'IN')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium"
                                                >
                                                    <TrendingUp size={16} />
                                                    IN
                                                </button>
                                                <button
                                                    onClick={() => openStockModal(item, 'OUT')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm font-medium"
                                                >
                                                    <TrendingDown size={16} />
                                                    OUT
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-4">Add Ancillary Item</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Item Name *</label>
                                    <input
                                        type="text"
                                        value={addFormData.name}
                                        onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                        className={inputClass}
                                        placeholder="e.g., Screws, Bolts, Tape..."
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>SKU</label>
                                    <input
                                        type="text"
                                        value={addFormData.sku}
                                        onChange={(e) => setAddFormData({ ...addFormData, sku: e.target.value })}
                                        className={inputClass}
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Unit</label>
                                    <select
                                        value={addFormData.unit}
                                        onChange={(e) => setAddFormData({ ...addFormData, unit: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="pieces">Pieces</option>
                                        <option value="boxes">Boxes</option>
                                        <option value="kg">Kilograms</option>
                                        <option value="units">Units</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleAdd}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:from-purple-500 hover:to-purple-400 transition-all"
                                    >
                                        Add Item
                                    </button>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Transaction Modal */}
                {showStockModal && selectedItem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Stock {stockAction}: {selectedItem.name}
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
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Notes</label>
                                    <textarea
                                        value={stockFormData.notes}
                                        onChange={(e) => setStockFormData({ ...stockFormData, notes: e.target.value })}
                                        className={inputClass}
                                        rows={2}
                                        placeholder="Optional notes..."
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleStockTransaction}
                                        className={`flex-1 px-6 py-3 ${stockAction === 'IN'
                                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                                            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                                            } text-white rounded-xl font-bold transition-all`}
                                    >
                                        Confirm
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
