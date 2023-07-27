const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req, res, next) => {
  console.log(req.session);
  res.render('index', {
    title: 'Educatie Team Manager (etm)',
    isAuthorized: req.session.isAuthorized,
    name: req.session.account?.name,
  });
});

exports.teams = asyncHandler(async (req, res, next) => {
  res.render('teamlist', { 
      title: 'Educatie Team Manager (etm)',
      //teams: graphResponse,
      isAuthorized: req.session.isAuthorized,
      name: req.session.account?.name,
  });
});
