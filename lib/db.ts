import { AppDataSource } from '@/database/data-source';

let isInitialized = false;

export async function getDataSource() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('Data base connected');
    } catch (error) {
      console.error('Error connecting to database');
      throw error;
    }
  }

  return AppDataSource;
}

export async function closeDataSource() {
  if (isInitialized && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    isInitialized = false;
    console.log('Database conncetion closed');
  }
}
