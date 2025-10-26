'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from "next/link";
import {Category} from "@/types/category.types";
import {Pagination} from "@/types/api.types";

export default function CategoryListTable() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, [currentPage, itemsPerPage, debouncedSearch]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                active: 'true',
            });

            if (debouncedSearch.trim() !== '') {
                params.append('query', debouncedSearch);
            }

            const res = await fetch(`/api/category?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setCategories(data.data);
                setPagination(data.pagination);
            } else {
                toast.error('Nie udało się pobrać kategorii');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Wystąpił błąd połączenia');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1); 
    };
    
    const getPageNumbers = () => {
        if (!pagination) return [];

        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page > 3) {
                pages.push('...');
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const handleSearchClear = () => {
        setSearchQuery('');
    };

    return (
        <div className='w-full flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <h2 className='text-2xl font-bold text-slate-200'>
                    Kategorie
                    {pagination && (
                        <span className='text-sm font-normal text-slate-400 ml-2'>
                            ({pagination.total} kategorii)
                        </span>
                    )}
                </h2>

                <Link
                    className='self-end px-4 py-1.5 w-full sm:w-fit border rounded-lg border-slate-600 text-slate-200 hover:bg-slate-900 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    href={'./categories/add'}
                >Dodaj
                </Link>
            </div>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='relative flex-1'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Szukaj produktu po nazwie...'
                        className='w-full border rounded-lg px-4 py-2 pr-10 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none'
                        disabled={loading}
                    />
                    {searchQuery && (
                        <button
                            onClick={handleSearchClear}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200'
                            disabled={loading}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center items-center py-12'>
                    <div className='text-slate-400'>Ładowanie...</div>
                </div>
            ) : categories.length === 0 ? (
                <div className='flex justify-center items-center py-12 border border-slate-700 rounded-lg'>
                    <div className='text-slate-400'>Brak kategorii</div>
                </div>
            ) : (
                <div className='border border-slate-700 rounded-lg overflow-hidden'>
                    <table className='w-full'>
                        <thead className='bg-slate-800 border-b border-slate-700'>
                        <tr>
                            <th className='text-left px-4 py-3 text-slate-200 font-semibold'>
                                Nazwa
                            </th>
                            <th className='text-right px-4 py-3 text-slate-200 font-semibold'>
                                Akcje
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category, index) => (
                            <tr
                                key={category.id}
                                className={`border-b border-slate-700 hover:bg-slate-800/50 transition-colors ${
                                    index === categories.length - 1 ? 'border-b-0' : ''
                                }`}
                            >
                                <td className='px-4 py-3'>
                                    <Link
                                        href={`/categories/${category.id}`}
                                        className='text-slate-200 hover:text-blue-400 transition-colors'
                                    >
                                        {category.name}
                                    </Link>
                                </td>
                                <td className='px-4 py-3 text-right'>
                                    <Link
                                        href={`/categories/${category.id}`}
                                        className='text-blue-400 hover:text-blue-300 text-sm'
                                    >
                                        Zobacz szczegóły
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className='flex items-center gap-2'>
                <label className='text-slate-400 text-sm'>Pokaż:</label>
                <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className='border rounded-lg px-3 py-1.5 bg-slate-900 border-slate-700 text-slate-200'
                    disabled={loading}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className='text-slate-400 text-sm'>na stronę</span>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='text-slate-400 text-sm'>
                        Strona {pagination.page} z {pagination.totalPages}
                    </div>

                    <div className='flex items-center gap-1'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrev || loading}
                            className='px-3 py-1.5 border rounded-lg border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors'
                        >
                            ←
                        </button>

                        {getPageNumbers().map((pageNum, index) => {
                            if (pageNum === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className='px-2 text-slate-400'
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const isActive = pageNum === currentPage;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum as number)}
                                    disabled={loading}
                                    className={`px-3 py-1.5 border rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-slate-700 border-slate-600 text-slate-200'
                                            : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNext || loading}
                            className='px-3 py-1.5 border rounded-lg border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors'
                        >
                            →
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className='text-slate-400 text-sm'>Idź do:</label>
                        <input
                            type='number'
                            min={1}
                            max={pagination.totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= pagination.totalPages) {
                                    handlePageChange(page);
                                }
                            }}
                            className='w-16 border rounded-lg px-2 py-1.5 bg-slate-900 border-slate-700 text-slate-200 text-sm'
                            disabled={loading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}