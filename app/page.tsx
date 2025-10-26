import Link from 'next/link';
import CreateCategoryForm from './components/forms/CreateCategoryForm';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black'>
      <header className='flex items-center justify-between border py-2.5 px-4 w-full h-14'>
        <Link href={'/'}>
          <span>Product Catalog</span>
        </Link>
      </header>
      <div className='flex grow h-full w-full'>
        <div className='flex grow h-full w-72 border'>
          <nav>
            <ul>
              <li>
                <Link href={'/'}>Strona główna</Link>
              </li>
              <li>
                <Link href={'/'}>Produkty</Link>
              </li>
              <li>
                <Link href={'/'}>Lista</Link>
              </li>
            </ul>
          </nav>
        </div>
        <main className='flex grow w-full h-full py-32 px-16 bg-white dark:bg-black sm:items-start'>
          <div>
            <CreateCategoryForm />
          </div>
        </main>
      </div>
    </div>
  );
}
