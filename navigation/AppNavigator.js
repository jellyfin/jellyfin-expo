/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';
import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { useStores } from '../hooks/useStores';
import Colors from '../constants/Colors';
import AddServerScreen from '../screens/AddServerScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Customize theme for navigator
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.tintColor,
    background: Colors.backgroundColor,
    card: Colors.headerBackgroundColor,
    text: Colors.textColor,
    border: 'transparent'
  }
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon(routeName, color, size) {
  let iconName = null;
  if (routeName === 'Home') {
    iconName = 'ios-tv';
  } else if (routeName === 'Settings') {
    iconName = 'ios-cog';
  }

  return (
    iconName ? <Ionicons name={iconName} color={color} size={size} /> : null
  );
}

function Main() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => TabIcon(route.name, color, size)
      })}
      tabBarOptions={{
        inactiveTintColor: Colors.tabText
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator = observer(() => {
  const { rootStore } = useStores();

  // Ensure the splash screen is hidden when loading is finished
  SplashScreen.hide();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={(rootStore.serverStore.servers.length > 0) ? 'Main' : 'AddServer'}
        headerMode='screen'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name='Main'
          component={Main}
          options={({ route }) => {
            const routeName = route.state ?
              // Get the currently active route name in the tab navigator
              route.state.routes[route.state.index].name :
              // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
              // In our case, it's "Main" as that's the first screen inside the navigator
              route.params?.screen || 'Main';
            return ({
              headerShown: routeName === 'Settings',
              title: routeName
            });
          }}
        />
        <Stack.Screen
          name='AddServer'
          component={AddServerScreen}
          options={{
            headerShown: rootStore.serverStore.servers.length > 0,
            title: 'Add Server'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default AppNavigator;
