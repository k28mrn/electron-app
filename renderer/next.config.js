/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	output: 'export',
	sassOptions: {
		includePaths: [
			path.join(__dirname, 'styles/foundation'),
		],
	},
};

module.exports = nextConfig;
