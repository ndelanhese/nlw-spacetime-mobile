const path = require("path");

const handleBuildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`;

module.exports = {
  "*.{js,ts,tsx,jsx}": [
    "prettier --write",
    "eslint --fix",
    handleBuildEslintCommand,
  ],
};
