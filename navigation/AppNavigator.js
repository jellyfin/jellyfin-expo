/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Screens from '../constants/Screens';
import { useStores } from '../hooks/useStores';
import AddServerScreen from '../screens/AddServerScreen';

import TabNavigator from './TabNavigator';

const AppStack = createStackNavigator();

const AppNavigator = () => {
	const { rootStore, serverStore } = useStores();
	const { t } = useTranslation();

	// Ensure the splash screen is hidden when loading is finished
	SplashScreen.hideAsync().catch(console.debug);

	return (
		<AppStack.Navigator
			initialRouteName={(serverStore.servers?.length > 0) ? Screens.MainScreen : Screens.AddServerScreen}
			screenOptions={{
				headerMode: 'screen',
				headerShown: false
			}}
		>
			<AppStack.Screen
				name={Screens.MainScreen}
				component={TabNavigator}
				options={({ route }) => {
					const routeName =
						// Get the currently active route name in the tab navigator
						getFocusedRouteNameFromRoute(route) ||
						// If state doesn't exist, we need to default to `screen` param if available, or the initial screen
						// In our case, it's "Main" as that's the first screen inside the navigator
						route.params?.screen || Screens.MainScreen;
					return ({
						headerShown: false,
						title: t(`headings.${routeName.toLowerCase()}`)
					});
				}}
			/>
			<AppStack.Screen
				name={Screens.AddServerScreen}
				component={AddServerScreen}
				options={{
					headerShown: serverStore.servers?.length > 0,
					title: t('headings.addServer')
				}}
			/>
		</AppStack.Navigator>
	);
}

export default AppNavigator;
