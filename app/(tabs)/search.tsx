import { StyleSheet, Text, View, ScrollView, TextInput, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from '@/components/Tag';
import { search, SearchResponse } from '@/api/search';
import SearchResult from '@/components/SearchResult';

type SearchType = 'track' | 'album' | 'artist' | 'playlist';

export default function SearchScreen() {
  const textInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  const [searchType, setSearchType] = useState<SearchType>('track');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [dataType, setDataType] = useState<SearchType>('track');

  const fetchData = async (query: string, type: SearchType[]) => {
    try {
      const data = await search({
        query: query,
        type: type,
      });
      setData(data);
      setDataType(type[0]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
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
              setSearchType('track');
            }} />
            <Tag name="Album" toggled={searchType === 'album'} onClick={() => {
              setSearchType('album');
            }} />
            <Tag name="Playlist" toggled={searchType === 'playlist'} onClick={() => {
              setSearchType('playlist');
            }} />
            <Tag name="Artist" toggled={searchType === 'artist'} onClick={() => {
              setSearchType('artist');
            }} />
          </View>
          {
            loading ? (
              <View>
                <Text>Loading...</Text>
              </View>
            ) : (
              <SearchResult data={data!} type={dataType}/>
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
