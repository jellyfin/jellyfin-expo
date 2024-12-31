/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import SwitchListItem from '../components/SwitchListItem';

import { useStores } from '../hooks/useStores';

const DevSettingsScreen = () => {
	const { rootStore, settingStore } = useStores();
	const { theme } = useContext(ThemeContext);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={[ 'right', 'left' ]}
		>
			<FlatList
				data={[
					{
						key: 'experimental-audio-player-switch',
						title: 'Native Audio Player',
						badge: {
							value: 'Experimental',
							status: 'error'
						},
						value: settingStore.isExperimentalNativeAudioPlayerEnabled,
						onValueChange: (value) => {
							settingStore.set({ isExperimentalNativeAudioPlayerEnabled: value });
							rootStore.set({ isReloadRequired: true });
						}
					},
					{
						key: 'experimental-downloads-switch',
						title: 'File Download Support',
						badge: {
							value: 'Experimental',
							status: 'error'
						},
						value: settingStore.isExperimentalDownloadsEnabled,
						onValueChange: (value) => {
							settingStore.set({ isExperimentalDownloadsEnabled: value });
							rootStore.set({ isReloadRequired: true });
						}
					}
				]}
				renderItem={SwitchListItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.listContainer}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listContainer: {
		marginTop: 1
	}
});

export default DevSettingsScreen;
