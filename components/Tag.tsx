import { Colors } from '@/constants/Colors';
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
            backgroundColor: toggled ? Colors.theme.primary : Colors.theme.secondary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }} onPress={onClick}>
            <Text style={{
                color: Colors.theme.text,
                fontSize: 13,
            }}>{name}s</Text>
        </Pressable>
    );
}