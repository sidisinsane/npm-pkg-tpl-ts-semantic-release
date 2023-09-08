# Bootstrap

Note: Execute from terminal, not within VSCode.

```bash
nvm use && \
pnpm add -D typescript tsup prettier jest ts-jest @types/jest typedoc @mxssfd/typedoc-theme semantic-release @semantic-release/changelog @semantic-release/git commitizen cz-conventional-changelog && \
commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact && \
pnpm exec sort-package-json
```

## Basics

```bash
pnpm add -D typescript tsup
```

Configure `typescript` by creating a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  }
}
```

Configure `tsup` by creating a `tsup.config.ts` file:

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "es2017",
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
```

Create `.nvmrc` file with required Node version:

```ini
lts/hydrogen
```

Create `.npmrc` with some PNPM tweaks and package registry settings:

```ini
; Peer dependencies are a nightmare. Make them less so.
strict-peer-dependencies=false
; Prevent pnpm publish from running if you aren't on the specified branch.
publish-branch=main
; Default to `--save-exact` when running `pnpm add`. Change manually (e.g. "1.0.1" to "^1.0.1").
save-prefix=""
; Verify the integrity of installed dependencies. PNPM `npm audit signatures` equivalent (https://github.com/pnpm/pnpm/issues/6435)
provenance=true

; Set github registry (Add `GITHUB_TOKEN` to `.bashrc`)
@sidisinsane:registry=https://npm.pkg.github.com
//npm.pkg.github.com:_authToken="${GITHUB_TOKEN}"
; Set npmjs registry (Add `NPM_TOKEN` to `.bashrc`)
@humanuals:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken="${NPM_TOKEN}"
```

## Code Formatter

```bash
pnpm add -D prettier
```

Configure `prettier` by creating a `.prettierrc` file:

```json
{}
```

## Unit Testing Framework

```bash
pnpm add -D jest ts-jest @types/jest
```

Configure `jest` by creating a `jest.config.cjs` file:

```javascript
/* eslint-env node */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
};
```

## Documentation

```bash
pnpm add -D typedoc @mxssfd/typedoc-theme
```

Configure `typedoc` by creating a `typedoc.config.cjs` file:

```javascript
/* eslint-env node */
/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ["./src/index.ts"],
  out: "docs",
  plugin: ["@mxssfd/typedoc-theme"],
  theme: "my-theme",
  cleanOutputDir: true,
};
```

## Release Workflow Automation

```bash
pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git commitizen cz-conventional-changelog && \
commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact
```

Configure `semantic-release` by creating a `.releaserc` file:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/github",
      {
        "successComment": false,
        "failTitle": false
      }
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

Configure `commitizen` by creating a `.czrc` file:

```json
{
  "path": "./node_modules/cz-conventional-changelog"
}
```

Configure Github Actions by creating

- `.github/workflows/main.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/release.yml`

`.github/workflows/release.yml`:

```yaml
name: Release

on:
  workflow_run:
    workflows: ["CI"]
    types:
      - completed
  push:
    branches:
      - main

permissions:
  contents: read # for checkout

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write # to be able to publish a GitHub release
      issues: write # to be able to comment on released issues
      pull-requests: write # to be able to comment on released pull requests
      id-token: write # to enable use of OpenID Connect (OIDC) for npm provenance
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup PNPM 8.7.4
        uses: pnpm/action-setup@v2
        with:
          version: 8.7.4

      - name: Setup Node.js for PNPM
        uses: actions/setup-node@v3
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: pnpm exec semantic-release
```

More about Github Actions:

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Using semantic-release with GitHub Actions](https://github.com/semantic-release/semantic-release/blob/master/docs/recipes/ci-configurations/github-actions.md)
