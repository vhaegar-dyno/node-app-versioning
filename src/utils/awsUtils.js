const config = require('../config/config');
const ApiError = require('../middleware/apiError');
const { s3 } = require('../clients/awsClient');
const { GetObjectCommand, ListObjectsV2Command, CopyObjectCommand } = require('@aws-sdk/client-s3');

class AwsUtils {
	constructor(s3Client = s3) {
		this.s3 = s3Client;
		this.bucket = config.aws.bucketName;
	}

	async getFileFromS3(filePath, fileName, absolutePath) {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: absolutePath ? absolutePath : filePath + '/' + fileName,
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
			throw new Error('Failed to move file from staging to processed', err);
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
			throw new Error('Failed to copy file from S3', err);
		}
	}
}

module.exports = new AwsUtils();
