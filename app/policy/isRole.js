/**
 * isRole policy
 * this check the role of the user, and send 403 if there is a error 
 * @param {*} role 
 */
module.exports = role => (req, res, next) => {
  if (req.user && req.user.role === role) {
    return next();
  }
  return res.error({
    status: 403,
    message: 'Access denied',
  });
};
