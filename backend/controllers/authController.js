// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../index');

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = createToken(user);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ msg: 'Регистрация успешна', user: { id: user.id, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка регистрации', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Неверный пароль' });

    const token = createToken(user);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 86400000
      })
      .json({ msg: 'Вход выполнен', user: { id: user.id, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка входа', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token').json({ msg: 'Выход выполнен' });
};

