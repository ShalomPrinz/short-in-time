import { MishnaBook } from '@/data/models/mishna-model';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'books_progress.db';

class ProgressManager {
    private db!: SQLite.SQLiteDatabase;
    public isInitialized = false;

    /**
     * Initialize the database and create tables
     */
    async initialize() {
        try {
            this.db = await SQLite.openDatabaseAsync(DB_NAME);
            
            // Create books_progress table
            await this.db.execAsync(`
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS books_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bookId TEXT UNIQUE NOT NULL,
                bookName TEXT NOT NULL,
                currentChapterIndex INTEGER DEFAULT 0,
                currentEpisodeIndex INTEGER DEFAULT 0,
                lastAccessed INTEGER NOT NULL,
                createdAt INTEGER NOT NULL,
                timesCompleted INTEGER DEFAULT 0,
                notes TEXT DEFAULT NULL
                );
            `);
            
            this.isInitialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize book progress if not exists
     */
    async initializeBookProgress(bookId: number, bookName: string) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const currentTime = Date.now();
            
            await this.db.runAsync(`
                INSERT OR IGNORE INTO books_progress (
                bookId, bookName, lastAccessed, createdAt
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                bookId,
                bookName,
                currentTime,
                currentTime
            ]);
            
            return { success: true };
        } catch (error) {
            console.error('Error initializing book progress:', error);
            return { success: false, error };
        }
    }

    /**
     * Update reading progress
     */
    async updateProgress(bookId: string, chapterIndex: number, mishnaIndex: number) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const currentTime = Date.now();
            
            // Get current progress
            const currentProgress = await this.getBookProgress(bookId);
            if (!currentProgress.success || !currentProgress.data) {
                throw new Error('Book not found in progress table');
            }
                        
            // Update main progress
            await this.db.runAsync(`
                UPDATE books_progress SET
                currentChapterIndex = ?,
                currentMishnaIndex = ?,
                lastAccessed = ?,
                WHERE bookId = ?
            `, [
                chapterIndex,
                mishnaIndex,
                currentTime,
                bookId
            ]);
            
            return { success: true };
        } catch (error) {
            console.error('Error updating progress:', error);
            return { success: false, error };
        }
    }

    /**
     * Get book progress
     */
    async getBookProgress(bookId: string) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const result = await this.db.getFirstAsync<MishnaBook>(
                'SELECT * FROM books_progress WHERE bookId = ?',
                [bookId]
            );
            
            if (result) {
                return { success: true, data: result };
            } else {
                return { success: false, error: 'Book progress not found' };
            }
        } catch (error) {
            console.error('Error getting book progress:', error);
            return { success: false, error };
        }
    }

    /**
     * Get books with their progress
     */
    async getBooksProgress(start: number, limit: number) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            const results = await this.db.getAllAsync(`
                SELECT * FROM books_progress 
                ORDER BY lastAccessed DESC LIMIT ? OFFSET ?`,
                [limit, start]
            );
            
            return { success: true, data: results };
        } catch (error) {
            console.error('Error getting all books progress:', error);
            return { success: false, error };
        }
    }

    /**
     * Add notes to a book
     */
    async updateBookNotes(bookId: string, notes: string) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            await this.db.runAsync(`
                UPDATE books_progress SET
                notes = ?,
                updatedAt = ?
                WHERE bookId = ?
            `, [notes, Date.now(), bookId]);
            
            return { success: true };
        } catch (error) {
            console.error('Error updating notes:', error);
            return { success: false, error };
        }
    }

    /**
     * Reset book progress
     */
    async resetBookProgress(bookId: string) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            await this.db.runAsync(`
                UPDATE books_progress SET
                currentChapterIndex = 0,
                currentMishnaIndex = 0,
                timesCompleted = 0,
                lastAccessed = ?
                WHERE bookId = ?
            `, [Date.now(), bookId]);
        
            return { success: true };
        } catch (error) {
            console.error('Error resetting book progress:', error);
            return { success: false, error };
        }
    }

    /**
     * Delete book progress entirely
     */
    async deleteBookProgress(bookId: string) {
        if (!this.isInitialized) await this.initialize();
        
        try {
            await this.db.runAsync('DELETE FROM books_progress WHERE bookId = ?', [bookId]);
            await this.db.runAsync('DELETE FROM reading_sessions WHERE bookId = ?', [bookId]);
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting book progress:', error);
            return { success: false, error };
        }
    }
}

export default ProgressManager;
