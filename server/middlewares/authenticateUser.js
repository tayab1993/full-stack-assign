const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { constants } = require("../helpers/constants");
 
 router.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, constants.secretKey,{
        algorithm: constants.algorithm
        
        }, function (err, decoded) {
            if (err) {
                let errordata = {
                    message: err.message,
                    expiredAt: err.expiredAt
                };
                console.log(errordata);
                res.status(403).send('Unauthorized Access');
                /*return res.status(401).json({
                    message: 'Unauthorized Access'
                });*/
            }
            req.decoded = decoded;
            console.log(decoded);
            next();
        });
    } else {
        console.log('else');
        res.status(403).send('Forbidden Access');
        /*res.send(
            status => 40.,
            message => 'Forbidden Access'
        )
        return res.status(403).json({
            message: 'Forbidden Access'
        });*/
    }
 });
 
 module.exports = router;