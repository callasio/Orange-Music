import { search, SearchResponse } from '@/api/search';
import { useEffect, useState } from 'react';
import { Alert, Text, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);

  const fetchData = async () => {
    try {
      const data = await search({
        query: 'Never Gonna Give You Up',
        type: ['track'],
      });
      setData(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>{JSON.stringify(data, null, 2)}</Text>
      )}  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
