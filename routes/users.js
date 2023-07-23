/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();

var fetch = require('../fetch');
const userController = require("../controllers/userController");


// custom middleware to check auth state
function isAuthorized(req, res, next) {
    if (!req.session.isAuthorized) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.get('/id', isAuthorized, userController.id);

router.get('/profile', isAuthorized, userController.profile);

module.exports = router;