/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createStackNavigator } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Screens from '../constants/Screens';
import DevSettingsScreen from '../screens/DevSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const SettingsStack = createStackNavigator();

const SettingsNavigator = observer(() => {
	const { t } = useTranslation();

	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name={Screens.SettingsScreen}
				component={SettingsScreen}
				options={{
					title: t('headings.settings')
				}}
			/>
			<SettingsStack.Screen
				name={Screens.DevSettingsScreen}
				component={DevSettingsScreen}
				options={{
					title: 'Developers, Developers, Developers!'
				}}
			/>
		</SettingsStack.Navigator>
	);
});

export default SettingsNavigator;
