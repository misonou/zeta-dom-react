const config = {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
        "@misonou/test-utils/mock/matchMedia",
        "@misonou/test-utils/mock/scrollBy",
        "@misonou/test-utils/mock/console"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/build/"
    ],
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/src/$1"
    },
    "extensionsToTreatAsEsm": [
        ".jsx"
    ],
    "clearMocks": true,
    "collectCoverageFrom": [
        "src/**/*.js",
        "!src/{index,entry}.js",
        "!src/include/**/*"
    ]
}

if (process.env.CI !== 'true' && require('fs').existsSync('../zeta-dom')) {
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "^zeta-dom/(.*)$": "<rootDir>/../zeta-dom/src/$1"
    };
}
if (process.env.REACT_VERSION) {
    const runtimeDir = `<rootDir>/tests/runtime/react${process.env.REACT_VERSION}`;
    config.cacheDirectory = `${runtimeDir}/.cache`;
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "^react$": `${runtimeDir}/node_modules/react`,
        "^react-dom$": `${runtimeDir}/node_modules/react-dom`
    };
    config.moduleDirectories = [
        `${runtimeDir}/node_modules`,
        "node_modules"
    ];
}
if (process.env.REACT_VERSION === '18') {
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "@testing-library/react-hooks": "@misonou/test-utils/polyfill/react18/renderHook"
    };
}

module.exports = config;
