const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');
const { s3 } = require('../clients/awsClient');
const JmrReadingServices = require('../modules/logiq/joint-meter-reading/jmr-reading/jmr-reading.service');
const AwsUtils = require('../utils/awsUtils');
const path = require('path');

const validFields = [
	{ name: 'attachment', maxCount: 1 },
	{ name: 'fileData', maxCount: 1 },
];

const pdfFilter = (req, file, cb) => {
	if (req.params.jmrId) return cb(null, true);

	const fileExt = path.extname(file.originalname).toLowerCase();
	if (file.mimetype === 'application/pdf' && fileExt === '.pdf') {
		cb(null, true);
	} else {
		cb(new Error('Only PDF files are allowed!'), false);
	}
};

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.aws.bucketName,
		key: async (req, file, cb) => {
			const timestamp = Date.now();
			// remove whitespace and special characters from file name:
			const sanitizedFileName = file.originalname
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replaceAll(/[^a-z0-9.\-_]/g, '');
			const fileName = `${timestamp}-${sanitizedFileName}`;
			let directoryPath = `staging/storage/tickets/${req.params.ticketId}/${req.body.category === 'activities' ? 'activities' : 'action'
				}/${file.fieldname}`;

			const key = directoryPath + '/' + fileName;
			cb(null, key);
		},
	}),
	limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
	fileFilter: pdfFilter,
}).fields(validFields);

module.exports = upload;
