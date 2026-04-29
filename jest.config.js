module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    testMatch: [
        '**/src/__tests__/**/*.test.{js,ts,jsx,tsx}',
        '**/src/__tests__/**/*.spec.{js,ts,jsx,tsx}',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.{js,ts,jsx,tsx}',
        '!src/tests/**',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};
