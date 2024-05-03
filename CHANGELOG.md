# Changelog

All notable changes to this project will be documented in this file.

## [v3.2.0](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.2.0) (2024-04-21)

### Changed

-   Add missing nodes typing for docs by @skjnldsv in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/606
-   Add missing unit tests and use Typescript also for test by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/630
-   chore: update node engines to next LTS by @nextcloud-command in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/621
-   fix: Use organization workflow for node test ci by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/629
-   fix(ci): Update documentation workflow from organization by @susnux in https://github.com/nextcloud-libraries/nextcloud-event-bus/pull/628

### Dependencies

-   chore(deps-dev): Bump @rollup/plugin-replace from 5.0.2 to 5.0.3 by @dependabot
-   chore(deps-dev): Bump @rollup/plugin-typescript from 11.1.1 to 11.1.5 by @dependabot
-   chore(deps-dev): Bump @types/node from 20.3.3 to 20.4.1 by @dependabot
-   chore(deps-dev): Bump @types/semver from 7.5.0 to 7.5.3 by @dependabot
-   chore(deps-dev): Bump jest from 29.5.0 to 29.7.0 by @dependabot
-   chore(deps-dev): Bump jest-environment-jsdom from 29.5.0 to 29.7.0 by @dependabot
-   chore(deps-dev): Bump rollup from 2.79.1 to 4.0.2 by @dependabot
-   chore(deps-dev): Bump semver from 7.5.3 to 7.5.4 by @dependabot
-   chore(deps-dev): Bump tslib from 2.5.0 to 2.6.2 by @dependabot
-   chore(deps-dev): Bump typedoc from 0.24.7 to 0.25.2 by @dependabot
-   chore(deps-dev): Bump typescript from 5.0.4 to 5.2.2 by @dependabot
-   chore(deps-dev): Bump word-wrap from 1.2.3 to 1.2.4 by @dependabot
-   chore(deps): Bump @types/node from 20.1.7 to 20.8.6 by @dependabot
-   chore(deps): Bump semver from 7.5.1 to 7.5.3 by @dependabot
-   chore(deps): Bump tough-cookie from 4.1.2 to 4.1.3 by @dependabot

## [v3.1.0](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.1.0) (2023-05-17)

[Full Changelog](https://github.com/nextcloud/nextcloud-event-bus/compare/v3.0.2...v3.1.0)

### Changed

-   Updated dependencies
-   Initialize bus on first usage not on import [\#587](https://github.com/nextcloud/nextcloud-event-bus/pull/587) ([susnux](https://github.com/susnux))

### Fixed

-   Allow package to be imported by native Node ES module projects [\#586](https://github.com/nextcloud/nextcloud-event-bus/pull/586) ([susnux](https://github.com/susnux))

## [v3.0.2](https://github.com/nextcloud/nextcloud-event-bus/tree/v3.0.2) (2022-09-05)

[Full Changelog](https://github.com/nextcloud/nextcloud-event-bus/compare/v3.0.1...v3.0.2)

### Closed pull requests

-   🩹 Remove type=module [\#534](https://github.com/nextcloud/nextcloud-event-bus/pull/534) ([vinicius73](https://github.com/vinicius73))

## 3.0.1 - 2022-08-24

⚠️ deprecated

### Changed

-   Update dependencies
-   Improve native ESM Support

## 3.0.0 - 2022-05-02

### Changed

-   Update dependencies
-   Fix rollup build
-   Remove babel
    -   Typescript already is able to generate code that is in compliance with es5
-   Remove package.json from generated code.
    -   Use @rollup/plugin-replace to handle this.
-   Add ESM support
    -   Improve native usage support
    -   Improve bundle size
-   Fix invalid typescript typings export
-   Remove unnecessary files from npm package

## 2.1.1 – 2021-11-02

### Changed

-   Dependency updates

## 2.1.0 – 2021-09-28

### Changed

-   Dependency updates

### Fixed

-   Readme examples
-   Dependency updates

## 2.0.0 - 2021-05-05

### Breaking

-   Bump of @nextcloud/browserlist-config@2.1.0 which drops support for IE11

### Changed

-   Move a single to transpiled library bundle
-   Dependency updates

## 1.3.0 - 2021-05-05

### Changed

-   Move a single to transpiled library bundle
-   Dependency updates

## 1.2.0 - 2020-06-03

### Changed

-   Dependency updates

## 1.1.4 - 2020-04-06

### Changed

-   Dependency updates

### Fixed

-   Update vulnerable packages

## 1.1.3 - 2020-03-19

### Changed

-   Dependency updates

### Fixed

-   Update vulnerable packages

## 1.1.2 - 2020-01-10

### Fixed

-   Packaging of corejs

## 1.1.1 - 2020-01-10

### Fixed

-   Module error with semver package

## 1.0.1 - 2020-01-07

### Fixed

-   Misleading warning if ProxyBus is used for a compatible bus
