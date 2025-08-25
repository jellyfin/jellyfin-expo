/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';

import { Screens } from '../constants/Screens';
import ServerHelpScreen from '../screens/ServerHelpScreen';

import AppNavigator from './AppNavigator';

export type RootNavigatorParams = {
	[Screens.App]: undefined;
	[Screens.ServerHelpScreen]: undefined;
};

enableScreens();
const RootStack = createNativeStackNavigator<RootNavigatorParams>();

const RootNavigator = () => {
	return (
		<RootStack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<RootStack.Screen
				name={Screens.App}
				component={AppNavigator}
			/>
			<RootStack.Screen
				name={Screens.ServerHelpScreen}
				component={ServerHelpScreen}
				options={{
					presentation: 'modal'
				}}
			/>
		</RootStack.Navigator>
	);
};

RootNavigator.displayName = 'RootNavigator';

export default RootNavigator;
