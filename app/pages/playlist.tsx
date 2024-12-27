import { ItemInfo } from '@/components/CardElement';
import { Route, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function PlaylistPage() {
    const {name, artist, image, id} = useLocalSearchParams<Route & ItemInfo>();
    
    return (
        <Text>Playlist Page</Text>
    )
}