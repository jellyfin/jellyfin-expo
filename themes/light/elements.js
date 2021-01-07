/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import BaseTheme from '../base/elements';
import Colors from '../../constants/Colors';

export default {
	...BaseTheme,
	colors: {
		...BaseTheme.colors,
		background: '#F2F2F2',
		primary: Colors.blue,
		secondary: Colors.purple,
		grey0: '#303030',
		grey1: '#999'
	}
};
