/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';

export const getIconName = (name = '') => {
	if (name) {
		return name
		// return Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`;
	}
	return name;
};
