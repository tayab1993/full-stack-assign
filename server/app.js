const express = require("express");
const apiRouter = require("./routes/api");
const cors = require("cors");
const { constants } = require("./helpers/constants");

const port = constants.port;
let app = express();

try {
    app.use(cors());
    app.use(express.json());
    app.use("/api/", apiRouter);
    app.use((err, req, res) => {
        if(err.name == "UnauthorizedError"){
            return apiResponse.unauthorizedResponse(res, err.message);
        }
    });

    app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });
} catch(error) {
    console.error(error.message, {
        stack: error.stack,
        name: error.name
    });
}

module.exports = app;