/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';

class Loader {
	NativeShell = ''

	async load() {
		const [{ localUri }] = await Asset.loadAsync(require('../assets/js/NativeShell.staticjs'));
		this.NativeShell = await readAsStringAsync(localUri);
		return this.NativeShell;
	}
}

const NativeShellLoader = new Loader();

export default NativeShellLoader;
