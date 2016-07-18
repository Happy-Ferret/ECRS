/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const userMapper = require('../mappers/userMapper');
const {rolesObj} = require('../models/userModel');
const userDao = require('../dao/userDao');
const logger = require('../shared/logger')('[UserService]');
const securityService = require('./core/securityService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	initialize: initialize,
	saveOrUpdateFromGithub: saveOrUpdateFromGithub
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find by username for local.
 * @param username {String} username
 * @returns {*}
 */
function findByUsernameForLocal(username) {
	return userDao.findByUsernameWithLocalHashNotNull(username);
}

/**
 * Create for local user.
 * @param userData {Object} User data
 * @returns {Promise}
 */
function createForLocal(userData) {
	return new Promise(function (resolve, reject) {
		let salt = securityService.generateSaltSync();
		securityService.generateHash(userData.password, salt).then(function (hash) {
			let userDataForBuild = {
				username: userData.username,
				email: userData.email,
				photo: null,
				role: userData.role,
				local: {
					hash: hash,
					salt: salt
				},
				github: {
					accessToken: null,
					id: null,
					profileUrl: null
				}
			};

			let user = userMapper.build(userDataForBuild);
			userDao.save(user).then(resolve, reject);
		}, reject);
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Initialize.
 * @returns {Promise}
 */
function initialize() {
	return new Promise(function (resolve, reject) {
		logger.debug('Begin initialize...');
		let userData = {
			username: 'admin',
			password: 'admin',
			role: rolesObj.admin
		};

		findByUsernameForLocal(userData.username).then(function (result) {
			if (!_.isNull(result)) {
				logger.debug('User "admin" already exist in database');
				resolve();
				return;
			}

			// Check if need another administrator
			userDao.findAllByRole(rolesObj.admin).then(function (users) {
				// Check there are users with admin role
				if (!_.isNull(users) && users.length !== 0) {
					// There are others admin
					logger.debug('Another user with admin role exists => Don\'t create a new one');
					resolve();
					return;
				}

				// Save new user
				logger.debug('Save admin user in database');
				createForLocal(userData)
					.then(function (result) {
						logger.debug('End initialize...');
						resolve(result);
					}, reject);
			}, reject);
		}, reject);
	});
}


/**
 * Save or Update from Github.
 * @param userData {Object} User data from Github
 * @returns {Promise}
 */
function saveOrUpdateFromGithub(userData) {
	return new Promise(function (resolve, reject) {
		userDao.findByGithubId(userData.githubId).then(function (result) {
			// Check if user exists in database
			if (_.isUndefined(result) || _.isNull(result)) {
				// Doesn't exists => create new one
				let userDataForBuilder = {
					username: userData.username,
					email: null,
					photo: null,
					role: rolesObj.normal,
					github: {
						id: userData.githubId,
						accessToken: userData.accessToken,
						profileUrl: userData.profileUrl
					},
					local: {
						hash: null,
						salt: null
					}
				};
				// Get email
				if (_.isUndefined(userData.emails) && _.isArray(userData.emails) && userData.emails.length !== 0) {
					userDataForBuilder.email = userData.emails[0].value;
				}
				// Get photo
				if (_.isUndefined(userData.photos) && _.isArray(userData.photos) && userData.photos.length !== 0) {
					userDataForBuilder.photo = userData.photos[0].value;
				}
				// Update result
				result = userMapper.build(userDataForBuilder);
			}
			else {
				// Already exists => need update

				// Update general data
				result.github.accessToken = userData.accessToken;
				result.github.id = userData.githubId;
				result.github.profileUrl = userData.profileUrl;

				if (_.isUndefined(userData.username) || _.isNull(userData.username)) {
					result.username = userData.username;
				}

				// Update email
				if (_.isUndefined(userData.emails) && _.isArray(userData.emails) && userData.emails.length !== 0) {
					result.email = userData.emails[0].value;
				}
				// Update photo
				if (_.isUndefined(userData.photos) && _.isArray(userData.photos) && userData.photos.length !== 0) {
					result.photo = userData.photos[0].value;
				}
			}

			// Save it in database
			userDao.save(result).then(resolve, reject);
		}, reject);
	});
}
