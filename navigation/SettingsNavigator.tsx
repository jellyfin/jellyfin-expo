/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DEV_SETTINGS_SCREEN_NAME, SETTINGS_SCREEN_NAME } from '../constants/Screens';
import DevSettingsScreen from '../screens/DevSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type SettingsStackParams = {
	[SETTINGS_SCREEN_NAME]: undefined;
	[DEV_SETTINGS_SCREEN_NAME]: undefined;
};

const SettingsStack = createStackNavigator<SettingsStackParams>();

const SettingsNavigator = () => {
	const { t } = useTranslation();

	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name={SETTINGS_SCREEN_NAME}
				component={SettingsScreen}
				options={{
					title: t('headings.settings')
				}}
			/>
			<SettingsStack.Screen
				name={DEV_SETTINGS_SCREEN_NAME}
				component={DevSettingsScreen}
				options={{
					title: 'Developers, Developers, Developers!'
				}}
			/>
		</SettingsStack.Navigator>
	);
};

export default SettingsNavigator;
