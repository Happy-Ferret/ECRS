/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const {
    CrashLog,
    } = require('../models/crashLogModel');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    formatToApi,
    formatListToApi,
    build,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Format List to api.
 * @param list {Array} list
 * @returns {*}
 */
function formatListToApi(list) {
    return list.map(formatToApi);
}

/**
 * Build.
 * @param data {Object} CrashLog data
 * @returns {*} CrashLog
 */
function build(data) {
    const dataUpdated = data;
    // Update extra data to JSON object if possible
    try {
        dataUpdated.extra = JSON.parse(data.extra);
    } catch (e) {
        // Nothing
    }

    return new CrashLog(dataUpdated);
}

/**
 * Format to Api.
 * @param crashLogObject {Object} CrashLog Object
 * @returns {{id: *, ver: *, platform: (*), process_type: *, guid: *, _version: *, _productName: *, prod: *, _companyName: *, upload_file_minidump: *, extra: {}}}
 */
function formatToApi(crashLogObject) {
    return {
        id: crashLogObject._id,
        ver: crashLogObject.ver,
        platform: crashLogObject.platform,
        process_type: crashLogObject.process_type,
        guid: crashLogObject.guid,
        _version: crashLogObject._version,
        _productName: crashLogObject._productName,
        prod: crashLogObject.prod,
        _companyName: crashLogObject._companyName,
        upload_file_minidump: crashLogObject.upload_file_minidump,
        extra: crashLogObject.extra,
        date: crashLogObject.date,
    };
}
