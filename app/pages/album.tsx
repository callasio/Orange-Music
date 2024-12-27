import { ItemInfo } from '@/components/CardElement';
import { Route, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function AlbumPage() {
    const {name, artist, image, id} = useLocalSearchParams<Route & ItemInfo>();

    return (
        <Text>Album Page</Text>
    )
}