import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useProgress } from '@/context/ProgressContext';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const allBooks = [
  "ברכות",
  "פאה",
  "דמאי",
  "כלאים",
  "שביעית",
  "תרומות",
  "מעשרות",
  "מעשר שני",
  "חלה",
  "ערלה",
  "בכורים",
  "שבת",
  "עירובין",
  "פסחים",
  "שקלים",
  "יומא",
  "סוכה",
  "ביצה",
  "ראש השנה",
  "תענית",
  "מגילה",
  "מועד קטן",
  "חגיגה",
  "יבמות",
  "כתובות",
  "נדרים",
  "נזיר",
  "סוטה",
  "גיטין",
  "קידושין",
  "בבא קמא",
  "בבא מציעא",
  "בבא בתרא",
  "סנהדרין",
  "מכות",
  "שבועות",
  "עדויות",
  "עבודה זרה",
  "אבות",
  "הוריות",
  "זבחים",
  "מנחות",
  "חולין",
  "בכורות",
  "ערכין",
  "תמורה",
  "כריתות",
  "מעילה",
  "תמיד",
  "מדות",
  "קינים",
  "כלים",
  "אהלות",
  "נגעים",
  "פרה",
  "טהרות",
  "מקואות",
  "נדה",
  "מכשירין",
  "זבים",
  "טבול יום",
  "ידים",
  "עוקצין"
];

export default function OpenBookScreen() {
  const { progressManager } = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (text: string = '') => {
    setSearchTerm(text);
    const results = allBooks.filter(bookName =>
      bookName.includes(text)
    );
    setSearchResults(results);
  };

  const handleOpenBook = async (bookName: string) => {
    if (progressManager) {
      try {
        // await progressManager.initializeBookProgress(bookName);
        console.log(`נפתח הספר: ${bookName}`);
      } catch (error) {
        console.error('שגיאה בפתיחת הספר:', error);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        פתיחת ספר
      </ThemedText>

      <TextInput
        style={styles.searchInput}
        placeholder="חפש ספר..."
        placeholderTextColor="#999"
        onChangeText={handleSearch}
        value={searchTerm}
        textAlign="right"
      />

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((book) => (
          <TouchableOpacity
            key={book}
            style={styles.bookButton}
            onPress={() => handleOpenBook(book)}
          >
            <Text style={styles.bookText}>{book}</Text>
          </TouchableOpacity>
        ))}

        {searchTerm !== '' && searchResults.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>לא נמצאו תוצאות</Text>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  noResults: {
    marginTop: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#888',
    fontSize: 16,
  },
});
