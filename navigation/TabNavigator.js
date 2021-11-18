/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Screens from '../constants/Screens';
import { useStores } from '../hooks/useStores';
import DownloadScreen from '../screens/DownloadScreen';
import { getIconName } from '../utils/Icons';

import HomeNavigator from './HomeNavigator';
import SettingsNavigator from './SettingsNavigator';

function TabIcon(routeName, color, size) {
	let iconName = null;
	if (routeName === Screens.HomeTab) {
		iconName = getIconName('tv-outline');
	} else if (routeName === Screens.DownloadsTab) {
		iconName = 'download-outline';
	} else if (routeName === Screens.SettingsTab) {
		iconName = getIconName('cog-outline');
	} else {
		iconName = 'help-circle-outline';
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

	const tabBarStyle = {};
	// Hide the bottom tab bar when in fullscreen view
	if (rootStore.isFullscreen) {
		tabBarStyle.display = 'none';
	}
	// Use a smaller height for the tab bar when labels are disabled
	if (!rootStore.settingStore.isTabLabelsEnabled) {
		tabBarStyle.height = insets.bottom + 28;
	}

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarIcon: ({ color, size }) => TabIcon(route.name, color, size),
				tabBarInactiveTintColor: theme.colors.grey1,
				tabBarShowLabel: rootStore.settingStore.isTabLabelsEnabled,
				tabBarStyle
			})}
		>
			<Tab.Screen
				name={Screens.HomeTab}
				component={HomeNavigator}
				options={{
					title: t('headings.home')
				}}
			/>
			<Tab.Screen
				name={Screens.DownloadsTab}
				component={DownloadScreen}
				options={{
					title: t('headings.downloads')
				}}
			/>
			<Tab.Screen
				name={Screens.SettingsTab}
				component={SettingsNavigator}
				options={{
					title: t('headings.settings')
				}}
			/>
		</Tab.Navigator>
	);
});

export default TabNavigator;
