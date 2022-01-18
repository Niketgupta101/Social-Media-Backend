const express = require("express");
const routes = require('../api/routes/v1/index.js');
const errorHandler = require('../api/middlewares/error');

const app = express();

app.use(express.json());

app.use('/v1', routes);

app.use(errorHandler);

app.use(function (req, res, next) {
    res.status(404).send("Error 404 : Page not found.");
})

module.exports = app;