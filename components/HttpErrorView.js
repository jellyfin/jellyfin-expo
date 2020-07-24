/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ErrorView from './ErrorView';
import { getIconName } from '../utils/Icons';

const HttpErrorView = ({ errorCode, url, onRetry }) => {
	const { t } = useTranslation();

	return (
		<ErrorView
			icon={{
				name: 'cloud-off',
				type: 'material'
			}}
			heading={t([`home.errors.${errorCode}.heading`, 'home.errors.http.heading'])}
			message={t([`home.errors.${errorCode}.description`, 'home.errors.http.description'])}
			details={[
				t('home.errorCode', { errorCode }),
				t('home.errorUrl', { url })
			]}
			buttonIcon={{
				name: getIconName('refresh'),
				type: 'ionicon'
			}}
			buttonTitle={t('home.retry')}
			onPress={onRetry}
		/>
	);
};

HttpErrorView.propTypes = {
	onRetry: PropTypes.func.isRequired,
	errorCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	url: PropTypes.string
};

export default HttpErrorView;
