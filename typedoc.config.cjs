/* eslint-env node */
/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ["./src/index.ts"],
  out: "docs",
  plugin: ["@mxssfd/typedoc-theme"],
  theme: "my-theme",
  cleanOutputDir: true,
};
