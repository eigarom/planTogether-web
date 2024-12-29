import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const tasksListSchema = Yup.object({
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.required(() => i18n.global.t('nameRequired'))
});

export const taskSchema = Yup.object({
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.required(() => i18n.global.t('nameRequired')),
	description: Yup.string(),
	isChecked: Yup.boolean()
		.required(() => i18n.global.t('isCheckedRequired'))
});