/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Button, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import DownloadListItem from '../components/DownloadListItem';
import { useStores } from '../hooks/useStores';

const getDownloadDir = download => `${FileSystem.documentDirectory}${download.serverId}/${download.itemId}/`;
const getDownloadUri = download => getDownloadDir(download) + encodeURI(download.filename);

async function ensureDirExists(dir) {
	const info = await FileSystem.getInfoAsync(dir);
	if (!info.exists) {
		await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
	}
}

const DownloadScreen = observer(() => {
	const navigation = useNavigation();
	const { rootStore } = useStores();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const [ isEditMode, setIsEditMode ] = useState(false);
	const [ resumables, setResumables ] = useState([]);
	const [ selectedItems, setSelectedItems ] = useState([]);

	async function deleteItem(item) {
		// TODO: Add user messaging on errors
		try {
			await FileSystem.deleteAsync(getDownloadDir(item));
			rootStore.downloadStore.remove(rootStore.downloadStore.downloads.indexOf(item));
		} catch (e) {
			console.error('Failed to delete download', e);
		}
	}

	function exitEditMode() {
		setIsEditMode(false);
		setSelectedItems([]);
	}

	function onDeleteItems(items) {
		Alert.alert(
			'Delete Downloads',
			'These items will be permanently deleted from this device.',
			[
				{
					text: t('common.cancel'),
					onPress: exitEditMode
				},
				{
					text: `Delete ${items.length} Downloads`,
					onPress: async () => {
						await Promise.all(items.map(deleteItem));
						exitEditMode();
					},
					style: 'destructive'
				}
			]
		);
	}

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				isEditMode ?
					<Button
						title={t('common.cancel')}
						type='clear'
						onPress={exitEditMode}
						style={styles.leftButton}
					/> :
					null
			),
			headerRight: () => (
				isEditMode ?
					<Button
						title={t('common.delete')}
						type='clear'
						style={styles.rightButton}
						disabled={selectedItems.length < 1}
						onPress={() => {
							onDeleteItems(selectedItems);
						}}
					/> :
					<Button
						title={t('common.edit')}
						type='clear'
						onPress={() => {
							setIsEditMode(true);
						}}
						style={styles.rightButton}
					/>
			)
		});
	}, [ navigation, isEditMode, selectedItems ]);

	async function downloadFile(download) {
		await ensureDirExists(getDownloadDir(download));

		const url = download.url;
		const uri = getDownloadUri(download);

		const resumable = FileSystem.createDownloadResumable(
			url,
			uri,
			{},
			// TODO: Show download progress in ui
			console.log
		);
		setResumables([ ...resumables, resumable ]);
		try {
			rootStore.downloadStore.update(download, { isDownloading: true });
			await resumable.downloadAsync();
			rootStore.downloadStore.update(download, {
				isDownloading: false,
				isComplete: true
			});
		} catch (e) {
			console.error('Download failed', e);
			rootStore.downloadStore.update(download, { isDownloading: false });
		}
	}

	useEffect(() => {
		rootStore.downloadStore.downloads
			.filter(download => !download.isComplete && !download.isDownloading)
			.forEach(downloadFile);
	}, [ rootStore.downloadStore.downloads ]);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={[ 'right', 'left' ]}
		>
			<FlatList
				data={[ ...rootStore.downloadStore.downloads ]}
				renderItem={({ item, index }) => (
					<DownloadListItem
						item={item}
						index={index}
						isEditMode={isEditMode}
						isSelected={selectedItems.includes(item)}
						onSelect={() => {
							if (selectedItems.includes(item)) {
								setSelectedItems(selectedItems.filter(selected => selected !== item));
							} else {
								setSelectedItems([ ...selectedItems, item ]);
							}
						}}
						onShare={async () => {
							Sharing.shareAsync(
								await FileSystem.getContentUriAsync(getDownloadUri(item))
							);
						}}
					/>
				)}
				keyExtractor={(item, index) => `download-${index}-${item.serverId}-${item.itemId}`}
				contentContainerStyle={styles.listContainer}
			/>
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	listContainer: {
		marginTop: 1
	},
	leftButton: {
		marginLeft: 8
	},
	rightButton: {
		marginRight: 8
	}
});

export default DownloadScreen;
