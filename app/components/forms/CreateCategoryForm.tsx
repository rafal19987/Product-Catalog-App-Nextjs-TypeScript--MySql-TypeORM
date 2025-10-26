'use client';

import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    CreateCategoryPayload,
    createCategorySchema,
} from '@/app/validations/category';
import toast from 'react-hot-toast';
import {handleApiError} from "@/lib/form-error-handler";

export default function CreateCategoryForm() {
    const {
        handleSubmit,
        register,
        reset,
        setError,
        formState: {errors, isDirty, isSubmitting},
    } = useForm<CreateCategoryPayload>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit: SubmitHandler<CreateCategoryPayload> = async (payload) => {
        try {
            const res = await fetch('/api/category', {
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
                        'nazwie': 'name',
                        'slugu': 'name',
                    },
                });
                return;
            }

            toast.success(data.message || 'Kategoria została dodana');
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
            className='w-full flex flex-col'
        >
            <div className='flex flex-col gap-1'>
                <label className='text-slate-200' htmlFor='name'>
                    Nazwa*
                </label>
                <input
                    {...register('name')}
                    className={`border rounded-lg px-2 py-1.5 ${
                        errors.name ? 'border-red-500' : 'border-slate-700'
                    }`}
                    type='text'
                    id='name'
                    placeholder='Elektronika'
                />
                <div className='h-5'>
                    {errors.name && (
                        <span className='text-xs text-red-400'>{errors.name.message}</span>
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
                    placeholder='Opis kategorii...'
                />
                <div className='h-5'>
                    {errors.description && (
                        <span className='text-xs text-red-400'>
                            {errors.description.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
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
                >Zapisz
                </button>
            </div>

        </form>
    );
}