/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { toJS, values } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Button, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import DownloadListItem from '../components/DownloadListItem';
import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';

const DownloadScreen = observer(() => {
	const navigation = useNavigation();
	const { rootStore } = useStores();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);
	const [ isEditMode, setIsEditMode ] = useState(false);
	const [ selectedItems, setSelectedItems ] = useState([]);

	function exitEditMode() {
		setIsEditMode(false);
		setSelectedItems([]);
	}

	React.useLayoutEffect(() => {
		async function deleteItem(download) {
			// TODO: Add user messaging on errors
			try {
				await FileSystem.deleteAsync(download.localPath);
				rootStore.downloadStore.downloads.delete(download.key);
				console.log('[DownloadScreen] download "%s" deleted', download.title);
			} catch (e) {
				console.error('[DownloadScreen] Failed to delete download', e);
			}
		}

		function onDeleteItems(downloads) {
			Alert.alert(
				'Delete Downloads',
				'These items will be permanently deleted from this device.',
				[
					{
						text: t('common.cancel'),
						onPress: exitEditMode
					},
					{
						text: `Delete ${downloads.length} Downloads`,
						onPress: async () => {
							await Promise.all(downloads.map(deleteItem));
							exitEditMode();
						},
						style: 'destructive'
					}
				]
			);
		}

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
						style={styles.rightButton}
						disabled={rootStore.downloadStore.downloads.size < 1}
						onPress={() => {
							setIsEditMode(true);
						}}
					/>
			)
		});
	}, [ navigation, isEditMode, selectedItems, rootStore.downloadStore.downloads ]);

	useFocusEffect(
		useCallback(() => {
			rootStore.downloadStore.downloads
				.forEach(download => {
					if (download.isNew) {
						download.isNew = !download.isComplete;
					}
				});
		}, [ rootStore.downloadStore.downloads ])
	);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={[ 'right', 'left' ]}
		>
			<FlatList
				data={values(rootStore.downloadStore.downloads)}
				extraData={toJS(rootStore.downloadStore.downloads)}
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
						onPlay={async () => {
							item.isNew = false;
							rootStore.mediaStore.isLocalFile = true;
							rootStore.mediaStore.type = MediaTypes.Video;
							rootStore.mediaStore.uri = item.uri;
						}}
					/>
				)}
				keyExtractor={(item, index) => `download-${index}-${item.key}`}
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
