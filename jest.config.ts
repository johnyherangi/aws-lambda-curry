import { pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.paths.json"

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
export default {
    automock: false,
    clearMocks: true,
    restoreMocks: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["text", "lcov"],
    collectCoverageFrom: ["**/src/**/*.{js,ts}"],
    coveragePathIgnorePatterns: ["handler.ts", "index.ts"],
    maxWorkers: 10,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"],
    transform: {
        ".(ts|tsx)": "ts-jest",
    },
    roots: ["<rootDir>"],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}
