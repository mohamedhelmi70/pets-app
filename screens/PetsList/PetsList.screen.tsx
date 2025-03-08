import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { AppScreenProps, Pet } from '../../types';
import { supabase } from '../../services';

const PetCard = ({ pet, onPress }: { pet: Pet, onPress: () => void; }) => (
    <TouchableOpacity style={styles.card_wrapper} onPress={onPress}>
        <View style={styles.card}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text>Species: {pet.species}</Text>
            <Text>Age: {pet.age} years</Text>
        </View>
    </TouchableOpacity>
);

export const PetsListScreen: React.FC<AppScreenProps<'PetsList'>> = ({ navigation }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const { data: pets, error } = await supabase.from('pets').select("*");
        
                if (error) {
                    console.error('Error fetching pets:', error.message);
                    return;
                }
        
                if (pets && pets.length > 0) {
                    setPets(pets);
                }
            } catch (error: any) {
                console.error('Error fetching pets:', error?.message);
            }   finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }

    if (!pets || pets?.length == 0) {
        return (
            <View style={[styles.container, styles.flex_center]}>
                <Text>There are no pets, available</Text>
            </View>
        );
    }

    return (
        <FlatList 
            style={styles.container}
            data={pets}
            contentContainerStyle={styles.list_view}
            renderItem={({item}) => (
                <PetCard 
                    pet={item} 
                    onPress={() => navigation?.navigate('SingleProfile', {id: item?.id})}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    list_view: {
        paddingBottom: 20,
    },
    flex_center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    card_wrapper: {
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
}); 