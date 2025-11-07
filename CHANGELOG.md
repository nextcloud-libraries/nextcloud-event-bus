# Changelog

<!--
 - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: CC0-1.0
-->

All notable changes to this project will be documented in this file.

## [v3.3.3](https://github.com/nextcloud-libraries/nextcloud-event-bus/tree/v3.3.3) \(2025-11-07\)

### Changed

- build: use consistent script names for npm ([#995](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/995))
- chore: update node version to include LTS and active ([#994](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/994))
- chore: align `devEngines` with apps Node version ([#1012](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/1012))
- chore(deps): Bump `@types/semver` to 7.7.0 ([#954](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/954))
- chore(deps): Bump `semver` to 7.7.2 ([#986](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/986))
- ci: update reuse.yml workflow from template ([#1009](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/1009))
- ci: update npm-publish.yml workflow from template ([#1010](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/1010))
- ci: update workflows from organization ([#1011](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/1011))
- refactor: adjust code to already comply with upcoming ESLint v9 ([#996](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/996))

## [v3.3.2](https://github.com/nextcloud-libraries/nextcloud-event-bus/tree/v3.3.2) \(2025-02-28\)

### Fixed

- fix: Allow events without parameters [\#792](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/792) ([susnux](https://github.com/susnux)\)
- fix: Resolve typos in doc strings [\#862](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/862) ([susnux](https://github.com/susnux)\)

### Changed

- Updated development dependencies
- chore(deps): Bump semver to 7.6.3
- Migrate REUSE to TOML format [\#801](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/801) ([AndyScherzinger](https://github.com/AndyScherzinger)\)
- Update dependabot-approve-merge.yml from org [\#826](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/826) ([AndyScherzinger](https://github.com/AndyScherzinger)\)

## [v3.3.1](https://github.com/nextcloud-libraries/nextcloud-event-bus/tree/v3.3.1) \(2024-05-28\)

### Fixed

- fix: Do not include declarations for private globals in distribution [\#772](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/772) ([susnux](https://github.com/susnux)\)

### Changed

- chore: Add license information to files and add REUSE workflow [\#773](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/773) ([susnux](https://github.com/susnux)\)

## [v3.3.0](https://github.com/nextcloud-libraries/nextcloud-event-bus/tree/v3.3.0) \(2024-05-07\)

### Added

- feat: Allow to fully type events by extending the `NextcloudEvents` interface [\#755](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/755) \([susnux](https://github.com/susnux)\)

### Fixed

- fix(readme): update engine requirements according to package.json [\#754](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/754) \([AaronActu](https://github.com/AaronActu)\)
- fix(docs): Adjust invalid example for typed events [\#763](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/763) ([susnux](https://github.com/susnux)\)

### Changed

- feat: Add ESLint for linting and prettier for formatting [\#759](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/759) ([susnux](https://github.com/susnux)\)
- feat: Migrate to vite for building and vitest for testing [\#758](https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/758) ([susnux](https://github.com/susnux)\)

## [v3.2.0](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.2.0) (2024-04-21)

### Changed

- Add missing nodes typing for docs by @skjnldsv in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/606
- Add missing unit tests and use Typescript also for test by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/630
- chore: update node engines to next LTS by @nextcloud-command in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/621
- fix: Use organization workflow for node test ci by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/629
- fix(ci): Update documentation workflow from organization by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/628

### Dependencies

- chore(deps-dev): Bump @rollup/plugin-replace to 5.0.3
- chore(deps-dev): Bump @rollup/plugin-typescript to 11.1.5
- chore(deps-dev): Bump @types/node to 20.4.1
- chore(deps-dev): Bump @types/semver to 7.5.3
- chore(deps-dev): Bump jest to 29.7.0
- chore(deps-dev): Bump jest-environment-jsdom to 29.7.0
- chore(deps-dev): Bump rollup to 4.0.2
- chore(deps-dev): Bump semver to 7.5.4
- chore(deps-dev): Bump tslib to 2.6.2
- chore(deps-dev): Bump typedoc to 0.25.2
- chore(deps-dev): Bump typescript to 5.2.2
- chore(deps-dev): Bump word-wrap to 1.2.4
- chore(deps): Bump @types/node to 20.8.6
- chore(deps): Bump semver to 7.5.3
- chore(deps): Bump tough-cookie to 4.1.3

## [v3.1.0](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.1.0) (2023-05-17)

[Full Changelog](https://github.com/nextcloud/nextcloud-event-bus/compare/v3.0.2...v3.1.0)

### Changed

- Updated dependencies
- Initialize bus on first usage not on import [\#587](https://github.com/nextcloud/nextcloud-event-bus/pull/587) ([susnux](https://github.com/susnux))

### Fixed

- Allow package to be imported by native Node ES module projects [\#586](https://github.com/nextcloud/nextcloud-event-bus/pull/586) ([susnux](https://github.com/susnux))

## [v3.0.2](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.0.2) (2022-09-05)

[Full Changelog](https://github.com/nextcloud/nextcloud-event-bus/compare/v3.0.1...v3.0.2)

### Closed pull requests

- 🩹 Remove type=module [\#534](https://github.com/nextcloud/nextcloud-event-bus/pull/534) ([vinicius73](https://github.com/vinicius73))

## 3.0.1 - 2022-08-24

⚠️ deprecated

### Changed

- Update dependencies
- Improve native ESM Support

## 3.0.0 - 2022-05-02

### Changed

- Update dependencies
- Fix rollup build
- Remove babel
    - Typescript already is able to generate code that is in compliance with es5
- Remove package.json from generated code.
    - Use @rollup/plugin-replace to handle this.
- Add ESM support
    - Improve native usage support
    - Improve bundle size
- Fix invalid typescript typings export
- Remove unnecessary files from npm package

## 2.1.1 – 2021-11-02

### Changed

- Dependency updates

## 2.1.0 – 2021-09-28

### Changed

- Dependency updates

### Fixed

- Readme examples
- Dependency updates

## 2.0.0 - 2021-05-05

### Breaking

- Bump of @nextcloud/browserlist-config@2.1.0 which drops support for IE11

### Changed

- Move a single to transpiled library bundle
- Dependency updates

## 1.3.0 - 2021-05-05

### Changed

- Move a single to transpiled library bundle
- Dependency updates

## 1.2.0 - 2020-06-03

### Changed

- Dependency updates

## 1.1.4 - 2020-04-06

### Changed

- Dependency updates

### Fixed

- Update vulnerable packages

## 1.1.3 - 2020-03-19

### Changed

- Dependency updates

### Fixed

- Update vulnerable packages

## 1.1.2 - 2020-01-10

### Fixed

- Packaging of corejs

## 1.1.1 - 2020-01-10

### Fixed

- Module error with semver package

## 1.0.1 - 2020-01-07

### Fixed

- Misleading warning if ProxyBus is used for a compatible bus
