module.exports = function (requiredRoles = []) {
  return (req, res, next) => {
    try {
      console.log('🧠 [ROLE CHECK]', {
        tokenRole: req.userRole,
        required: requiredRoles
      });
      const userRole = req.userRole;
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ msg: '⛔ Нет доступа' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ msg: 'Ошибка авторизации', error: err.message });
    }
  };
};
