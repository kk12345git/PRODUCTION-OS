"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Package } from 'lucide-react';
import type { ProductCategory } from '../../types';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getAllProductCategories } from '../../lib/db-helpers';

interface ProductData {
    id: string;
    name: string;
    category_id: string | null;
    gsm: number | null;
    size1: string | null;
    size2: string | null;
    size3: string | null;
    target_per_hour: number;
    created_at: string;
}

export default function Products() {
    const [products, setProducts] = useState<ProductData[]>([]);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        gsm: '',
        size1: '',
        size2: '',
        size3: '',
        target_per_hour: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                getAllProducts(),
                getAllProductCategories()
            ]);
            setProducts(productsData as ProductData[]);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim()) {
            alert('Please enter product name');
            return;
        }
        try {
            await createProduct({
                name: formData.name,
                category_id: formData.category_id || null,
                gsm: formData.gsm ? Number(formData.gsm) : null,
                size1: formData.size1 || null,
                size2: formData.size2 || null,
                size3: formData.size3 || null,
                target_per_hour: formData.target_per_hour || 0,
            });
            await loadData();
            setIsAdding(false);
            resetForm();
            alert('✅ Product added successfully!');
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('❌ Failed to create product');
        }
    };

    const handleEdit = (product: ProductData) => {
        setEditingId(product.id);
        setIsAdding(false);
        setFormData({
            name: product.name,
            category_id: product.category_id || '',
            gsm: product.gsm?.toString() || '',
            size1: product.size1 || '',
            size2: product.size2 || '',
            size3: product.size3 || '',
            target_per_hour: product.target_per_hour || 0,
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        if (!formData.name.trim()) {
            alert('Please enter product name');
            return;
        }
        try {
            await updateProduct(editingId, {
                name: formData.name,
                category_id: formData.category_id || null,
                gsm: formData.gsm ? Number(formData.gsm) : null,
                size1: formData.size1 || null,
                size2: formData.size2 || null,
                size3: formData.size3 || null,
                target_per_hour: formData.target_per_hour || 0,
            });
            await loadData();
            setEditingId(null);
            resetForm();
            alert('✅ Product updated successfully!');
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('❌ Failed to update product');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                await loadData();
                alert('✅ Product deleted');
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('❌ Failed to delete product');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category_id: '',
            gsm: '',
            size1: '',
            size2: '',
            size3: '',
            target_per_hour: 0,
        });
    };

    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return 'No Category';
        const cat = categories.find(c => c.id === categoryId);
        return cat?.name || 'Unknown';
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center -m-8">
                <RefreshCw className="animate-spin text-emerald-400" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Package className="text-orange-400" size={36} />
                            Product Management
                        </h1>
                        <p className="text-slate-400">Manage your products with GSM and size specifications</p>
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
                        Add Product
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isAdding ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className={labelClass}>Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., Surgical Gown, Drape Sheet..."
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
                                <label className={labelClass}>GSM (Grams per Sq. Meter)</label>
                                <input
                                    type="number"
                                    value={formData.gsm}
                                    onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., 40, 60, 80..."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Size 1</label>
                                <input
                                    type="text"
                                    value={formData.size1}
                                    onChange={(e) => setFormData({ ...formData, size1: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., 120 x 150 cm"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Size 2</label>
                                <input
                                    type="text"
                                    value={formData.size2}
                                    onChange={(e) => setFormData({ ...formData, size2: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., 150 x 180 cm"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Size 3</label>
                                <input
                                    type="text"
                                    value={formData.size3}
                                    onChange={(e) => setFormData({ ...formData, size3: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., 180 x 200 cm"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Target per Hour</label>
                                <input
                                    type="number"
                                    value={formData.target_per_hour}
                                    onChange={(e) => setFormData({ ...formData, target_per_hour: Number(e.target.value) })}
                                    className={inputClass}
                                    placeholder="e.g., 50"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={isAdding ? handleAdd : handleUpdate}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all"
                            >
                                <Save size={18} />
                                {isAdding ? 'Add Product' : 'Update'}
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

                {/* Products Table */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">GSM</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Sizes</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Target/Hr</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                                        No products found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                    <Package className="text-orange-400" size={20} />
                                                </div>
                                                <span className="text-white font-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                                                {getCategoryName(product.category_id)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400">
                                            {product.gsm ? `${product.gsm} GSM` : '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {product.size1 && (
                                                    <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{product.size1}</span>
                                                )}
                                                {product.size2 && (
                                                    <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{product.size2}</span>
                                                )}
                                                {product.size3 && (
                                                    <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">{product.size3}</span>
                                                )}
                                                {!product.size1 && !product.size2 && !product.size3 && (
                                                    <span className="text-slate-500">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-emerald-400 font-medium">
                                            {product.target_per_hour || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
