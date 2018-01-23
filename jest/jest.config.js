module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testPathIgnorePatterns: ['node_modules', '/source/types/', '/source/constants/'],
  coveragePathIgnorePatterns: ['node_modules', '/source/types/', '/source/constants/', '/jest/'],
  setupTestFrameworkScriptFile: './jest/setup.js',
  rootDir: '../',
};
