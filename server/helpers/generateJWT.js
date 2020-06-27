let jwt = require('jsonwebtoken');
const { constants } = require("./constants");

exports.generateToken = function (data) {
	const jwtData = {
		expiresIn: constants.expiresIn,
	};
	const secret = constants.secretKey;
	//Generated JWT token with Payload and secret.
	let token = jwt.sign(data, secret, jwtData);

    /*let token = jwt.sign(data, constants.secretKey, {
        algorithm: constants.algorithm,
        expiresIn: constants.expiresIn
    });*/
	return token;
};