/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const multer = require('multer');
const _ = require('lodash');
const serveStatic = require('serve-static');
const logger = require('../../shared/logger')('[CrashLog API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const configurationService = require('../../services/core/configurationService');
const crashLogService = require('../../services/crashLogService');
const projectService = require('../../services/projectService');

const upload = multer({
    dest: configurationService.getLogUploadDirectory(),
    limits: {
        fileSize: 2 * 1000 * 1000, // 2 Mb
    },
});
const pathsWithoutSecurity = [
    {
        url: /.*crash-logs\/projects\/.*/ig,
        methods: ['POST'],
    },
];

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    expose,
    pathsWithoutSecurity,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Post Crash log.
 * @param req {Object} Request
 * @param res {Object} Response
 */
function postCrashLog(req, res) {
    // Get default body
    const body = APIResponse.getDefaultResponseBody();
    // Get project Id
    const projectId = req.params.projectId;
    // Check if project id exists
    if (!projectId) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        // Stop here
        return;
    }

    logger.debug(`Project Id : ${projectId}`);

    const requestBody = req.body;
    // Check if request body exists
    if (!requestBody || _.isEqual(Object.keys(requestBody).length, 0)) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        // Stop here
        return;
    }

    // Find Project by id
    projectService.findById(projectId).then((project) => {
        // Check if project exists in database
        if (!project) {
            // Send response
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        let file = req.file;
        // Create file object if not exists
        if (file) {
            file = {};
        }

        // Get only interesting fields
        const crashLogObject = {
            ver: requestBody.ver,
            platform: requestBody.platform,
            process_type: requestBody.process_type,
            guid: requestBody.guid,
            _version: requestBody._version,
            _productName: requestBody._productName,
            prod: requestBody.prod,
            _companyName: requestBody._companyName,
            upload_file_minidump: file ? file.filename : null,
            extra: requestBody.extra,
        };

        logger.debug(`File : ${JSON.stringify(file)}`);
        logger.debug(`Body : ${JSON.stringify(crashLogObject)}`);

        crashLogService.saveNewCrashLog(crashLogObject, project).then((crashLog) => {
            APIResponse.sendTextResponse(res, crashLog._id, APICodes.SUCCESS.CREATED);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        // Send response
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
    logger.debug('Putting crash log API...');
    const router = express.Router();

    // Post crash log
    router.post('/crash-logs/projects/:projectId', upload.single('upload_file_minidump'), postCrashLog);
    // Download crash log (with upload_file_dump id)
    router.use('/crash-logs/downloads/', serveStatic(configurationService.getAppCrashLogDirectory(), {
        fallthrough: false,
    }));

    return router;
}
