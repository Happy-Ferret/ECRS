/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Users API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const apiSecurity = require('../core/apiSecurity');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
const projectService = require('../../services/projectService');

const rolesObj = userService.rolesObj;
const roles = userService.roles;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    expose,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get current user.
 * @param req
 * @param res
 */
function getCurrentUser(req, res) {
    const user = req.userDb;
    APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.OK);
}

/**
 * Change password for current user.
 * @param req
 * @param res
 * @param next
 */
function changeCurrentPassword(req, res, next) {
    // Get default body
    const body = APIResponse.getDefaultResponseBody();
    // Get user
    const user = req.userDb;

    // Check if current user is a local user
    if (!(user.local && user.local.hash)) {
        // Not a local user => Forbidden
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    // Check body
    req.checkBody('oldPassword', 'Old password empty').notEmpty();
    req.checkBody('newPassword', 'New password empty').notEmpty();
    req.checkBody('oldPassword', 'Old password too short')
        .stringHasMinLength(userService.userValidation.localPassword.minLength);
    req.checkBody('newPassword', 'New password too short')
        .stringHasMinLength(userService.userValidation.localPassword.minLength);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Get data
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    userService.checkOldPasswordAndChangePassword(user, oldPassword, newPassword).then((result) => {
        APIResponse.sendResponse(res, userMapper.formatToApi(result), APICodes.SUCCESS.OK);
    }).catch((err) => {
        if (err && err.message === 'Wrong old password') {
            // Forbidden
            body.message = err.message;
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
            return;
        }

        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Get users.
 * @param req
 * @param res
 */
function getUsersAdministrator(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Get pagination element
    let limit = req.query.limit;
    if (limit && _.isString(limit)) {
        limit = _.parseInt(limit);
    } else {
        limit = null;
    }
    let skip = req.query.skip;
    if (skip && _.isString(skip)) {
        skip = _.parseInt(skip);
    } else {
        skip = null;
    }
    let sort = req.query.sort;
    if (sort) {
        if (_.isString(sort)) {
            try {
                sort = JSON.parse(sort);
            } catch (e) {
                sort = {};
            }
        }
        if (_.isObject(sort)) {
            // Transform id key
            if (Object.prototype.hasOwnProperty.call(sort, 'id')) {
                sort._id = sort.id;
                delete sort.id;
            }
        }
    } else {
        sort = null;
    }

    const promises = [];
    promises.push(userService.findAllWithPagination(limit, skip, sort));
    promises.push(userService.countAll());

    Promise.all(promises).then(([all, count]) => {
        APIResponse.sendResponse(res, {
            total: count,
            items: userMapper.formatListToApi(all),
        }, APICodes.SUCCESS.OK);
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Change password for administrator.
 * @param req
 * @param res
 */
function changePasswordAdministrator(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Validation
    req.checkBody('newPassword', 'New password empty').notEmpty();
    req.checkBody('newPassword', 'New password too short')
        .stringHasMinLength(userService.userValidation.localPassword.minLength);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Get data
    const newPassword = req.body.newPassword;

    // Get user id
    const userId = req.params.id;
    // Get user from database
    userService.findById(userId).then((user) => {
        // Check if user exists
        if (!user) {
            // User not found in database
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        // Check if current user is a local user
        if (!(user.local && user.local.hash)) {
            // Not a local user => Forbidden
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
            return;
        }

        userService.changePassword(user, newPassword).then(() => {
            APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Remove user.
 * @param req
 * @param res
 */
function removeUserAdministrator(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Get user id
    const userId = req.params.id;
    // Get user from database
    userService.findById(userId).then((user) => {
        // Check if user exists
        if (!user) {
            // User not found in database
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        // Continue function
        function go() {
            // Delete all user project
            projectService.deleteRecursivelyByIds(user.projects).then(() => {
                // All removed => delete user
                userService.removeById(user._id).then(() => {
                    APIResponse.sendResponse(res, null, APICodes.SUCCESS.NO_CONTENT);
                }).catch((err) => {
                    logger.error(err);
                    APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
                });
            }).catch((err) => {
                logger.error(err);
                APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
            });
        }

        // Check that user is not last administrator only if user is administrator
        if (_.isEqual(rolesObj.admin, user.role)) {
            userService.checkIsUserLastAdministrator(user).then((isLastAdmin) => {
                if (isLastAdmin) {
                    logger.error('Try to remove last administrator');
                    APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
                    return;
                }

                // Ok for removing
                go();
            }).catch((err) => {
                logger.error(err);
                APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
            });
        } else {
            go();
        }
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Create user by administrator.
 * @param req
 * @param res
 */
function createUserAdministrator(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Validation
    req.checkBody('username', 'Invalid Username').notEmpty();
    req.checkBody('password', 'Invalid Password').notEmpty();
    req.checkBody('role', 'Invalid Role').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail(false);
    req.checkBody('username', 'Invalid Username (Minimum size error)')
        .stringHasMinLength(userService.userValidation.username.minLength);
    req.checkBody('password', 'Invalid Password (Minimum size error)')
        .stringHasMinLength(userService.userValidation.localPassword.minLength);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    //
    const userData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
    };

    // Check that role exists
    if (rolesObj[userData.role]) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Check if username already exists
    userService.findByUsernameForLocal(userData.username).then((userDb) => {
        if (!_.isNull(userDb)) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.CONFLICT);
            return;
        }

        // Ok can be added
        userService.createNewUser(userData).then((user) => {
            APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.CREATED);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Get roles.
 * @param req
 * @param res
 */
function getRoles(req, res) {
    APIResponse.sendArrayResponse(res, roles, APICodes.SUCCESS.OK);
}

/**
 * Update user.
 * @param req
 * @param res
 */
function updateUser(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Validation
    req.checkBody('role', 'Invalid Role').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail(false);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    //
    const userData = {
        email: req.body.email,
        role: req.body.role,
    };

    // Check that role exists
    if (rolesObj[userData.role]) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // User id
    const userId = req.params.id;

    // Find user
    userService.findById(userId).then((userDb) => {
        if (userDb) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        // Continue function
        function go() {
            // Ok can be updated
            userService.updateUser(userDb, userData).then((user) => {
                APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.OK);
            }).catch((err) => {
                logger.error(err);
                APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
            });
        }

        // Check if user is not last administrator and being erased
        if (_.isEqual(userDb.role, rolesObj.admin) && !_.isEqual(userDb.role, userData.role)) {
            userService.checkIsUserLastAdministrator(userDb).then((isLastAdmin) => {
                if (isLastAdmin) {
                    APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
                    return;
                }

                // Continue
                go();
            }).catch((err) => {
                logger.error(err);
                APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
            });
        } else {
            // Continue
            go();
        }
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Change email for current user.
 * @param req
 * @param res
 * @param next
 */
function changeCurrentEmail(req, res, next) {
    // Get default body
    const body = APIResponse.getDefaultResponseBody();
    // Get user
    const user = req.userDb;

    // Check body
    req.checkBody('email', 'Invalid Email').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail(true);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Get data
    const newEmail = req.body.email;

    userService.updateEmail(user, newEmail).then((result) => {
        APIResponse.sendResponse(res, userMapper.formatToApi(result), APICodes.SUCCESS.OK);
    }).catch(next);
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
    logger.debug('Putting users API...');
    const router = express.Router();

    router.get('/users', apiSecurity.middleware.populateUser(), apiSecurity.middleware.onlyAdministrator(),
        getUsersAdministrator);
    router.get('/users/roles', getRoles);
    router.get('/users/current', apiSecurity.middleware.populateUser(), getCurrentUser);
    router.put('/users/current/password', apiSecurity.middleware.populateUser(), changeCurrentPassword);
    router.put('/users/current/email', apiSecurity.middleware.populateUser(), changeCurrentEmail);
    router.put('/users/:id/password', apiSecurity.middleware.populateUser(),
        apiSecurity.middleware.onlyAdministrator(), changePasswordAdministrator);
    router.delete('/users/:id', apiSecurity.middleware.populateUser(),
        apiSecurity.middleware.onlyAdministrator(), removeUserAdministrator);
    router.put('/users/:id', apiSecurity.middleware.populateUser(),
        apiSecurity.middleware.onlyAdministrator(), updateUser);
    router.post('/users', apiSecurity.middleware.populateUser(),
        apiSecurity.middleware.onlyAdministrator(), createUserAdministrator);

    return router;
}

