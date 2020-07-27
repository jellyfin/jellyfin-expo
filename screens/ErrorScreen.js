/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useState } from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

import ErrorView from '../components/ErrorView';
import Colors from '../constants/Colors';

const ErrorScreen = () =>{
	const [isRefreshing, setIsRefreshing] = useState(false);

	const navigation = useNavigation();
	const route = useRoute();
	const { icon, heading, message, details, buttonIcon, buttonTitle } = route.params;

	const safeAreaEdges = ['right', 'bottom', 'left'];
	if (Platform.OS !== 'ios') {
		safeAreaEdges.push('top');
	}

	return (
		<SafeAreaView style={styles.container} edges={safeAreaEdges} >
			{Platform.OS === 'ios' && (
				<View style={styles.statusBarSpacer} />
			)}
			{/* We need to wrap the ErrorView in a ScrollView to enable the same pull to */}
			{/* refresh behavior as the WebView since network errors render _inside_ the WebView */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => {
							setIsRefreshing(true);
							navigation.replace('HomeScreen');
							setIsRefreshing(false);
						}}
						enabled={true}
						// iOS colors
						tintColor={Colors.tabText}
						backgroundColor={Colors.headerBackgroundColor}
						// Android colors
						colors={[Colors.primaryBlue, Colors.primaryPurple]}
						progressBackgroundColor={Colors.backgroundColor}
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
					onPress={() => navigation.replace('HomeScreen')}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	scrollView: {
		...StyleSheet.absoluteFill,
		top: Platform.OS === 'ios' ? Constants.statusBarHeight : 0
	},
	statusBarSpacer: {
		backgroundColor: Colors.headerBackgroundColor,
		height: Constants.statusBarHeight
	}
});

export default ErrorScreen;
