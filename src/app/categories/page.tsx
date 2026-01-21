"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, FolderOpen, RefreshCw } from 'lucide-react';
import type { ProductCategory } from '../../types';
import { getAllProductCategories, createProductCategory, updateProductCategory, deleteProductCategory } from '../../lib/db-helpers';

export default function Categories() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getAllProductCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            await createProductCategory(formData);
            await loadData();
            setIsAdding(false);
            resetForm();
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category');
        }
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {
            await updateProductCategory(editingId, formData);
            await loadData();
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Failed to update category');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteProductCategory(id);
                await loadData();
            } catch (error) {
                console.error('Failed to delete category:', error);
                alert('Failed to delete category');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
        });
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && categories.length === 0) {
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
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
                            <FolderOpen className="text-emerald-400" size={36} />
                            Product Categories
                        </h1>
                        <p className="text-slate-400">Organize your products by category</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isAdding ? 'Add New Category' : 'Edit Category'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Category Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., Electronics, Mechanical"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="Brief description of this category"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={isAdding ? handleAdd : handleUpdate}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all"
                            >
                                <Save size={18} />
                                {isAdding ? 'Add Category' : 'Update'}
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

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all group relative">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                                        <FolderOpen className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">
                                {category.description || 'No description provided.'}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-4 flex items-center gap-1">
                                <RefreshCw size={10} />
                                Updated: {new Date(category.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && !loading && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-12 text-center border border-dashed border-slate-700">
                        <FolderOpen className="mx-auto text-slate-600 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">No categories yet</h3>
                        <p className="text-slate-500">Click "Add Category" to create your first product category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
