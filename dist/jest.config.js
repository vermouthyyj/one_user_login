"use strict";
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/controller", "<rootDir>/services", "<rootDir>/repositories"],
    // Other configurations...
    testMatch: ["**/__test__/*.test.ts"],
};
