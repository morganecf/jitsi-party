import baseConfig from '../../config.json'
import prodConfig from '../../production.json'

// values in prodConfig override values in baseConfig when not running locally
const hostname = window && window.location && window.location.hostname
const development = hostname && hostname.includes('localhost')
const config = !development ? Object.assign(baseConfig, prodConfig) : baseConfig

export default config