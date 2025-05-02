const scopes = [
	{ name: 'application' },
	{ name: 'authentication' },
	{ name: 'core' },
	{ name: 'devices' },
	{ name: 'logiq' },
	{ name: 'other' },
];

const types = [
	{ value: ':sparkles: feat', name: '✨ feat:\tAdding a new feature' },
	{ value: ':big: fix', name: '✨ fix:\tFixing a bug' },
	{ value: ':memo: docs', name: '📝 docs:\tAdd or update documentation' },
	{
		value: ':truck: chore',
		name: '🚚 chore:\tChanges to the build process or auxiliary tools\n\t\tand libraries such as documentation generation',
	},
	{ value: ':lipstick: style', name: '💄 style:\tAdd or update styles, ui or ux' },
	{
		value: ':recycle: refactor',
		name: '♻️  refactor:\tCode change that neither fixes a bug nor adds a feature',
	},
	{ value: ':zap: perf', name: '⚡️ perf:\tCode change that improves performance' },
	{
		value: ':green_heart: ci',
		name: '💚 ci:\tAdd or update regards to build process',
	},
	{ value: ':white_check_mark: test', name: '✅ test:\tAdding tests cases' },
	{ value: ':rewind: revert', name: '⏪️ revert:\tRevert to a commit' },
	{ value: ':construction: wip', name: '🚧 wip:\tWork in progress' },
	{
		value: ':construction_worker: build',
		name: '👷 build:\tAdd or update regards to build process',
	},
];

const scopeOverrides = {
	':bug: fix': [
		...scopes,
		{ name: 'merge' },
		{ name: 'style' },
		{ name: 'test' },
		{ name: 'hotfix' },
	],
};

module.exports = {
	types,
	scopes,
	scopeOverrides,
	allowCustomScopes: true,
	allowBreakingChanges: [':sparkles: feat', ':bug: fix'],
	skipQuestions: [],
	subjectLimit: 100,
};
