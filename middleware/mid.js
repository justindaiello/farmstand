//custom middleware

//prevent logged in users from accessing a route such as the log in or sign up page
const loggedOut = (req, res, next) => {
  if (req.session && req.session.userId) {
  return res.redirect('/shop');
  }
  return next();
}

const requiresLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
   return next();
 } else {
   const err = new Error('You must be logged in to view this page.');
   err.status = 401;
   return next(err);
 }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
