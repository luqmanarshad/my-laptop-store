export const loadList = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
        return []
    }
}

export const saveList = (key, list) => {
    localStorage.setItem(key, JSON.stringify(list))
    window.dispatchEvent(new Event(`${key}-updated`))
    return list
}

export const addItem = (key, item) => {
    const list = loadList(key)
    const exists = list.some((entry) => entry.id === item.id)

    if (exists) {
        return list
    }

    list.push(item)
    return saveList(key, list)
}

export const removeItem = (key, id) => {
    const list = loadList(key).filter((entry) => entry.id !== id)
    return saveList(key, list)
}

export const hasItem = (key, id) => {
    return loadList(key).some((entry) => entry.id === id)
}
