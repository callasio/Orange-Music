import { StyleSheet, Text, View, ScrollView, TextInput, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from '@/components/Tag';
import { search, SearchResponse } from '@/api/search';

export default function SearchScreen() {
  const textInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  const [searchType, setSearchType] = useState<'track' | 'album' | 'artist' | 'playlist' | null>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);

  const fetchData = async (query: string, type: ('track' | 'album' | 'artist' | 'playlist')[]) => {
    try {
      setLoading(true);
      const data = await search({
        query: query,
        type: type,
        limit: 50,
      });
      setData(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (query !== '' && searchType !== null) {
      fetchData(query, [searchType]);
    }}, [query, searchType]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.column}>
          <View style={styles.searchBox}>
            <Pressable
              style={styles.searchButton}
              android_ripple={{ color: 'gray', borderless: true }}
              onPress={() => textInputRef.current?.focus()}
            >
              <MaterialIcons style={{ flex: 0 }} name="search" size={24} color="black" />
              <TextInput
                ref={textInputRef}
                style={styles.input}
                onChangeText={setQuery}
                value={query}
                placeholder="Search"
              />
            </Pressable>
          </View>
          <View style={{
            flexDirection: 'row',
            gap: 10,
          }}>
            <Tag name="Track" toggled={searchType === 'track'} onClick={() => {
              setSearchType(searchType === 'track' ? null : 'track');
            }} />
            <Tag name="Album" toggled={searchType === 'album'} onClick={() => {
              setSearchType(searchType === 'album' ? null : 'album');
            }} />
            <Tag name="Playlist" toggled={searchType === 'playlist'} onClick={() => {
              setSearchType(searchType === 'playlist' ? null : 'playlist');
            }} />
            <Tag name="Artist" toggled={searchType === 'artist'} onClick={() => {
              setSearchType(searchType === 'artist' ? null : 'artist');
            }} />
          </View>
          {
            loading ? (
              <View>
                <Text>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={[
                  ...(data?.tracks?.items ?? []),
                  ...(data?.albums?.items ?? []),
                  ...(data?.playlists?.items ?? []),
                  ...(data?.artists?.items ?? []),
                ]}
                renderItem={({ item }) => (
                  <Text>{item.name}</Text>
                )}
              />
            )
          }
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 10,
    gap: 10,
  },
  searchBox: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    elevation: 2,
    borderRadius: 100,
    backgroundColor: 'lightgray',
  },
  searchButton: {
    paddingStart: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0,
  },
});
