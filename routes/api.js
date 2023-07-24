var express = require('express');
const apiController = require('../controllers/apiController');


const router = express.Router();

// custom middleware to check auth state
function isAuthorized(req, res, next) {
    if (!req.session.isAuthorized) {
        return res.redirect('/api/notauthed'); // redirect to sign-in route
    }

    next();
};



router.get('/reloadteams', isAuthorized, apiController.reloadTeams); 
router.post('/sendmessage', isAuthorized, apiController.sendMessage); 
router.get('/notauthed', apiController.notAuthorized); 


module.exports = router;