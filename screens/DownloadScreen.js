/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import DownloadListItem from '../components/DownloadListItem';
import { useStores } from '../hooks/useStores';

const getDownloadDir = download => `${FileSystem.documentDirectory}${download.serverId}/${download.itemId}/`;
const getDownloadUri = download => getDownloadDir(download) + encodeURI(download.filename);

async function ensureDirExists(dir) {
	console.log('ensure directory', dir);
	const info = await FileSystem.getInfoAsync(dir);
	console.log('directory info', info);
	if (!info.exists) {
		await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
	}
}

const DownloadScreen = observer(() => {
	const { rootStore } = useStores();
	const { theme } = useContext(ThemeContext);
	const [ resumables, setResumables ] = useState([]);

	async function downloadFile(download) {
		console.log('download file', download);
		await ensureDirExists(getDownloadDir(download));

		const url = download.url;
		const uri = getDownloadUri(download);
		console.log('url', url, uri);

		const resumable = FileSystem.createDownloadResumable(
			url,
			uri,
			{},
			console.log
		);
		setResumables([ ...resumables, resumable ]);
		try {
			download.isDownloading = true;
			await resumable.downloadAsync();
			download.isDownloading = false;
			download.isComplete = true;
		} catch (e) {
			console.error('Download failed', e);
			download.isDownloading = false;
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
				data={rootStore.downloadStore.downloads}
				renderItem={({ item, index }) => (
					<DownloadListItem
						item={item}
						index={index}
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
	}
});

export default DownloadScreen;
