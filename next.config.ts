const repositoryName = 'byu-is-career-compass';
const assetPrefix = process.env.NODE_ENV === 'production' ? `/${repositoryName}` : '';

const nextConfig = {
  output: 'export',
  assetPrefix,
};

export default nextConfig;
