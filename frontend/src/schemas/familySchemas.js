import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const familySchema = Yup.object({
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.matches(/^[a-zA-Z0-9- \u00C0-\u00FF]+$/, {
			message: () => i18n.global.t('nameInvalid')
		})
		.required(() => i18n.global.t('nameRequired')),
	color: Yup.string()
		.matches(/^#[0-9A-F]{6}$/, {
			message: () => i18n.global.t('colorInvalid')
		})
		.required(() => i18n.global.t('colorRequired'))
});