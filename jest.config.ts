/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/config/tests/setup.ts'],
  coveragePathIgnorePatterns: [
    'src/config/sql/migrations',
    'src/config/sql/util',
    'src/config/tests',
    'src/entrypoints'
  ],
  testMatch: ['./**/*.test.ts']
};
