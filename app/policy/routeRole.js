

module.exports = roleCtrl => (target, key, descriptor) => {
  const dfFn = descriptor.value;
  const handler = (req, res) => {
    const next = () => {
      dfFn(req, res);
    };
    if (roleCtrl[req.user.role]) {
      roleCtrl[req.user.role](req, res, next);
    } else if (!roleCtrl.default) {
      dfFn(req, res, next);
    }
  };
  descriptor.value = handler;
  return descriptor;
};
