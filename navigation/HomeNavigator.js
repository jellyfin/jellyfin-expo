/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

import ErrorScreen from '../screens/ErrorScreen';
import HomeScreen from '../screens/HomeScreen';
import Screens from '../constants/Screens';
import { useStores } from '../hooks/useStores';

const HomeStack = createStackNavigator();

const HomeNavigator = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();

	useEffect(() => {
		// Show/hide the bottom tab bar
		navigation.setOptions({
			tabBarVisible: !rootStore.isFullscreen
		});
	}, [ rootStore.isFullscreen ]);

	return (
		<HomeStack.Navigator
			mode='modal'
			screenOptions={{
				headerShown: false,
				animationEnabled: false,
				animationTypeForReplace: 'pop'
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
});

export default HomeNavigator;
