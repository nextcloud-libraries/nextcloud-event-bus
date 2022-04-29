# Changelog

All notable changes to this project will be documented in this file.

## 2.2.0-next
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
