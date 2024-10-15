module.exports = {
	extends: [
		'eslint:recommended',
		'@electron-toolkit/eslint-config-ts/recommended'
	],
	"rules": {
		"prefer-const": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
