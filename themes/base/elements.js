/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';
import { colors } from 'react-native-elements';

import Colors from '../../constants/Colors';

export default {
	colors: {
		// Use platform default colors from react-native-elements
		...Platform.select({
			default: colors.platform.android,
			ios: colors.platform.ios
		})
	},
	Badge: {
		badgeStyle: {
			borderWidth: 0
		}
	},
	Input: {
		errorStyle: {
			fontSize: 16
		},
		leftIconContainerStyle: {
			marginRight: 8
		},
		rightIconContainerStyle: {
			marginRight: 15
		}
	},
	ListItemSubtitle: {
		style: {
			color: colors.grey4,
			lineHeight: 21
		}
	},
	Overlay: {
		windowBackgroundColor: 'rgba(0, 0, 0, .85)',
		overlayStyle: {
			backgroundColor: Colors.backgroundColor
		}
	}
};
