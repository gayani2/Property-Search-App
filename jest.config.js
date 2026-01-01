module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    testMatch: ['**/tests/**/*.test.(js|jsx)'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};