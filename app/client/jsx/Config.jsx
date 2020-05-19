import baseConfig from '../../config/base.json'
import devConfig from '../../config/development.json'
import prodConfig from '../../config/production.json'
import roomsConfig from '../../config/rooms.json'

// live config is built by adding the rooms config and one of dev or prod config to base config
// values in prodConfig override values in baseConfig when not running locally

const hostname = window && window.location && window.location.hostname
const developmentMode = hostname && hostname.includes('localhost')
const base = Object.assign(baseConfig, roomsConfig)
const config = !developmentMode ? Object.assign(base, prodConfig) : Object.assign(base, devConfig)

export default config
