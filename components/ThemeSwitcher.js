/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'react-native-elements';

import { useStores } from '../hooks/useStores';

/**
 * This component is needed because the replaceTheme function seems to
 * only be available to components that are children of ThemeProvider.
 * It renders an empty node because its only function is to call
 * replaceTheme when the theme value in the store changes.
 */
const ThemeSwitcher = () => {
	const { settingStore } = useStores();
	const { replaceTheme } = useContext(ThemeContext);
	const theme = settingStore.getTheme();

	useEffect(() => {
		console.info('theme changed!');
		replaceTheme(theme.Elements);
	}, [ theme ]);

	return null;
};

export default ThemeSwitcher;
