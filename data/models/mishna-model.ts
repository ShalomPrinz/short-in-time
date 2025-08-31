/**
 * Interface for a single Mishna (verse).
 */
export interface MishnaEpisode {
  טקסט: string;
  מספר_משנה: number;
  מספר_מילים: number;
}

/**
 * Interface for a chapter containing Mishnayot.
 */
export interface MishnaChapter {
  פרק: number;
  משניות: Record<string, MishnaEpisode>;
  מספר_משניות: number;
}

/**
 * Interface for the general metadata of the tractate.
 */
export interface MishnaBookMetadata {
  מספר_פרקים: number;
  מספר_משניות_סה_כ: number;
  מספר_מילים_סה_כ: number;
  משניות_לפי_פרק: Record<string, number>;
}

/**
 * The main interface for the entire book.
 */
export interface MishnaBook {
  מסכת: string;
  מסכת_אנגלית: string;
  סדר: string;
  פרקים: Record<string, MishnaChapter>;
  מטאדטה: MishnaBookMetadata;
}
