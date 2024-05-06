import type { UserConfig } from 'vite'
import viteConfig from './vite.config'
import { version } from './package.json'

export default async (env: Parameters<typeof viteConfig>[0]) => {
	const config = await viteConfig(env)
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	return {
		...config,
		define: {
			'__pkg_version': JSON.stringify(version),
		},
		test: {
			environment: 'happy-dom',
			coverage: {
				reporter: ['text', 'lcov'],
			},
		},
	} as UserConfig
}
