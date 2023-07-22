/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController");

router.get('/', indexController.index); 
router.get('/teams', indexController.teams); 


module.exports = router;