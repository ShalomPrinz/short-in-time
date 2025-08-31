import { useProgress } from '@/context/ProgressContext';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HEADER_HEIGHT } from '@/constants/Sizes';
import { BookProgressModel } from '@/data/models/progress-model';


export default function HomeScreen() {
  const { progressManager } = useProgress();
  const [books, setBooks] = useState<BookProgressModel[]>();
  console.log("home - books: ", books)

  useEffect(() => {
    async function fetchBooks() {
      if (!progressManager) return;
      
      try {
        const result = await progressManager.getBooksProgress(0, 5);
        if (result.success && result.data) {
          setBooks(result.data as BookProgressModel[]);
        } else {
          console.error("Failed to fetch books:", result.error);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/books-logo.png')}
          style={styles.appLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">שלום, שלום!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.bookListContainer}>
        {books && books.length != 0 
          ? books.map((book) => (
            <View key={book.id} style={styles.bookBox}>
              <Text style={styles.bookTitle}>{book.bookName}</Text>
              <Text style={styles.bookLastAccessed}>
                נקרא לאחרונה: {new Date(book.lastAccessed).toLocaleDateString()}
              </Text>
            </View>
          ))
          : <ThemedText>נראה שלא פתחת ספר, מוזמן לפתוח ספר חדש</ThemedText>
        }
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    direction: 'rtl',
    alignSelf: 'center',
  },
  bookListContainer: {
    padding: 16,
  },
  bookBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookLastAccessed: {
    fontSize: 14,
    color: '#666',
  },
  appLogo: {
    height: HEADER_HEIGHT,
    bottom: 0,
    left: 0,
  },
});
