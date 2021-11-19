/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const DevSettingsScreen = observer(() => {
	const { theme } = useContext(ThemeContext);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={[ 'right', 'left' ]}
		>
			<Text>
				This is a place where development features can be enabled.
			</Text>
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default DevSettingsScreen;
