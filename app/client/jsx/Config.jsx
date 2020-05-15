import baseConfig from '../../config.json'
import prodConfig from '../../production.json'

// values in prodConfig override values in baseConfig when not running locally
const hostname = window && window.location && window.location.hostname
const development = hostname && hostname.includes('localhost')
const config = !production ? Object.assign(baseConfig, prodConfig) : baseConfig

export default class Config {
	static get(key) {
		return config[key]
	}

	static get debug() {
		return config['debug']
	}
}