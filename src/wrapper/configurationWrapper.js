/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const nconf = require('nconf');
const _ = require('lodash');
const path = require('path');

// Variables
const CONSTANTS = {
    PORT: 'CRASH_REPORTER_PORT',
    LOG_LEVEL: 'CRASH_REPORTER_LOG_LEVEL',
    LOG_UPLOAD_DIR: 'CRASH_REPORTER_LOG_UPLOAD_DIR',
    LOG_APP_CRASH_DIR: 'CRASH_REPORTER_LOG_APP_CRASH_DIR',
    DATABASE_URL: 'CRASH_REPORTER_DATABASE_URL',
    DATABASE_LOGIN: 'CRASH_REPORTER_DATABASE_LOGIN',
    DATABASE_PASSWORD: 'CRASH_REPORTER_DATABASE_PASSWORD',
    GITHUB_OAUTH_ENABLED: 'CRASH_REPORTER_AUTH_GITHUB_OAUTH_ENABLED',
    GITHUB_CLIENT_ID: 'CRASH_REPORTER_AUTH_GITHUB_CLIENT_ID',
    GITHUB_CLIENT_SECRET: 'CRASH_REPORTER_AUTH_GITHUB_CLIENT_SECRET',
    JWT_SECRET: 'CRASH_REPORTER_AUTH_JWT_SECRET',
    LOCAL_AUTH_ENABLED: 'CRASH_REPORTER_AUTH_LOCAL_AUTH_ENABLED',
    LOCAL_REGISTER_ENABLED: 'CRASH_REPORTER_LOCAL_REGISTER_ENABLED',
    BACKEND_URL: 'CRASH_REPORTER_URL',
    MAIL_HOST: 'CRASH_REPORTER_MAIL_HOST',
    MAIL_POOL: 'CRASH_REPORTER_MAIL_POOL',
    MAIL_PORT: 'CRASH_REPORTER_MAIL_PORT',
    MAIL_SECURE: 'CRASH_REPORTER_MAIL_SECURE',
    MAIL_AUTH_USER: 'CRASH_REPORTER_MAIL_AUTH_USER',
    MAIL_AUTH_PASS: 'CRASH_REPORTER_MAIL_AUTH_PASS',
    MAIL_FROM: 'CRASH_REPORTER_MAIL_FROM',
};
const LOG_LEVELS = {
    DEBUG: 'debug',
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn',
};

// Default configuration
const DEFAULT_CONFIG = {
    CRASH_REPORTER_PORT: 2000,
    CRASH_REPORTER_LOG_LEVEL: LOG_LEVELS.INFO,
    CRASH_REPORTER_LOG_UPLOAD_DIR: path.join(process.cwd(), 'upload-logs/'),
    CRASH_REPORTER_LOG_APP_CRASH_DIR: path.join(process.cwd(), 'app-crash-logs/'),
    CRASH_REPORTER_DATABASE_URL: '',
    CRASH_REPORTER_DATABASE_LOGIN: '',
    CRASH_REPORTER_DATABASE_PASSWORD: '',
    CRASH_REPORTER_AUTH_GITHUB_OAUTH_ENABLED: true,
    CRASH_REPORTER_AUTH_GITHUB_CLIENT_ID: '',
    CRASH_REPORTER_AUTH_GITHUB_CLIENT_SECRET: '',
    CRASH_REPORTER_AUTH_JWT_SECRET: '',
    CRASH_REPORTER_AUTH_LOCAL_AUTH_ENABLED: true,
    CRASH_REPORTER_LOCAL_REGISTER_ENABLED: true,
    CRASH_REPORTER_URL: 'http://your-domain.com',
    CRASH_REPORTER_MAIL_HOST: '',
    CRASH_REPORTER_MAIL_POOL: false,
    CRASH_REPORTER_MAIL_PORT: 0,
    CRASH_REPORTER_MAIL_SECURE: false,
    CRASH_REPORTER_MAIL_AUTH_USER: '',
    CRASH_REPORTER_MAIL_AUTH_PASS: '',
    CRASH_REPORTER_MAIL_FROM: '',
};

/**
 * 1) Default
 * 2) Configuration file
 * 3) Env variables
 * 4) Command line
 */
    // Configuration file => no config file for the moment
    // nconf.file({file: 'config.json'});
    // Environment variables
nconf.env();
// Command line
nconf.argv();
// Default
nconf.defaults(DEFAULT_CONFIG);

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    DEFAULT_CONFIG,
    CONSTANTS,
    getConfig,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get configuration.
 * @returns {{}}
 */
function getConfig() {
    const config = {};

    const keys = Object.keys(DEFAULT_CONFIG);
    keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key)) {
            config[key] = nconf.get(key);
        }
    });

    // Valid log level
    if (!_.includes(LOG_LEVELS, config[CONSTANTS.LOG_LEVEL])) {
        config[CONSTANTS.LOG_LEVEL] = LOG_LEVELS.INFO;
    }

    // Change type if necessary
    if (!_.isInteger(config[CONSTANTS.PORT])) {
        config[CONSTANTS.PORT] = _.parseInt(config[CONSTANTS.PORT]);
    }
    if (!_.isInteger(config[CONSTANTS.MAIL_PORT])) {
        config[CONSTANTS.MAIL_PORT] = _.parseInt(config[CONSTANTS.MAIL_PORT]);
    }
    if (!_.isBoolean(config[CONSTANTS.MAIL_SECURE])) {
        config[CONSTANTS.MAIL_SECURE] = (config[CONSTANTS.MAIL_SECURE] === 'true');
    }
    if (!_.isBoolean(config[CONSTANTS.MAIL_POOL])) {
        config[CONSTANTS.MAIL_POOL] = (config[CONSTANTS.MAIL_POOL] === 'true');
    }
    if (!_.isBoolean(config[CONSTANTS.GITHUB_OAUTH_ENABLED])) {
        config[CONSTANTS.GITHUB_OAUTH_ENABLED] = (config[CONSTANTS.GITHUB_OAUTH_ENABLED] === 'true');
    }
    if (!_.isBoolean(config[CONSTANTS.LOCAL_AUTH_ENABLED])) {
        config[CONSTANTS.LOCAL_AUTH_ENABLED] = (config[CONSTANTS.LOCAL_AUTH_ENABLED] === 'true');
    }
    if (!_.isBoolean(config[CONSTANTS.LOCAL_REGISTER_ENABLED])) {
        config[CONSTANTS.LOCAL_REGISTER_ENABLED] = (config[CONSTANTS.LOCAL_REGISTER_ENABLED] === 'true');
    }

    // Check end of backend url
    if (_.endsWith(config[CONSTANTS.BACKEND_URL], '/')) {
        config[CONSTANTS.BACKEND_URL] =
            config[CONSTANTS.BACKEND_URL].substr(0, config[CONSTANTS.BACKEND_URL].length - 1);
    }

    return config;
}
