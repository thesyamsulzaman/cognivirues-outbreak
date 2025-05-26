/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  clearMocks: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/mock.ts'],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
}; 