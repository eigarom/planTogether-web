import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const eventSchema = Yup.object({
    name: Yup.string()
        .max(50, () => i18n.global.t('nameMax'))
        .matches(/^[a-zA-Z0-9- \u00C0-\u00FF]+$/, {
            message: () => i18n.global.t('nameInvalid')
        })
        .required(() => i18n.global.t('nameRequired')),
    isVisible: Yup.boolean()
        .required(() => i18n.global.t('visibilityRequired')),
    startDate: Yup.date()
        .typeError(() => i18n.global.t('dateInvalid'))
        .required(() => i18n.global.t('dateRequired')),
    endDate: Yup.date()
        .typeError(() => i18n.global.t('dateInvalid'))
        .required(() => i18n.global.t('dateRequired')),
    startTime: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { //L'heure doit être selon le format HH:mm
            message: () => i18n.global.t('timeFormatInvalid')
        })
        .required(() => i18n.global.t('timeRequired')),
    endTime: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { //L'heure doit être selon le format HH:mm
            message: () => i18n.global.t('timeFormatInvalid')
        })
        .required(() => i18n.global.t('timeRequired')),
});