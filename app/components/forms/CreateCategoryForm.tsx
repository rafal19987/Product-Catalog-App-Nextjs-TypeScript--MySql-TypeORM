'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  CreateCategoryPayload,
  createCategorySchema,
} from '@/app/validations/category';

export default function CreateCategoryForm() {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateCategoryPayload>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCategoryPayload> = async (payload) => {
    try {
      console.log(payload);

      const res = await fetch('', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full flex flex-col gap-2.5'
    >
      <div className='flex flex-col gap-1'>
        <label className='text-slate-200' htmlFor='name'>
          Nazwa*
        </label>
        <input
          {...register('name')}
          className='border rounded-lg px-2 py-1.5 border-slate-700'
          type='text'
          name='name'
          id='name'
          placeholder='name'
        />
        <span className='text-xs text-red-500'>To pole jest wymagane</span>
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-slate-200' htmlFor='description'>
          Opis
        </label>
        <textarea
          {...register('description')}
          className='border rounded-lg px-2 py-1.5 border-slate-700'
          cols={8}
          rows={5}
          name='description'
          id='description'
          placeholder='opis'
        />
        <span className='text-xs text-red-500'>To pole jest wymagane</span>
      </div>

      <button
        className='w-fit px-4 py-1.5 border rounded-lg border-slate-600 text-slate-200 hover:bg-slate-900 hover:cursor-pointer transition-colors'
        type='submit'
      >
        Zapisz
      </button>
    </form>
  );
}
