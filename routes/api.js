var express = require('express');
const apiController = require('../controllers/apiController');


const router = express.Router();

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};



router.get('/reloadteams', isAuthenticated, apiController.reloadTeams); 


module.exports = router;