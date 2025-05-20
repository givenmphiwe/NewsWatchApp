const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add .cjs support
defaultConfig.resolver.sourceExts.push('cjs');

// Disable unstable package exports
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
