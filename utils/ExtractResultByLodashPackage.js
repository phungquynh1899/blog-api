`use strict`

const lodash = require('lodash')
const { InternalServerError } = require(`../response/error.response`)
//field must be string array
const getDataToForResponseObject = (field = [], object = {}) => {
    if (!object || typeof object !== 'object') {
        throw new InternalServerError('The source object must be a valid object');
    }

    if (!Array.isArray(field)) {
        throw new InternalServerError('Fields must be an string array');
    }
    return lodash.pick(object, field)
}

module.exports = { getDataToForResponseObject }