import type { JestConfigWithTsJest } from 'ts-jest'
import pkgJson from './package.json'

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest/presets/default',
	testEnvironment: 'jsdom',

	globals: {
		__pkg_version: pkgJson.version
	}
}

export default jestConfig
