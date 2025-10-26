'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {Category} from "@/types/category.types";

export default function CategoryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchCategory(params.id as string);
        }
    }, [params.id]);

    const fetchCategory = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/category/${id}`);
            const data = await res.json();

            if (data.success) {
                setCategory(data.data);
            } else {
                toast.error('Nie udało się pobrać kategorii');
                router.push('/categories');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            toast.error('Wystąpił błąd połączenia');
            router.push('/categories');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='container mx-auto p-4'>
                <div className='flex justify-center items-center py-12'>
                    <div className='text-slate-400'>Ładowanie...</div>
                </div>
            </div>
        );
    }

    if (!category) {
        return null;
    }

    return (
        <>
            <div className='mb-6 text-sm'>
                <Link href='/categories' className='text-blue-400 hover:text-blue-300'>
                    ← Powrót do listy kategorii
                </Link>
            </div>

            <div className='w-full bg-neutral-950 border border-slate-700 rounded-lg p-6 mb-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
                    <div className='flex-1'>
                        <h1 className='text-3xl font-bold text-slate-200 mb-2'>
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className='text-slate-400 mb-4'>{category.description}</p>
                        )}
                        <div className='flex flex-wrap gap-4 text-sm'>
                            <div>
                                <span className='text-slate-500'>Slug:</span>{' '}
                                <span className='text-slate-300 font-mono'>{category.slug}</span>
                            </div>
                            <div>
                                <span className='text-slate-500'>Status:</span>{' '}
                                <span
                                    className={`px-2 py-0.5 rounded ${
                                        category.active
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-red-900/30 text-red-400'
                                    }`}
                                >
                                    {category.active ? 'Aktywna' : 'Nieaktywna'}
                                </span>
                            </div>
                            <div>
                                <span className='text-slate-500'>Utworzono:</span>{' '}
                                <span className='text-slate-300'>
                                    {new Date(category.createdAt).toLocaleDateString('pl-PL')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
                            Edytuj kategorię
                        </button>
                    </div>
                </div>
            </div>

            <div className='w-full bg-neutral-950 border border-slate-700 rounded-lg p-6'>
                <h2 className='text-2xl font-bold text-slate-200 mb-4'>
                    Produkty w kategorii
                    <span className='text-sm font-normal text-slate-400 ml-2'>
                        ({category.products.length})
                    </span>
                </h2>

                {category.products.length === 0 ? (
                    <div className='text-center py-12 text-slate-400'>
                        Brak produktów w tej kategorii
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {category.products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className='bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors group'
                            >
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className='w-full h-48 object-cover rounded-lg mb-3'
                                    />
                                ) : (
                                    <div className='w-full h-48 bg-slate-800 rounded-lg mb-3 flex items-center justify-center'>
                                        <span className='text-slate-600'>Brak zdjęcia</span>
                                    </div>
                                )}

                                <h3 className='text-lg font-semibold text-slate-200 mb-1 group-hover:text-blue-400 transition-colors'>
                                    {product.name}
                                </h3>
                                <p className='text-sm text-slate-400 mb-2 font-mono'>{product.sku}</p>

                                {product.description && (
                                    <p className='text-sm text-slate-400 mb-3 line-clamp-2'>
                                        {product.description}
                                    </p>
                                )}

                                <div className='flex justify-between items-center pt-3 border-t border-slate-700'>
                                    <span className='text-xl font-bold text-slate-200'>
                                        {product.price} PLN
                                    </span>
                                    <span className='text-sm text-slate-400'>
                                        Stan: {product.stock}
                                    </span>
                                </div>

                                {!product.isActive && (
                                    <div className='mt-2'>
                                        <span className='text-xs px-2 py-1 rounded bg-red-900/30 text-red-400'>
                                            Nieaktywny
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}