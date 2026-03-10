import globals from 'globals';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';

export default [
	eslint.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node,
			parserOptions: {
				project: true,
			},
		},
		files: ['**/*.js'],
		rules: {
			quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'no-unused-vars': 'error',
		},
	},
	{
		plugins: { jest: pluginJest },
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				'jest/globals': true,
			},
			parserOptions: {
				project: true,
			},
		},
		files: ['**/*.e2e.spec.js'],
		rules: {
			'no-undef': 'off',
		},
	},
];
