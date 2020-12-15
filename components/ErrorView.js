/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import Colors from '../constants/Colors';
import { getIconName } from '../utils/Icons';

const ErrorView = ({
	icon = { name: getIconName('alert'), type: 'ionicon' },
	heading,
	message,
	details = [],
	buttonIcon,
	buttonTitle,
	onPress
}) => {
	const window = useWindowDimensions();
	const isCompact = window.height < 480;
	const marginVertical = isCompact ? 20 : 40;

	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<Icon
					name={icon.name}
					type={icon.type}
					size={isCompact ? 60 : 100}
				/>
				<Text h2 style={{ ...styles.heading, marginVertical }}>{heading}</Text>
				<Text style={{ ...styles.message, marginBottom: marginVertical }}>{message}</Text>
			</View>
			<View>
				{details.map((detailText, index) => (
					<Text key={`errorview-details-${index}`} style={styles.details}>{detailText}</Text>
				))}
			</View>
			{buttonTitle && (
				<Button
					containerStyle={styles.footer}
					icon={buttonIcon}
					title={buttonTitle}
					onPress={onPress}
				/>
			)}
		</View>
	);
};

ErrorView.propTypes = {
	icon: PropTypes.shape({
		name: PropTypes.string,
		type: PropTypes.string
	}),
	heading: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	details: PropTypes.arrayOf(PropTypes.string),
	buttonIcon: PropTypes.shape({
		name: PropTypes.string,
		type: PropTypes.string
	}),
	buttonTitle: PropTypes.string,
	onPress: PropTypes.func
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFill,
		flex: 1,
		paddingHorizontal: 15,
		backgroundColor: Colors.backgroundColor
	},
	body: {
		flexGrow: 1,
		justifyContent: 'center'
	},
	footer: {
		marginVertical: 17
	},
	heading: {
		textAlign: 'center'
	},
	message: {
		textAlign: 'center',
		fontSize: 17,
		marginHorizontal: 20
	},
	details: {
		fontSize: 15
	}
});

export default ErrorView;
