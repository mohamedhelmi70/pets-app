import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SingleProfileScreen } from './screens/profiles/SingleProfile.screen';
import { AppParamList } from './types';
import { PetsListScreen } from './screens/PetsList/PetsList.screen';

const Stack = createNativeStackNavigator<AppParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='PetsList'>
        <Stack.Screen 
          name="PetsList" 
          component={PetsListScreen}
          options={{ title: 'Pets List' }}
        />
        <Stack.Screen 
          name="SingleProfile" 
          component={SingleProfileScreen}
          options={{ title: 'Pet Profile' }}
          initialParams={{ id: '1' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 