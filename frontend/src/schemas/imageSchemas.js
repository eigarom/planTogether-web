import * as Yup from 'yup';
import i18n from "../locales/i18n";

const MAX_FILE_SIZE = 5000000; // Environ 5 Mo

const validFileExtensions = {image: ['jpg', 'png', 'jpeg', 'svg', 'webp']};

function isValidFileType(fileName, fileType) {
	return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

export const imageSchema = Yup.object().shape({
	image: Yup
		.mixed()
		.required(() => i18n.global.t('fileRequired'))
		.test("is-valid-type", () => i18n.global.t('fileTypeInvalid'),
			value => isValidFileType(value && value.name.toLowerCase(), "image"))
		.test("is-valid-size", () => i18n.global.t('fileSizeInvalid'),
			value => value && value.size <= MAX_FILE_SIZE)
});