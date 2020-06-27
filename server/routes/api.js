var express = require("express");
var authRouter = require("./auth");
var couponsRouter = require("./coupons");

var app = express();

app.use("/auth/", authRouter);
app.use("/coupons/", couponsRouter);

module.exports = app;