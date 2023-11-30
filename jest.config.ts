module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: [
    "<rootDir>/controller/__test__",
    "<rootDir>/services/__test__",
    "<rootDir>/repositories/__test__",
  ],
  testMatch: ["**/*.test.ts"],
}
