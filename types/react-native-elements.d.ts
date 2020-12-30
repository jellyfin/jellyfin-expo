/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/**
 * Extensions to the default react-native-elements types to allow for
 * custom properties in themes.
 */
type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module 'react-native-elements' {
	export interface Colors {
		background: string;
	}

	export interface FullTheme {
		colors: RecursivePartial<Colors>;
	}
}
