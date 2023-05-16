module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/testUtils/styleMock.js',
  },
  testEnvironment: 'jsdom',
};
