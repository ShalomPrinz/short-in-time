import { MishnaBook } from '@/data/models/mishna-model';
import * as FileSystem from 'expo-file-system';

/**
 * Load book JSON from file system
 */
async function loadBookFromFileSystem(bookFileName: string) {
    try {
        const bookPath = `${FileSystem.documentDirectory}mishna/${bookFileName}.json`;
        
        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(bookPath);
        if (!fileInfo.exists) {
            throw new Error(`Book file not found: ${bookPath}`);
        }
        
        // Read and parse JSON
        const bookContent = await FileSystem.readAsStringAsync(bookPath);
        const bookData = JSON.parse(bookContent);
        
        return {
            success: true,
            data: bookData as MishnaBook
        };
    } catch (error) {
        console.error('Error loading book:', error);
        return {
            success: false,
            error,
            data: null
        };
    }
}
