import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HEADER_HEIGHT } from '@/constants/Sizes';

export default function HomeScreen() {
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    direction: 'rtl',
    alignSelf: 'center',
  },
  appLogo: {
    height: HEADER_HEIGHT,
    bottom: 0,
    left: 0,
  },
});
