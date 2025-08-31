/**
 * Defines the structure for a book's progress, directly mapping to the
 * `books_progress` SQLite table schema.
 */
export interface BookProgressModel {
  id: number;
  bookId: string;
  bookName: string;
  currentChapterIndex: number;
  currentEpisodeIndex: number;
  lastAccessed: number;
  createdAt: number;
  timesCompleted: number;
  notes: string | null;
}
