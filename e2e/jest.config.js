module.exports = {
  rootDir: "..",
  testMatch: ["<rootDir>/e2e/**/*.e2e.ts"],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  reporters: ["detox/runners/jest/reporter"],
  testEnvironment: "detox/runners/jest/testEnvironment",
  setupFilesAfterEnv: ["<rootDir>/e2e/init.ts"],
  verbose: true,
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { presets: ["babel-preset-expo"] }],
  },
};
