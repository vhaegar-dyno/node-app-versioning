const config = require('@config/config');
const ApiError = require('@middlewares/apiError');
const { s3 } = require('../clients/awsClient');
const { GetObjectCommand, ListObjectsV2Command, CopyObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('@logger');
const path = require('path');

class AwsUtils {
	constructor(s3Client = s3) {
		this.s3 = s3Client;
		this.bucket = config.aws.bucketName;
	}

	_normalizePath(filePath, fileName, absolutePath) {
		let finalKey = '';

		// 1. check if absolute path provided and it correct:
		if (absolutePath) {
			if (path.extname(absolutePath)) finalKey = absolutePath;
			else finalKey = path.join(absolutePath, fileName || '');
		} else if (filePath) {
			// 2: if filePath is provided
			if (path.extname(filePath)) finalKey = filePath;
			else finalKey = path.join(filePath, fileName || '');
		} else {
			throw ApiError.badRequest('Missing complete file path');
		}

		// remove leading "./" or "/" and normalize to forward slashes
		finalKey = finalKey
			.replace(/^(\.\/|\/)+/, '')
			.replace(/\\/g, '/')
			.replace(/\/+$/, '');
		return finalKey;
	}

	async getFileFromS3(filePath, fileName, absolutePath) {
		try {
			const key = this._normalizePath(filePath, fileName, absolutePath);
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: key,
				// Key: absolutePath
				// 	? absolutePath.replace('./', '')
				// 	: filePath.replace('./', '') + '/' + fileName.replace('/', ''),
			});
			const response = await this.s3.send(command);
			return response.Body;
		} catch (err) {
			throw ApiError.internal(err);
		}
	}

	async listAllFilesInDirectory(directoryPath) {
		try {
			// remove '/' from path, if path starts with '/', considering v2.0 path
			directoryPath = directoryPath.replace(/^\/+|\/+$/g, '');
			const command = new ListObjectsV2Command({
				Bucket: this.bucket,
				Prefix: directoryPath + '/',
			});

			const listedObjects = await this.s3.send(command);
			if (!listedObjects.Contents || listedObjects.Contents.length === 0)
				throw ApiError.badRequest('No files found in the category');

			const files = [];
			for (const fileKey of listedObjects.Contents) {
				const fileName = fileKey.Key.split('/').pop();
				const file = await this.getFileFromS3(directoryPath, fileName);
				files.push({ fileName, fileContent: file });
			}

			return files;
		} catch (err) {
			if (err.message === 'No files found in the category') {
				throw ApiError.notFound(err.message);
			}
			throw ApiError.internal(err);
		}
	}

	async copyStagingFilesToProcessed(files) {
		try {
			for (const key in files) {
				for (const file of files[key]) {
					const targetPath = file.key.replace('staging/', '');
					const putCommand = new CopyObjectCommand({
						Bucket: this.bucket,
						CopySource: `${this.bucket}/${file.key}`,
						Key: targetPath,
					});
					await this.s3.send(putCommand);
				}
			}
			return true;
		} catch (err) {
			logger.error(`Failed to move file from staging to processed: ${err.message}`);
		}
	}

	async copyProcessedFilesToStaging(key) {
		try {
			const targetPath = `staging/${key}`;
			const putCommand = new CopyObjectCommand({
				Bucket: this.bucket,
				CopySource: `${this.bucket}/${key}`,
				Key: targetPath,
			});
			await this.s3.send(putCommand);
			return true;
		} catch (err) {
			logger.error(`Failed to copy file from S3: ${err.message}`);
		}
	}

	async listDirectories(prefix) {
		// remove '/' from prefix, if path ends with '/', considering v2.0 path
		const path = prefix ? prefix.replace(/\/$/, '') : '';
		const command = new ListObjectsV2Command({
			Bucket: this.bucket,
			Prefix: path + '/',
			Delimiter: '/',
		});

		const response = await this.s3.send(command);
		return response;
	}
}

module.exports = new AwsUtils();
