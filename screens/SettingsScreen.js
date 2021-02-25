/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext, useEffect } from 'react';
import { Alert, AsyncStorage, Platform, SectionList, StyleSheet, View } from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import AppInfoFooter from '../components/AppInfoFooter';
import BrowserListItem from '../components/BrowserListItem';
import ButtonListItem from '../components/ButtonListItem';
import ServerListItem from '../components/ServerListItem';
import SwitchListItem from '../components/SwitchListItem';
import Links from '../constants/Links';
import Screens from '../constants/Screens';
import { useStores } from '../hooks/useStores';

const SettingsScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	useEffect(() => {
		// Fetch server info
		rootStore.serverStore.fetchInfo();
	}, []);

	const onAddServer = () => {
		navigation.navigate(Screens.AddServerScreen);
	};

	const onDeleteServer = index => {
		Alert.alert(
			t('alerts.deleteServer.title'),
			t('alerts.deleteServer.description', { serverName: rootStore.serverStore.servers[index]?.name }),
			[
				{ text: t('common.cancel') },
				{
					text: t('alerts.deleteServer.confirm'),
					onPress: action(() => {
						// Remove server and update active server
						rootStore.serverStore.removeServer(index);
						rootStore.settingStore.activeServer = 0;

						if (rootStore.serverStore.servers.length > 0) {
							// More servers exist, navigate home
							navigation.replace(Screens.HomeScreen);
							navigation.navigate(Screens.HomeTab);
						} else {
							// No servers are present, navigate to add server screen
							navigation.replace(Screens.AddServerScreen);
						}
					}),
					style: 'destructive'
				}
			]
		);
	};

	const onSelectServer = action(index => {
		rootStore.settingStore.activeServer = index;
		navigation.replace(Screens.HomeScreen);
		navigation.navigate(Screens.HomeTab);
	});

	const onResetApplication = () => {
		Alert.alert(
			t('alerts.resetApplication.title'),
			t('alerts.resetApplication.description'),
			[
				{ text: t('common.cancel') },
				{
					text: t('alerts.resetApplication.confirm'),
					onPress: action(() => {
						// Reset data in stores
						rootStore.reset();
						AsyncStorage.clear();
						// Navigate to the loading screen
						navigation.replace(Screens.AddServerScreen);
					}),
					style: 'destructive'
				}
			]
		);
	};

	const AugmentedServerListItem = (props) => (
		<ServerListItem
			{...props}
			activeServer={rootStore.settingStore.activeServer}
			onDelete={onDeleteServer}
			onPress={onSelectServer}
		/>
	);

	const getSections = () => {
		const settingsData = [{
			key: 'keep-awake-switch',
			title: t('settings.keepAwake'),
			value: rootStore.settingStore.isScreenLockEnabled,
			onValueChange: action(value => rootStore.settingStore.isScreenLockEnabled = value)
		}];

		// Orientation lock is not supported on iPad without disabling multitasking
		// https://docs.expo.io/versions/latest/sdk/screen-orientation/#warning
		if (Platform.OS !== 'ios' || !Platform.isPad) {
			settingsData.push({
				key: 'rotation-lock-switch',
				title: t('settings.rotationLock'),
				value: rootStore.settingStore.isRotationLockEnabled,
				onValueChange: action(value => rootStore.settingStore.isRotationLockEnabled = value)
			});
		}

		// TODO: Add Android support for native video player
		if (Platform.OS === 'ios') {
			settingsData.push({
				key: 'native-video-switch',
				title: t('settings.nativeVideoPlayer'),
				subtitle: t('settings.minimumServerVersion'),
				value: rootStore.settingStore.isNativeVideoPlayerEnabled,
				onValueChange: action(value => {
					rootStore.settingStore.isNativeVideoPlayerEnabled = value;
					rootStore.isReloadRequired = true;
				})
			});
		}

		settingsData.push({
			key: 'tab-labels-switch',
			title: t('settings.tabLabels'),
			value: rootStore.settingStore.isTabLabelsEnabled,
			onValueChange: action(value => rootStore.settingStore.isTabLabelsEnabled = value)
		});

		settingsData.push({
			key: 'system-theme-switch',
			title: t('settings.systemTheme'),
			value: rootStore.settingStore.isSystemThemeEnabled,
			onValueChange: action(value => rootStore.settingStore.isSystemThemeEnabled = value)
		});

		// TODO: This should be able to select from a list not just a switch
		settingsData.push({
			key: 'theme-switch',
			title: t('settings.lightTheme'),
			disabled: rootStore.settingStore.isSystemThemeEnabled,
			value: rootStore.settingStore.themeId === 'light',
			onValueChange: action(value => rootStore.settingStore.themeId = value ? 'light' : 'dark')
		});

		return [
			{
				title: t('headings.servers'),
				data: rootStore.serverStore.servers.slice(),
				keyExtractor: (item, index) => `server-${index}`,
				renderItem: AugmentedServerListItem
			},
			{
				title: t('headings.addServer'),
				hideHeader: true,
				data: [{
					key: 'add-server-button',
					title: t('headings.addServer'),
					onPress: onAddServer
				}],
				renderItem: ButtonListItem
			},
			{
				title: t('headings.settings'),
				data: settingsData,
				renderItem: SwitchListItem
			},
			{
				title: t('headings.links'),
				data: Links.map(link => ({
					...link,
					name: t(link.name)
				})),
				renderItem: BrowserListItem
			},
			{
				title: t('alerts.resetApplication.title'),
				hideHeader: true,
				data: [{
					key: 'reset-app-button',
					title: t('alerts.resetApplication.title'),
					titleStyle: {
						color: theme.colors.error
					},
					onPress: onResetApplication
				}],
				renderItem: ButtonListItem
			}
		];
	};

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={['right', 'left']}
		>
			<SectionList
				sections={getSections()}
				extraData={{
					activeServer: rootStore.settingStore.activeServer,
					isFetching: rootStore.serverStore.fetchInfo.pending
				}}
				renderItem={({ item }) => <Text>{JSON.stringify(item)}</Text>}
				renderSectionHeader={({ section: { title, hideHeader } }) => (
					hideHeader ?
						<View style={styles.emptyHeader} /> :
						<Text style={{
							...styles.header,
							backgroundColor: theme.colors.background,
							color: theme.colors.grey1
						}}>{title}</Text>
				)}
				renderSectionFooter={() => <View style={styles.footer} />}
				ListFooterComponent={AppInfoFooter}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		fontSize: 17,
		fontWeight: '600',
		paddingVertical: 8,
		paddingHorizontal: 15,
		marginBottom: 1
	},
	emptyHeader: {
		marginTop: 15
	},
	footer: {
		marginBottom: 15
	}
});

export default SettingsScreen;
