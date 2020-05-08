const ttl = 10 * 60 * 1000 // 10 mins

export default class LocalStorage {

    static set(key, value) {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        }

        localStorage.setItem(key, JSON.stringify(item))
    }

    static get(key) {
        const itemStr = localStorage.getItem(key)
        if (!itemStr) {
            return null
        }

        const item = JSON.parse(itemStr)
        const now = new Date()
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }

    // reset TTL
    static touch(key) {
        const currentValue = LocalStorage.get(key)
        if (currentValue) {
            LocalStorage.set(key, currentValue)
        }
    }
}