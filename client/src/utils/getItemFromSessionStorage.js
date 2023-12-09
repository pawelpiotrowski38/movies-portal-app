export function getItemFromSessionStorage(key, defaultValue) {
    return JSON.parse(sessionStorage.getItem(key)) || defaultValue;
}