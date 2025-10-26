'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {Product} from "@/types/product.types";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/product/${id}`);
            const data = await res.json();

            if (data.success) {
                setProduct(data.data);
            } else {
                toast.error('Nie udało się pobrać produktu');
                router.push('/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Wystąpił błąd połączenia');
            router.push('/products');
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

    if (!product) {
        return null;
    }

    return (
        <>
            <div className='mb-6 text-sm flex items-center gap-2'>
                <Link href='/products' className='text-blue-400 hover:text-blue-300'>
                    Produkty
                </Link>
                {product.category && (
                    <>
                        <span className='text-slate-500'>/</span>
                        <Link
                            href={`/categories/${product.category.id}`}
                            className='text-blue-400 hover:text-blue-300'
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span className='text-slate-500'>/</span>
                <span className='text-slate-400'>{product.name}</span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-neutral-950 border border-slate-700 rounded-lg p-6'>
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className='w-full h-auto rounded-lg'
                        />
                    ) : (
                        <div className='w-full aspect-square bg-slate-900 rounded-lg flex items-center justify-center'>
                            <span className='text-slate-600 text-lg'>Brak zdjęcia</span>
                        </div>
                    )}
                </div>

                <div className='flex flex-col gap-6'>
                    <div className='bg-neutral-950 border border-slate-700 rounded-lg p-6'>
                        <div className='flex justify-between items-start mb-4'>
                            <div>
                                <h1 className='text-3xl font-bold text-slate-200 mb-2'>
                                    {product.name}
                                </h1>
                                <p className='text-slate-400 font-mono'>{product.sku}</p>
                            </div>
                            <div>
                                <span
                                    className={`px-3 py-1 rounded text-sm ${
                                        product.isActive
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-red-900/30 text-red-400'
                                    }`}
                                >
                                    {product.isActive ? 'Aktywny' : 'Nieaktywny'}
                                </span>
                            </div>
                        </div>

                        {product.category && (
                            <div className='mb-4'>
                                <span className='text-slate-500 text-sm'>Kategoria:</span>{' '}
                                <Link
                                    href={`/categories/${product.category.id}`}
                                    className='text-blue-400 hover:text-blue-300'
                                >
                                    {product.category.name}
                                </Link>
                            </div>
                        )}

                        <div className='flex gap-6 mb-6 pb-6 border-b border-slate-700'>
                            <div>
                                <div className='text-slate-500 text-sm mb-1'>Cena</div>
                                <div className='text-3xl font-bold text-slate-200'>
                                    {product.price} PLN
                                </div>
                            </div>
                            <div>
                                <div className='text-slate-500 text-sm mb-1'>Stan magazynowy</div>
                                <div className='text-3xl font-bold text-slate-200'>
                                    {product.stock}
                                </div>
                            </div>
                        </div>

                        {product.description && (
                            <div className='mb-6'>
                                <h3 className='text-lg font-semibold text-slate-200 mb-2'>
                                    Opis
                                </h3>
                                <p className='text-slate-400 leading-relaxed whitespace-pre-wrap'>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className='flex gap-3'>
                            <button className='flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold'>
                                Edytuj produkt
                            </button>
                            <button className='px-4 py-3 border border-red-600 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors'>
                                Usuń
                            </button>
                        </div>
                    </div>

                    <div className='bg-neutral-950 border border-slate-700 rounded-lg p-6'>
                        <h3 className='text-lg font-semibold text-slate-200 mb-4'>
                            Szczegóły techniczne
                        </h3>
                        <div className='space-y-3'>
                            <div className='flex justify-between py-2 border-b border-slate-700'>
                                <span className='text-slate-500'>ID produktu</span>
                                <span className='text-slate-300 font-mono text-sm'>
                                    {product.id}
                                </span>
                            </div>
                            <div className='flex justify-between py-2 border-b border-slate-700'>
                                <span className='text-slate-500'>SKU</span>
                                <span className='text-slate-300 font-mono'>{product.sku}</span>
                            </div>
                            <div className='flex justify-between py-2 border-b border-slate-700'>
                                <span className='text-slate-500'>Data utworzenia</span>
                                <span className='text-slate-300'>
                                    {new Date(product.createdAt).toLocaleString('pl-PL')}
                                </span>
                            </div>
                            <div className='flex justify-between py-2'>
                                <span className='text-slate-500'>Ostatnia aktualizacja</span>
                                <span className='text-slate-300'>
                                    {new Date(product.updatedAt).toLocaleString('pl-PL')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}