const archiver = require('archiver');
const { createZipSchema } = require('../validation/zip.dto');
const ApiError = require('../middleware/apiError');
const JoiValidationPipe = require('../middleware/joiValidation');

const createZip = async (files, res, filename) => {
	try {
		const isValidFiles = JoiValidationPipe.validate(createZipSchema, files);
		if (!isValidFiles) return;

		res.attachment(filename || 'attachments.zip');
		const archive = archiver('zip', { zlib: { level: 9 } });
		archive.pipe(res);

		files.map((file) => archive.append(file.fileContent, { name: file.fileName }));
		await archive.finalize();
		return archive;
	} catch (err) {
		throw ApiError.internal(err || { message: 'Failed to create zip file' });
	}
};

module.exports = { createZip };
