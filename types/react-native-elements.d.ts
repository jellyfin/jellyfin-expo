/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Extensions to the default react-native-elements types to allow for
 * custom properties in themes.
 * Refs: https://reactnativeelements.com/docs/3.4.2/customization#typescript-definitions-extending-the-default-theme
 */
import 'react-native-elements';
type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module 'react-native-elements' {
	export interface Colors {
		background: string;
	}

	export interface FullTheme {
		colors: RecursivePartial<Colors>;
	}
}
