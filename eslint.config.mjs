import globals from 'globals';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

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
			'no-console': ['error', { allow: ['warn', 'error'] }], // Todo: remove warn and error too
			'no-unused-vars': 'error',
		},
	},
];
