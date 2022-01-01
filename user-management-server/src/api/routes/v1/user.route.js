const express = require("express");
const controller = require("../../controllers/user.controller");
const router = express.Router();

router.get('/:id', controller.fetchUser);

router.put('/:id', controller.editUser);

router.get('/', controller.searchUsers);


module.exports = router;