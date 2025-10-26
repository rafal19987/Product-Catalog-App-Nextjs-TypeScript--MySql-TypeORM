'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CreateProductPayload,
    createProductSchema,
} from '@/app/validations/product';
import toast from 'react-hot-toast';
import { handleApiError } from "@/lib/form-error-handler";
import { useEffect, useState } from 'react';
import {Category} from "@/types/category.types";

export default function CreateProductForm() {
    const [categories, setCategories] = useState<Pick<Category, 'id' | 'name'>[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const {
        handleSubmit,
        register,
        reset,
        setError,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<CreateProductPayload>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            price: 0,
            stock: 0,
            imageUrl: '',
            isActive: true,
            categoryId: '',
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/category?active=true&limit=100');
            const data = await res.json();

            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Nie udało się pobrać kategorii');
        } finally {
            setLoadingCategories(false);
        }
    };

    const onSubmit: SubmitHandler<CreateProductPayload> = async (payload) => {
        try {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                handleApiError(data, {
                    setError,
                    errorFieldMap: {
                        'sku': 'sku',
                    },
                });
                return;
            }

            toast.success(data.message || 'Produkt został dodany');
            handleReset();
        } catch (error) {
            console.error(error);
            toast.error('Wystąpił błąd połączenia');
        }
    };

    const handleReset = () => {
        reset();
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full flex flex-col gap-2.5'
        >
            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='name'>
                    Nazwa produktu*
                </label>
                <input
                    {...register('name')}
                    className={`border rounded-lg px-2 py-1.5 ${
                        errors.name ? 'border-red-500' : 'border-slate-700'
                    }`}
                    type='text'
                    id='name'
                    placeholder='Laptop Dell XPS 15'
                />
                <div className='h-5'>
                    {errors.name && (
                        <span className='text-xs text-red-400'>{errors.name.message}</span>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='sku'>
                    SKU*
                </label>
                <input
                    {...register('sku')}
                    className={`border rounded-lg px-2 py-1.5 ${
                        errors.sku ? 'border-red-500' : 'border-slate-700'
                    }`}
                    type='text'
                    id='sku'
                    placeholder='DELL-XPS-15-001'
                />
                <div className='h-5'>
                    {errors.sku && (
                        <span className='text-xs text-red-400'>{errors.sku.message}</span>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1'>
                    <label className='text-slate-200' htmlFor='price'>
                        Cena (PLN)*
                    </label>
                    <input
                        {...register('price', { valueAsNumber: true })}
                        className={`border rounded-lg px-2 py-1.5 ${
                            errors.price ? 'border-red-500' : 'border-slate-700'
                        }`}
                        type='number'
                        step='0.01'
                        id='price'
                        placeholder='2999.99'
                    />
                    <div className='h-5'>
                        {errors.price && (
                            <span className='text-xs text-red-400'>{errors.price.message}</span>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-slate-200' htmlFor='stock'>
                        Stan magazynowy
                    </label>
                    <input
                        {...register('stock', { valueAsNumber: true })}
                        className={`border rounded-lg px-2 py-1.5 ${
                            errors.stock ? 'border-red-500' : 'border-slate-700'
                        }`}
                        type='number'
                        id='stock'
                        placeholder='10'
                    />
                    <div className='h-5'>
                        {errors.stock && (
                            <span className='text-xs text-red-400'>{errors.stock.message}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='categoryId'>
                    Kategoria
                </label>
                <select
                    {...register('categoryId')}
                    className={`border rounded-lg px-2 py-1.5 bg-slate-900 ${
                        errors.categoryId ? 'border-red-500' : 'border-slate-700'
                    }`}
                    id='categoryId'
                >
                    <option value=''>Bez kategorii</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <div className='h-5'>
                    {errors.categoryId && (
                        <span className='text-xs text-red-400'>{errors.categoryId.message}</span>
                    )}
                    {loadingCategories && (
                        <span className='text-xs text-slate-400'>Ładowanie kategorii...</span>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='imageUrl'>
                    URL zdjęcia
                </label>
                <input
                    {...register('imageUrl')}
                    className={`border rounded-lg px-2 py-1.5 ${
                        errors.imageUrl ? 'border-red-500' : 'border-slate-700'
                    }`}
                    type='url'
                    id='imageUrl'
                    placeholder='https://example.com/image.jpg'
                />
                <div className='h-5'>
                    {errors.imageUrl && (
                        <span className='text-xs text-red-400'>{errors.imageUrl.message}</span>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='description'>
                    Opis
                </label>
                <textarea
                    {...register('description')}
                    className={`border rounded-lg px-2 py-1.5 ${
                        errors.description ? 'border-red-500' : 'border-slate-700'
                    }`}
                    rows={5}
                    id='description'
                    placeholder='Opis produktu...'
                />
                <div className='h-5'>
                    {errors.description && (
                        <span className='text-xs text-red-400'>
                            {errors.description.message}
                        </span>
                    )}
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <input
                    {...register('isActive')}
                    type='checkbox'
                    id='isActive'
                    className='w-4 h-4 rounded border-slate-700'
                    disabled={isSubmitting}
                />
                <label className='text-slate-200' htmlFor='isActive'>
                    Produkt aktywny
                </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-4">
                <button
                    className='px-4 py-1.5 w-full sm:w-fit text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent'
                    type='button'
                    onClick={handleReset}
                    disabled={!hasErrors && (!isDirty || isSubmitting)}
                >
                    Wyczyść
                </button>
                <button
                    className='px-4 py-1.5 w-full sm:w-fit border rounded-lg border-slate-600 text-slate-200 hover:bg-slate-900 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
                </button>
            </div>
        </form>
    );
}