import { ItemInfo } from '@/components/CardElement';
import { Route, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TrackPage() {
    const {name, artist, image, id} = useLocalSearchParams<Route & ItemInfo>();
    
    console.log(name, artist, image, id);

    return (
        <View>
            <Text>{name}</Text>
            <Text>{artist}</Text>
        </View>
    );
}