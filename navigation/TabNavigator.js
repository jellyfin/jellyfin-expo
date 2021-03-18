/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { ThemeContext } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { getIconName } from '../utils/Icons';
import HomeNavigator from './HomeNavigator';
import Screens from '../constants/Screens';
import SettingsScreen from '../screens/SettingsScreen';
import { useStores } from '../hooks/useStores';

function TabIcon(routeName, color, size) {
	let iconName = null;
	if (routeName === Screens.HomeTab) {
		iconName = getIconName('tv');
	} else if (routeName === Screens.SettingsTab) {
		iconName = getIconName('cog');
	}

	return (
		iconName ? <Ionicons name={iconName} color={color} size={size} /> : null
	);
}

const Tab = createBottomTabNavigator();

const TabNavigator = observer(() => {
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
				name={Screens.HomeTab}
				component={HomeNavigator}
				options={{
					title: t('headings.home')
				}}
			/>
			<Tab.Screen
				name={Screens.SettingsTab}
				component={SettingsScreen}
				options={{
					title: t('headings.settings')
				}}
			/>
		</Tab.Navigator>
	);
});

export default TabNavigator;
