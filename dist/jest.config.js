"use strict";
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/controller"],
    // Other configurations...
    testMatch: ["**/__test__/*.test.ts"],
};
