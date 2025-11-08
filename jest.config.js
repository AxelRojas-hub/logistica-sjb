module.exports = { //configuracionn d jest que tiene next para el testing
  preset: 'ts-jest',

  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(test).ts'],
};