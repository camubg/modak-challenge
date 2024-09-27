const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../.',
  testEnvironment: 'node',
  testTimeout: 30000,
  testRegex: '.*spec.ts$',
  coveragePathIgnorePatterns: [
    '.module.ts',
    '.repositories.ts',
    '.controller.ts',
  ],
  collectCoverageFrom: ['**/*.ts', '!**/libs/**'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  modulePathIgnorePatterns: ['<rootDir>/test-e2e/', '<rootDir>/dist/'],
};

module.exports = config;
