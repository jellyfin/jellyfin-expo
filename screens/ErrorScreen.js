/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import ErrorView from '../components/ErrorView';
import Screens from '../constants/Screens';

const ErrorScreen = () => {
	const [ isRefreshing, setIsRefreshing ] = useState(false);
	const { theme } = useContext(ThemeContext);

	const insets = useSafeAreaInsets();

	const navigation = useNavigation();
	const route = useRoute();
	const { icon, heading, message, details, buttonIcon, buttonTitle } = route.params;

	const safeAreaEdges = [ 'right', 'left' ];
	if (Platform.OS !== 'ios') {
		safeAreaEdges.push('top');
	}

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: theme.colors.background
			}}
			edges={safeAreaEdges}
			mode='margin'
		>
			{Platform.OS === 'ios' && (
				<View style={{
					backgroundColor: theme.colors.grey0,
					height: insets.top
				}} />
			)}
			{/* We need to wrap the ErrorView in a ScrollView to enable the same pull to */}
			{/* refresh behavior as the WebView since network errors render _inside_ the WebView */}
			<ScrollView
				style={{
					...StyleSheet.absoluteFill,
					top: Platform.OS === 'ios' ? insets.top : 0
				}}
				contentContainerStyle={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => {
							setIsRefreshing(true);
							navigation.replace(Screens.HomeScreen);
							setIsRefreshing(false);
						}}
						enabled={true}
						// iOS colors
						tintColor={theme.colors.grey1}
						backgroundColor={theme.colors.grey0}
						// Android colors
						colors={[ theme.colors.primary, theme.colors.secondary ]}
						progressBackgroundColor={theme.colors.background}
					/>
				}
			>
				<ErrorView
					icon={icon}
					heading={heading}
					message={message}
					details={details}
					buttonIcon={buttonIcon}
					buttonTitle={buttonTitle}
					onPress={() => navigation.replace(Screens.HomeScreen)}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default ErrorScreen;
