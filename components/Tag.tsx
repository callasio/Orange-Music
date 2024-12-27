import { Text, View, StyleSheet, Pressable } from 'react-native';

interface TagProps {
    name: string;
    toggled: boolean;
    onClick: () => void;
}

export default function Tag({
    name,
    toggled,
    onClick,
}: TagProps) {
    return (
        <Pressable style={{
            backgroundColor: toggled ? 'black' : 'white',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'black',
            borderWidth: 1,
        }} onPress={onClick}>
            <Text style={{
                color: toggled ? 'white' : 'black',
                fontSize: 13,
            }}>{name}</Text>
        </Pressable>
    );
}