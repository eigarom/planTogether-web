import * as Yup from 'yup';
import i18n from "../locales/i18n";

export const eventSchema = Yup.object({
    name: Yup.string()
        .max(50, () => i18n.global.t('nameMax'))
        .required(() => i18n.global.t('nameRequired')),
    description: Yup.string()
        .max(500, () => i18n.global.t('descriptionMax')),
	startEvent: Yup.date()
        .required("Date début manquante"),
	endEvent: Yup.date()
        .required("Date de fin manquante"),
    numberRepeats: Yup.number()
        .min(0, "Le minimum de répétition est de 0.")
        .max(365, "Le maximum de répétitions est de 365.")
        .transform((value, originalValue) =>
            originalValue === "" ? 0 : value
        )
        .default(0),
    selectedParticipants: Yup.array()
        .min(1, "Minimum un participant doit être sélectionné")
});

export const eventOnlySchema = Yup.object({
    name: Yup.string()
        .max(50, () => i18n.global.t('nameMax'))
        .required(() => i18n.global.t('nameRequired')),
    description: Yup.string()
        .max(500, () => i18n.global.t('descriptionMax')),
    selectedParticipants: Yup.array()
        .min(1, "Minimum un participant doit être sélectionné")
});

export const eventPeriodSchema = Yup.object({
	startEvent: Yup.date()
        .required("Date début manquante"),
	endEvent: Yup.date()
        .required("Date de fin manquante"),
});