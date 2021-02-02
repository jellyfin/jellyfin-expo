/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync';

export default class MediaStore {
	type
	isActive = false
	uri
	posterUri

	reset() {
		this.type = null;
		this.isActive = false;
		this.uri = null;
		this.posterUri = null;
	}
}

decorate(MediaStore, {
	type: [ ignore, observable ],
	isActive: [ ignore, observable ],
	uri: [ ignore, observable ],
	posterUri: [ ignore, observable ],
	reset: action
});
