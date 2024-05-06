import { createLibConfig } from '@nextcloud/vite-config'
import { version } from './package.json'

export default createLibConfig(
	{
		index: `${__dirname}/lib/index.ts`,
	},
	{
		libraryFormats: ['cjs', 'es'],
		replace: {
			'__pkg_version': JSON.stringify(version),
		}
	},
)
