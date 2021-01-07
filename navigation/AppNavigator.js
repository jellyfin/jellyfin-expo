/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext, useEffect } from 'react';
import { ThemeContext } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	NavigationContainer,
	getFocusedRouteNameFromRoute,
	useNavigation
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useStores } from '../hooks/useStores';
import AddServerScreen from '../screens/AddServerScreen';
import ErrorScreen from '../screens/ErrorScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getIconName } from '../utils/Icons';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function TabIcon(routeName, color, size) {
	let iconName = null;
	if (routeName === 'Home') {
		iconName = getIconName('tv');
	} else if (routeName === 'Settings') {
		iconName = getIconName('cog');
	}

	return (
		iconName ? <Ionicons name={iconName} color={color} size={size} /> : null
	);
}

const Home = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();

	useEffect(() => {
		// Show/hide the bottom tab bar
		navigation.setOptions({
			tabBarVisible: !rootStore.isFullscreen
		});
	}, [rootStore.isFullscreen]);

	return (
		<HomeStack.Navigator
			mode="modal"
			screenOptions={{
				headerShown: false,
				animationEnabled: false,
				animationTypeForReplace: 'pop'
			}}
		>
			<HomeStack.Screen
				name='HomeScreen'
				component={HomeScreen}
			/>
			<HomeStack.Screen
				name="ErrorScreen"
				component={ErrorScreen}
				options={{
					gestureEnabled: false
				}}
			/>
		</HomeStack.Navigator>
	);
});

const Main = observer(() => {
	const { rootStore } = useStores();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	// Use a smaller height for the tab bar when labels are disabled
	const tabBarStyle = !rootStore.settingStore.isTabLabelsEnabled ? { height: insets.bottom + 28 } : {};

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => TabIcon(route.name, color, size)
			})}
			tabBarOptions={{
				inactiveTintColor: theme.colors.grey1,
				showLabel: rootStore.settingStore.isTabLabelsEnabled,
				style: tabBarStyle
			}}
		>
			<Tab.Screen
				name='Home'
				component={Home}
				options={{
					title: t('headings.home')
				}}
			/>
			<Tab.Screen
				name='Settings'
				component={SettingsScreen}
				options={{
					title: t('headings.settings')
				}}
			/>
		</Tab.Navigator>
	);
});

const AppNavigator = observer(() => {
	const { rootStore } = useStores();
	const { t } = useTranslation();

	// Ensure the splash screen is hidden when loading is finished
	SplashScreen.hideAsync();

	return (
		<NavigationContainer theme={rootStore.settingStore.theme.Navigation}>
			<RootStack.Navigator
				initialRouteName={(rootStore.serverStore.servers?.length > 0) ? 'Main' : 'AddServer'}
				headerMode='screen'
				screenOptions={{ headerShown: false }}
			>
				<RootStack.Screen
					name='Main'
					component={Main}
					options={({ route }) => {
						const routeName =
							// Get the currently active route name in the tab navigator
							getFocusedRouteNameFromRoute(route) ||
							// If state doesn't exist, we need to default to `screen` param if available, or the initial screen
							// In our case, it's "Main" as that's the first screen inside the navigator
							route.params?.screen || 'Main';
						return ({
							headerShown: routeName === 'Settings',
							title: t(`headings.${routeName.toLowerCase()}`)
						});
					}}
				/>
				<RootStack.Screen
					name='AddServer'
					component={AddServerScreen}
					options={{
						headerShown: rootStore.serverStore.servers?.length > 0,
						title: t('headings.addServer')
					}}
				/>
			</RootStack.Navigator>
		</NavigationContainer>
	);
});

export default AppNavigator;
