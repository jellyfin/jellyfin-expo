/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Platform } from 'react-native';
import { colors } from 'react-native-elements';

import Colors from '../constants/Colors';

export default {
    colors: {
        primary: Colors.tintColor
    },
    Badge: {
        badgeStyle: {
            borderWidth: 0
        }
    },
    Icon: {
        iconStyle: {
            color: Colors.textColor
        }
    },
    Input: {
        inputStyle: {
            color: Colors.textColor
        },
        errorStyle: {
            color: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error,
            fontSize: 16
        },
        leftIconContainerStyle: {
            marginRight: 8
        },
        rightIconContainerStyle: {
            marginRight: 15
        }
    },
    ListItem: {
        containerStyle: {
            backgroundColor: Colors.backgroundColor
        },
        subtitleStyle: {
            color: colors.grey4,
            lineHeight: 21
        },
        rightSubtitleStyle: {
            color: colors.grey4
        }
    },
    Overlay: {
        windowBackgroundColor: 'rgba(0, 0, 0, .85)',
        overlayStyle: {
            backgroundColor: Colors.backgroundColor
        }
    },
    Text: {
        style: {
            color: Colors.textColor
        }
    }
};
