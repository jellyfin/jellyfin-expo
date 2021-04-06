/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Screens from '../constants/Screens';
import ServerHelpScreen from '../screens/ServerHelpScreen';

import AppNavigator from './AppNavigator';

enableScreens();
const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
	return (
		<RootStack.Navigator
			screenOptions={{
				headerShown: false,
				stackPresentation: 'modal'
			}}
		>
			<RootStack.Screen
				name={Screens.App}
				component={AppNavigator}
			/>
			<RootStack.Screen
				name={Screens.ServerHelpScreen}
				component={ServerHelpScreen}
			/>
		</RootStack.Navigator>
	);
};

export default RootNavigator;
