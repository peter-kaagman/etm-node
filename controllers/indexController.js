const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
  res.render('index', {
    title: 'Educatie Team Manager (etm)',
    isAuthenticated: req.session.isAuthenticated,
    name: req.session.account?.name,
  });
});

exports.teams = asyncHandler(async (req, res, next) => {
  res.render('teamlist', { 
      title: 'Educatie Team Manager (etm)',
      //teams: graphResponse,
      isAuthenticated: req.session.isAuthenticated,
      name: req.session.account?.name,
  });
});
