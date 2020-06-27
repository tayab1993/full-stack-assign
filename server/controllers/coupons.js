const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const { constants } = require("../helpers/constants");
const stripe = require('stripe')(constants.stripe.apiKey);

/**
 * get all coupons from API.
 * @returns {Object}
 */
exports.getAll = [
	(req, res) => {
        console.log('in get aall');
        stripe.coupons.list(
            //{limit: 3},
            function(err, coupons) {
                console.log(coupons);
                return apiResponse.successResponseWithData(res,"get success.", coupons);
            }
          );
    }
];

/**
 * create a coupon.
 * @param {number}      percent_off
 * @param {string}      duration
 * @param {number}      duration_in_months
 * @param {string}      name
 * @returns {Object}
 */
exports.createCoupon = [
    // Validate fields.
	body("percent_off").isLength({ min: 1 }).trim().withMessage("Percentage off must be specified."),
	body("duration").isLength({ min: 1 }).trim().withMessage("Duration must be specified."),
	body("couponName").isLength({ min: 1 }).trim().withMessage("Coupon name must be specified."),
	// Sanitize fields.
	sanitizeBody("percent_off").escape(),
	sanitizeBody("duration").escape(),
	sanitizeBody("couponName").escape(),
	// Process request after validation and sanitization.
    (req, res) => {
        console.log('in creating coupon');
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Display sanitized values/errors messages.
            return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
        }else {
            if(req.body.duration === 'once' || req.body.duration === 'repeating' || req.body.duration === 'forever') {
                if(req.body.duration !== 'once' && !req.body.duration_in_months) {
                    console.log('in if');
                    return apiResponse.ErrorResponse(res, "duration_in_months must be specified");
                }
                else {
                    console.log('in else');
                    if(req.body.duration === 'once') {
                        console.log('in if 2nd');
                        stripe.coupons.create({
                            percent_off: req.body.percent_off,
                            duration: req.body.duration,
                            name: req.body.couponName
                        },
                        function(err, coupon) {
                            if(err) console.log(err);
                            console.log(coupon);
                            return apiResponse.successResponseWithData(res,"Create coupon success.", coupon);  
                        });
                    }
                    else {
                        stripe.coupons.create({
                            percent_off: req.body.percent_off,
                            duration: req.body.duration,
                            duration_in_months: req.body.duration_in_months,
                            name: req.body.couponName
                        },
                        function(err, coupon) {
                            if(err) console.log(err);
                            console.log(coupon);
                            return apiResponse.successResponseWithData(res,"Create coupon success.", coupon);  
                        });
                    }
                }
            }
            else return apiResponse.ErrorResponse(res, "duration must be once, repeating or forever");
        }
    }
];

/**
 * delete a coupon using id.
 * @param {string}      coupon_id
 * @returns {Object}
 */
exports.deleteCoupon = [
    // Validate fields.
    body("coupon_id").isLength({ min: 1 }).trim().withMessage("coupon_id must be specified."),
	// Sanitize fields.
	sanitizeBody("coupon_id").escape(),
	// Process request after validation and sanitization.
    (req, res) => {
        console.log('in delete coupon');
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Display sanitized values/errors messages.
            return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
        }else {
        console.log('in delete coupon');
            stripe.coupons.del(
                req.body.coupon_id,//'co_1GxyEE2eZvKYlo2CZ08ca0bA',
                function(err, confirmation) {
                    if (err) {
                        console.log(err.raw.message);
                        return apiResponse.notFoundResponse(res, err.raw.message);
                    }
                    console.log(confirmation);
                    return apiResponse.successResponseWithData(res,"Delete coupon success.", confirmation); 
                }
            );
        }
    }
];

function apiCall(data){

}