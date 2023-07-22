const asyncHandler = require("express-async-handler");
var { GRAPH_ME_ENDPOINT } = require('../authConfig');
var fetch = require('../fetch');

exports.id = asyncHandler(async (req, res, next) => {
    res.render('id', { 
        title: 'Educatie Team Manager (etm)',
        idTokenClaims: req.session.account.idTokenClaims,
        isAuthenticated: req.session.isAuthenticated,
        name: req.session.account?.name, 
    });
});

exports.profile = asyncHandler(async (req, res, next) => {
    try {
        const graphResponse = await fetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
        console.log(graphResponse);
        res.render('profile', { 
            title: 'Educatie Team Manager (etm)',
            profile: graphResponse,
            isAuthenticated: req.session.isAuthenticated,
            name: req.session.account?.name,
        });
    } catch (error) {
        next(error);
    }
});


