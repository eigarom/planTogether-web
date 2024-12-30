import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const shoppingListSchema = Yup.object({
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.required(() => i18n.global.t('nameRequired'))
});

export const shoppingItemSchema = Yup.object({
	name: Yup.string()
		.max(50, () => i18n.global.t('nameMax'))
		.required(() => i18n.global.t('nameRequired')),
	isChecked: Yup.boolean()
		.required(() => i18n.global.t('isCheckedRequired'))
});