/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const Screens = {
	App: 'App',
	MainScreen: 'Main',
	// Add server screens
	AddServerScreen: 'AddServer',
	ServerHelpScreen: 'ServerHelpScreen',
	// Home screens
	HomeTab: 'Home',
	HomeScreen: 'HomeScreen',
	ErrorScreen: 'ErrorScreen',
	// Downloads screens
	DownloadsTab: 'Downloads',
	// Settings screens
	SettingsTab: 'Settings',
	SettingsScreen: 'SettingsScreen',
	DevSettingsScreen: 'DevSettingsScreen'
} as const;

export type Screens = typeof Screens[keyof typeof Screens];

/** @deprecated Use the named import instead. */
export default Screens;
