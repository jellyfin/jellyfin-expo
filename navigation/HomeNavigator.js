/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Screens from '../constants/Screens';
import ErrorScreen from '../screens/ErrorScreen';
import HomeScreen from '../screens/HomeScreen';

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
	return (
		<HomeStack.Navigator
			screenOptions={{
				headerShown: false,
				animationEnabled: false,
				animationTypeForReplace: 'pop',
				presentation: 'modal'
			}}
		>
			<HomeStack.Screen
				name={Screens.HomeScreen}
				component={HomeScreen}
			/>
			<HomeStack.Screen
				name={Screens.ErrorScreen}
				component={ErrorScreen}
				options={{
					gestureEnabled: false
				}}
			/>
		</HomeStack.Navigator>
	);
}

export default HomeNavigator;
