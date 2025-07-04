/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import dotenv from "dotenv";

import nextJest from "next/jest";

dotenv.config({
  quiet: true,
  path: [".env", "../.env"],
});

const createJestConfig = nextJest({ dir: "." });

const config = createJestConfig({
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  moduleDirectories: ["node_modules", "<rootDir>"],
});

export default config;
