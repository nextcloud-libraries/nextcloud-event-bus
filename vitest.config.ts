/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { UserConfig } from 'vite'

import { version } from './package.json'
import viteConfig from './vite.config.ts'

export default async (env: Parameters<typeof viteConfig>[0]) => {
	const config = await viteConfig(env)
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter(
		(plugin) =>
			plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'),
	)

	return {
		...config,
		define: {
			__pkg_version: JSON.stringify(version),
		},
		test: {
			environment: 'happy-dom',
			coverage: {
				reporter: ['text', 'lcov'],
			},
		},
	} as UserConfig
}
