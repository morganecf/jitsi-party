import baseConfig from '../../config/base/config.json'
import devConfig from '../../config/base/development.json'
import prodConfig from '../../config/base/production.json'

// overrides/config.json and overrides/rooms.json supercede anything in the default configs.
// overrides/config.json is merged with underlying configs, but overrides/rooms.json replaces default rooms completely

let overrideConfig = {}
try {
	overrideConfig = require('../../config/overrides/config.json')
} catch {}

// live config is built by adding the rooms config and one of dev or prod config to base config
// values in prodConfig override values in baseConfig when not running locally

const href = window && window.location && window.location.href.split('#')[0]
const developmentMode = href && href.includes('localhost')
const config = Object.assign(baseConfig, !developmentMode ? prodConfig : devConfig)

config.baseUrl = href

export default Object.assign(config, overrideConfig)
