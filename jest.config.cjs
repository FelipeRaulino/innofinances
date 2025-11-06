module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/app"],
  clearMocks: true,
  resetModules: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
