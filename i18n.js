import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './langs/en.json';
import ar from './langs/ar.json';
import cs from './langs/cs.json';
import da from './langs/da.json';
import de from './langs/de.json';
import es from './langs/es.json';
import es_AR from './langs/es_AR.json';
import fr from './langs/fr.json';
import it from './langs/it.json';
import nb_NO from './langs/nb_NO.json';
import sk from './langs/sk.json';
import sl from './langs/sl.json';
import sv from './langs/sv.json';
import zh_Hans from './langs/zh_Hans.json';
import zh_Hant from './langs/zh_Hant.json';

const resources = {
	en: { translation: en },
	ar: { translation: ar },
	cs: { translation: cs },
	da: { translation: da },
	de: { translation: de },
	es: { translation: es },
	'es-AR': { translation: es_AR },
	fr: { translation: fr },
	it: { translation: it },
	'nb-NO': { translation: nb_NO },
	sk: { translation: sk },
	sl: { translation: sl },
	sv: { translation: sv },
	'zh-Hans': { translation: zh_Hans },
	'zh-Hant': { translation: zh_Hant }
};

i18next
	.use(initReactI18next)
	.init({
		// debug: true,
		fallbackLng: 'en',
		lng: Localization.locale,
		interpolation: {
			escapeValue: false
		},
		resources
	});
