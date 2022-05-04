/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DownloadModel from '../DownloadModel';

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
		expect(download.getStreamUrl('device-id').toString()).toBe('https://example.com/Videos/item-id/stream.mp4?deviceId=device-id&api_key=api-key&videoCodec=hevc%2Ch264&audioCodec=aac%2Cmp3%2Cac3%2Ceac3%2Cflac%2Calac&maxAudioChannels=6');
	});
});
