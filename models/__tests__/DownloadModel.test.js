/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DownloadModel, { fromStorageObject } from '../DownloadModel';

const DOCUMENT_DIRECTORY = '/DOC_DIR/';

jest.mock('expo-file-system', () => ({
	documentDirectory: DOCUMENT_DIRECTORY
}));

describe('DownloadModel', () => {
	it('should create a DownloadModel with computed properties', () => {
		const download = new DownloadModel(
			'item-id',
			'server-id',
			'https://example.com/',
			'api-key',
			'title',
			'file name.mkv',
			'https://example.com/download'
		);

		expect(download.apiKey).toBe('api-key');
		expect(download.itemId).toBe('item-id');
		expect(download.sessionId).toBe('uuid-0');
		expect(download.serverId).toBe('server-id');
		expect(download.serverUrl).toBe('https://example.com/');

		expect(download.title).toBe('title');
		expect(download.filename).toBe('file name.mkv');

		expect(download.downloadUrl).toBe('https://example.com/download');

		expect(download.isComplete).toBe(false);
		expect(download.isDownloading).toBe(false);
		expect(download.isNew).toBe(true);

		expect(download.key).toBe('server-id_item-id');
		expect(download.localFilename).toBe('file name.mp4');
		expect(download.localPath).toBe(`${DOCUMENT_DIRECTORY}server-id/item-id/`);
		expect(download.uri).toBe(`${DOCUMENT_DIRECTORY}server-id/item-id/file%20name.mp4`);
		expect(download.getStreamUrl('device-id').toString()).toBe('https://example.com/Videos/item-id/stream.mp4?deviceId=device-id&api_key=api-key&playSessionId=uuid-0&videoCodec=hevc%2Ch264&audioCodec=aac%2Cmp3%2Cac3%2Ceac3%2Cflac%2Calac&maxAudioChannels=6');
	});

	it('should create a DownloadModel from a storage object', () => {
		const value = {
			itemId: 'item-id',
			serverId: 'server-id',
			serverUrl: 'https://example.com/',
			apiKey: 'api-key',
			title: 'title',
			filename: 'file name.mkv',
			downloadUrl: 'https://example.com/download',
			isComplete: true,
			isNew: false
		};
		const download = fromStorageObject(value);

		expect(download).toBeInstanceOf(DownloadModel);
		expect(download.apiKey).toBe(value.apiKey);
		expect(download.itemId).toBe(value.itemId);
		expect(download.serverId).toBe(value.serverId);
		expect(download.serverUrl).toBe(value.serverUrl);
		expect(download.title).toBe(value.title);
		expect(download.filename).toBe(value.filename);
		expect(download.downloadUrl).toBe(value.downloadUrl);
		expect(download.isComplete).toBe(value.isComplete);
		expect(download.isNew).toBe(value.isNew);
	});
});
