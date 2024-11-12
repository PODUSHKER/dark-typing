

function stringToArray(string) {
    return string ? string.split(';') : []
}

function arrayToString(arr) {
    console.log('hueta', arr)
    return arr.join(';')
}

module.exports = { arrayToString, stringToArray }