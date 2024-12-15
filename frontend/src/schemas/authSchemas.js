import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const registrationSchema = Yup.object({
	email: Yup.string()
		.email(() => i18n.global.t('invalidMail'))
		.required(() => i18n.global.t('emailRequired')),
	password: Yup.string()
		.max(50, () => i18n.global.t('passwordMax'))
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{16,}$/, {
			message: () => i18n.global.t('passwordInvalid'),
		})
		.required(() => i18n.global.t('passwordRequired')),
	repeat_password: Yup.string()
		.oneOf([Yup.ref('password'), null], () => i18n.global.t('passwordsDoNotMatch'))
		.required(() => i18n.global.t('passwordConfirmationRequired')),
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.matches(/^[a-zA-Z0-9- \u00C0-\u00FF]+$/, {
			message: () => i18n.global.t('nameInvalid'),
		})
		.required(() => i18n.global.t('nameRequired')),
});

export const loginSchema = Yup.object({
	email: Yup.string()
		.email(() => i18n.global.t('invalidMail'))
		.required(() => i18n.global.t('emailRequired')),
	password: Yup.string().required(() => i18n.global.t('passwordRequired')),
});