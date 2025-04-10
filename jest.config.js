export default {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', 'backend/config/'],
    coverageThreshold: {
        global: {
            functions: 70,
            lines: 70,
        },
    },
};
