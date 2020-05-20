import baseConfig from '../../config/base.json'
import devConfig from '../../config/development.json'
import prodConfig from '../../config/production.json'

// overrides/config.json and overrides/rooms.json supercede anything in the default configs.
// overrides/config.json is merged with underlying configs, but overrides/rooms.json replaces default rooms completely

let overrideConfig = {}
try {
	overrideConfig = require('../../config/overrides/config.json')
} catch {}

// live config is built by adding the rooms config and one of dev or prod config to base config
// values in prodConfig override values in baseConfig when not running locally

const hostname = window && window.location && window.location.hostname
const developmentMode = hostname && hostname.includes('localhost')
const config = !developmentMode ? Object.assign(baseConfig, prodConfig) : Object.assign(baseConfig, devConfig)

export default Object.assign(config, overrideConfig)
