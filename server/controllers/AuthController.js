const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require('../db/db');
const generateJWT = require("../helpers/generateJWT");

/**
 * User signup.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.signup = [
	// Validate fields.
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified."),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			console.log('in here');
			console.log(req.body);
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//hash input password
				bcrypt.hash(req.body.password,10,function(err, hash) {
					// Create User object with escaped and trimmed data
					sql.query('SELECT *FROM users WHERE email = ?', [req.body.email], function (error, user, fields) {
						if (error) return apiResponse.ErrorResponse(res, error);

						if (user && user.length > 0) return apiResponse.ErrorResponse(res, "E-mail already in use"); 

						let userData = {
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							password: hash
						};
						// Save user.
						sql.query('INSERT INTO users SET ?', userData, function (error, user, fields) {
							if (error) return apiResponse.ErrorResponse(res, error);
	
							console.log(user.insertId);
							userData = {
								id: user.insertId,
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								email: req.body.email
							};
							//Prepare JWT token for authentication
							userData.jwt_token = generateJWT.generateToken(userData);
							console.log(userData);
							insertJWT(user.insertId, userData.jwt_token);
							return apiResponse.successResponseWithData(res,"Registration Success.", userData);
						});
					});
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			console.log(req.body);
			console.log('in lofgin');
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				console.log(req.body);
				sql.query('SELECT * FROM users WHERE email=?', [req.body.email], function (error, user, fields) {
					if (error) return apiResponse.ErrorResponse(res, error);
					
					if (user && user.length > 0) {
						user = user[0];
						bcrypt.compare(req.body.password,user.password,function (err,same) {
							if(same){
                                let userData = {
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
								};
								//Prepare JWT token for authentication
                                userData.jwt_token = generateJWT.generateToken(userData);
								console.log(userData);
								insertJWT(user.id, userData.jwt_token);
                                return apiResponse.successResponseWithData(res,"Login Success.", userData);
							}else{
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					}else{
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

	exports.logout = [
		(req, res) => {
			console.log(req.decoded);
			sql.query('UPDATE users SET jwt_token = ? WHERE id = ?', ['', req.decoded.id], function (error, user, fields) {
				if (error) return apiResponse.ErrorResponse(res, error);
	
				return apiResponse.successResponseWithData(res,"Logout Success.", true);
			});
	}];

	function insertJWT(id, token){
		console.log('in insertJWT');
		// Save user.
		sql.query('UPDATE users SET jwt_token = ? WHERE id = ?', [token, id], function (error, user, fields) {
			if (error) return apiResponse.ErrorResponse(res, error);

			return true;
		});
	}