const dotenvFlow = require('dotenv-flow');
const Joi = require('joi');
dotenvFlow.config();

const envVarsSchema = Joi.object()
	.keys({
		ENV: Joi.string().trim().valid('development', 'staging', 'production').required(),
		PORT: Joi.number().default(6000),
		SERVER_URL: Joi.string().default(`http://localhost:6000/api`),
		WHITELIST_IP: Joi.string().description('Allowed IP address, for Docker only'),
		CONNECTION_TIMEOUT: Joi.number()
			.default(30000)
			.description('Connection timeout for an API connection'),
		JWT_SECRET_KEY: Joi.string().required().description('JWT secret key'),
		DB_URL: Joi.string().required().description('MongoDB database URI'),
		AWS_ACCESS_KEY_ID: Joi.string().required().description('AWS access key'),
		AWS_SECRET_ACCESS_KEY: Joi.string().required().description('AWS secret key'),
		AWS_REGION: Joi.string().required().description('AWS region'),
		AWS_BUCKET_NAME: Joi.string().required().description('AWS s3 bucket name'),
		EMAIL_USERNAME: Joi.string().required().description('Email username to send mail'),
		EMAIL_PASSWORD: Joi.string().required().description('Email password to send mail'),
		EMAIL_SENDER_EMAIL: Joi.string().required().description('Email sender email'),
		EMAIL_DISPLAY_NAME: Joi.string().required().description('Email display name'),
		EMAIL_DEV_RECIPIENT: Joi.string()
			.required()
			.description('Dev email to receive mails for testing'),
		KAFKA_BROKER: Joi.string().required().description('Kafka broker'),
		SUPER_ADMIN_USERNAME: Joi.string().required(),
		HOME_ORGANIZATION: Joi.string().hex().required(),
		REDIS_HOST: Joi.string().required(),
		REDIS_PORT: Joi.string().required(),
		SECURE_ENCRYPTION_KEY: Joi.string().required(),
		SECURE_IV: Joi.string().required(),
		V2_DOMAIN_URL: Joi.string().required(),
		V3_DOMAIN_URL: Joi.string().required(),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env);
if (error) throw new Error(`${error.message} in env file`);

module.exports = {
	env: envVars.ENV,
	port: envVars.PORT,
	serverUrl: envVars.SERVER_URL,
	whitelistIP: envVars.WHITELIST_IP,
	connectionTimeout: envVars.CONNECTION_TIMEOUT * 1000,
	secretKeys: {
		jwtKey: envVars.JWT_SECRET_KEY,
		interModuleKey: envVars.INTER_MODULE_SHARED_SECRET_KEY,
	},
	db: {
		url: envVars.DB_URL,
	},
	home: {
		superAdminUsername: envVars.SUPER_ADMIN_USERNAME,
		orgId: envVars.HOME_ORGANIZATION,
	},
	aws: {
		accessKeyId: envVars.AWS_ACCESS_KEY_ID,
		secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
		region: envVars.AWS_REGION,
		bucketName: envVars.AWS_BUCKET_NAME,
	},
	email: {
		username: envVars.EMAIL_USERNAME,
		password: envVars.EMAIL_PASSWORD,
		senderEmail: envVars.EMAIL_SENDER_EMAIL,
		displayName: envVars.EMAIL_DISPLAY_NAME,
		devEmail: envVars.EMAIL_DEV_RECIPIENT,
	},
	kafka: {
		broker: envVars.KAFKA_BROKER,
	},
	redis: {
		host: envVars.REDIS_HOST,
		port: envVars.REDIS_PORT,
	},
	urls: {
		v2Url: envVars.V2_DOMAIN_URL,
		v3Url: envVars.V3_DOMAIN_URL,
	},
	security: {
		secureKey: envVars.SECURE_ENCRYPTION_KEY,
		secureIv: envVars.SECURE_IV,
	},
};
