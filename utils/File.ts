/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as FileSystem from 'expo-file-system';

/**
 * Checks if a path exists, and creates a directory (including missing intermediate directories) if it does not.
 * @param path A uri of a local directory
 */
export async function ensurePathExists(path: string) {
	const info = await FileSystem.getInfoAsync(path);
	if (!info.exists) {
		await FileSystem.makeDirectoryAsync(path, { intermediates: true });
	}
}
