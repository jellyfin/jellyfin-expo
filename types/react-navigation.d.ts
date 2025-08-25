/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { AppStackParams } from '../navigation/AppNavigator';
import type { HomeStackParams } from '../navigation/HomeNavigator';
import type { RootNavigatorParams } from '../navigation/RootNavigator';
import type { SettingsStackParams } from '../navigation/SettingsNavigator';
import type { TabNavigatorParams } from '../navigation/TabNavigator';

declare global {
	namespace ReactNavigation {
		interface RootParamList extends
			RootNavigatorParams,
			AppStackParams,
			HomeStackParams,
			SettingsStackParams,
			TabNavigatorParams { }
	}
}
