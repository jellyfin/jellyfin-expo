/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

const RefreshWebView = React.forwardRef(
	function RefreshWebView({ isRefreshing, onRefresh, refreshControlProps, ...webViewProps }, ref) {
		const [ height, setHeight ] = useState(Dimensions.get('screen').height);
		const [ isEnabled, setEnabled ] = useState(typeof onRefresh === 'function');

		return (
			<ScrollView
				onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
				refreshControl={
					<RefreshControl
						onRefresh={onRefresh}
						refreshing={isRefreshing}
						enabled={isEnabled}
						{...refreshControlProps}
					/>
				}
				style={styles.view}>
				<WebView
					ref={ref}
					{...webViewProps}
					onScroll={(e) =>
						setEnabled(
							typeof onRefresh === 'function' &&
							e.nativeEvent.contentOffset.y === 0
						)
					}
					style={{
						...styles.view,
						height,
						...webViewProps.style
					}}
				/>
			</ScrollView>
		);
	}
);

RefreshWebView.propTypes = {
	isRefreshing: PropTypes.bool.isRequired,
	onRefresh: PropTypes.func,
	refreshControlProps: PropTypes.any
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		height: '100%'
	}
});

export default RefreshWebView;
