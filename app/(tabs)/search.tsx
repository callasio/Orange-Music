import { StyleSheet, Text, View, TextInput, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from '@/components/Tag';
import { search, SearchResponse } from '@/api/search';
import SearchResult from '@/components/SearchResult';
import axios from 'axios';
import { getSpotifyToken } from '../../api/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardElement, { ElementProps } from '@/components/CardElement';
import { HISTORY_KEY } from '@/constants/Keys';
import { Colors } from '@/constants/Colors';

type SearchType = 'track' | 'album' | 'artist' | 'playlist';

export default function SearchScreen() {
  const textInputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  const [searchType, setSearchType] = useState<SearchType>('track');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [dataType, setDataType] = useState<SearchType>('track');

  const [noQuery, setNoQuery] = useState(true);

  const [history, setHistory] = useState<ElementProps[]>([]);

  const fetchHistory = async () => {
    const history = await AsyncStorage.getItem(HISTORY_KEY);

    if (history) {
      setHistory(JSON.parse(history));
    }
  }

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

  const MoreData = async (next: string) => {
    if (data === null) return;
    try {
      const moreData = await axios.get(next, {
        headers: {
          'Authorization': 'Bearer ' + (await getSpotifyToken()).access_token
        }
      },);
      setData({
        ...data,
        [`${dataType}s`]: {
          ...data[`${dataType}s`],
          items: [...data[`${dataType}s`].items, ...moreData.data[`${dataType}s`].items]
        }
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  useEffect(() => {
    fetchHistory();
    setLoading(true);
    if (query !== '') {
      setNoQuery(false);
      fetchData(query, [searchType]);
    }
    else setNoQuery(true);
  }, [query, searchType]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: Colors.theme.background }}>
        <View style={styles.column}>
          <View style={styles.searchBox}>
            <Pressable
              style={styles.searchButton}
              android_ripple={{ color: "rgba(128, 128, 128, 0.3)", borderless: true }}
              onPress={() => textInputRef.current?.focus()}
            >
              <MaterialIcons style={{ flex: 0 }} name="search" size={24} color={Colors.theme.text} />
              <TextInput
                ref={textInputRef}
                style={styles.input}
                onChangeText={setQuery}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
            noQuery ? 
            (history.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 20, color: "#BBB" }}>Search for something!</Text>
                </View>
            ) : (
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={{ 
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  marginLeft: 10,
                  color: Colors.theme.text,
                }}>Recent Searches</Text>
                <FlatList
                  data={history}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <CardElement item={item.item} type={item.type} onHistoryUpdate={fetchHistory} isHistory/>
                    );
                  }}
                />
              </View>
            )) :
            loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator style={{ height: 'auto' }} size="large" color={Colors.theme.primary}  />
              </View>
            ) : (
              <SearchResult data={data!} type={dataType} onEndReached={
                data![`${dataType}s`]?.next ? () => MoreData(data![`${dataType}s`].next!) : () => {}
              } />
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
    height: '100%',
    padding: 20,
    paddingTop:10,
    gap: 10,
  },
  searchBox: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    elevation: 2,
    borderRadius: 100,
    backgroundColor: Colors.theme.primary,
  },
  searchButton: {
    paddingStart: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    fontWeight: 'bold',
    color: Colors.theme.text,
  },
});
