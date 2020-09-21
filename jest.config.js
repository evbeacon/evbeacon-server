/* eslint-disable @typescript-eslint/no-var-requires */
const tsPreset = require("ts-jest/jest-preset");
const mongoPreset = require("@shelf/jest-mongodb/jest-preset");

module.exports = {
  setupFiles: ["dotenv/config"],
  collectCoverageFrom: [
    "**/*.ts",
    "!**/node_modules/**",
    "!api/**",
    "!mongodb/index.ts",
    "!mongodb/models/**",
    "!mongodb/schemas/**",
  ],
  ...tsPreset,
  ...mongoPreset,
};
