import * as timeago from 'timeago.js';

export function get(obj, path, defValue) {
    // If path is not defined or it has false value
    if (!path) return undefined
    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
    // Find value
    const result = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj)
    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result
}

export function timeSince(date) {
    date = new Date(date);
    return timeago.format(date);
}

export function formatEntity($str) {
    let entities = [
        { find: '&#039;', replace: "'"},
    ];

    entities.forEach((entity)=> {
        $str = $str.split(entity.find).join(entity.replace);
    });

    return $str;
}

export function i18n(key, ...args) {
    let value = inotespress_data.i18n[key]? inotespress_data.i18n[key] : key;
    
    for(let i = 0; i < args.length; i++) value = value.replaceAll(`$${i + 1}`, args[i]);

    return formatEntity(value);
}