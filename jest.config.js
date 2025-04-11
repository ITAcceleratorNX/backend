export default {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/config/",
        "/utils/",
        "/routes/",
        "/helpers/",
        "/models/",
        ".*config.js$"
    ],
    coverageThreshold: {
        global: {
            functions: 70,
            lines: 70,
        },
    },
};
