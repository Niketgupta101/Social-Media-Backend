const express = require("express");
const routes = require('../api/routes/v1/index.js');

const app = express();

app.use(express.json());

app.use('/v1', routes);

module.exports = app;