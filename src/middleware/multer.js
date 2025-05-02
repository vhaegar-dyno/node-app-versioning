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

	{ name: 'cleaning/before/PVModules', maxCount: 50 },
	{ name: 'cleaning/before/irradianceSensors', maxCount: 50 },
	{ name: 'cleaning/before/sprinklerTanks', maxCount: 50 },
	{ name: 'cleaning/before/workPermits', maxCount: 50 },
	{ name: 'cleaning/before/TBT', maxCount: 50 },
	{ name: 'cleaning/after/PVModules', maxCount: 50 },
	{ name: 'cleaning/after/irradianceSensors', maxCount: 50 },
	{ name: 'cleaning/after/sprinklerTanks', maxCount: 50 },
	{ name: 'cleaning/after/workPermits', maxCount: 50 },
	{ name: 'cleaning/after/TBT', maxCount: 50 },

	{ name: 'pm/before/equipment', maxCount: 50 },
	{ name: 'pm/after/equipment', maxCount: 50 },
	{ name: 'pm/rca', maxCount: 50 },

	{ name: 'safety/equipment/fireExtinguisher', maxCount: 50 },
	{ name: 'safety/equipment/anchorageLine', maxCount: 50 },
	{ name: 'safety/equipment/sendBucket', maxCount: 50 },
	{ name: 'safety/equipment/rubberMat', maxCount: 50 },
	{ name: 'safety/equipment/PPEs', maxCount: 50 },
	{ name: 'safety/equipment/firstAIDBox', maxCount: 50 },
	{ name: 'safety/equipment/safetyHarness', maxCount: 50 },
	{ name: 'safety/equipment/ladder', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/fireExtinguisher', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/sendBucket', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/rubberMat', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/anchorageLine', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/PPEs', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/firstAIDBox', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/safetyHarness', maxCount: 50 },
	{ name: 'safety/equipmentChecklist/ladder', maxCount: 50 },

	{ name: 'breakdown/before/equipment', maxCount: 50 },
	{ name: 'breakdown/after/equipment', maxCount: 50 },
	{ name: 'breakdown/rca', maxCount: 50 },

	{ name: 'underPerformance/before/equipment', maxCount: 50 },
	{ name: 'underPerformance/after/equipment', maxCount: 50 },
	{ name: 'underPerformance/rca', maxCount: 50 },

	{ name: 'correctiveMaintenance/before/equipment', maxCount: 50 },
	{ name: 'correctiveMaintenance/after/equipment', maxCount: 50 },
	{ name: 'correctiveMaintenance/rca', maxCount: 50 },

	{ name: 'communication/before/equipment', maxCount: 50 },
	{ name: 'communication/after/equipment', maxCount: 50 },
	{ name: 'communication/rca', maxCount: 50 },

	{ name: 'other/before/equipment', maxCount: 50 },
	{ name: 'other/after/equipment', maxCount: 50 },
	{ name: 'other/rca', maxCount: 50 },
];

const removeExistingJmrAttachment = async (jmrCode) => {
	const jmr = await JmrReadingServices.findByJmrCode(jmrCode);
	if (!jmr.attachment?.fileName) return false;

	// move attachment to staging:
	const key = `storage/jmr/${jmrCode}/upload/${jmr.attachment?.fileName}`;
	await AwsUtils.copyProcessedFilesToStaging(key);
};

const pdfFilter = (req, file, cb) => {
	if (req.params.jmrId) return cb(null, true);

	const fileExt = path.extname(file.originalname).toLowerCase();
	if (file.mimetype === 'application/pdf' && fileExt === '.pdf') {
		cb(null, true);
	} else {
		cb(new Error('Only PDF files are allowed!'), false);
	}
};

// Todo: created for action now, will handle for activities/jmrs later
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
			let directoryPath = `staging/storage/tickets/${req.params.ticketId}/${
				req.body.category === 'activities' ? 'activities' : 'action'
			}/${file.fieldname}`;

			// for JMR Attachments only:
			if (req.params.jmrId) {
				await removeExistingJmrAttachment(req.params.jmrId);
				if (req.file.fieldname !== 'fileData')
					directoryPath = `staging/storage/jmr/${req.query.jmrId}/upload`;
				else directoryPath = `staging/storage/jmr/chat/${req.params.jmrId}`;
			}
			const key = directoryPath + '/' + fileName;
			cb(null, key);
		},
	}),
	limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
	fileFilter: pdfFilter,
}).fields(validFields);

module.exports = upload;
