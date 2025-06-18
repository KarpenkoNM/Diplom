const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      car_brand: user.car_brand,
      car_model: user.car_model,
      car_year: user.car_year,
      engine: user.engine,
      suspension: user.suspension,
      aero: user.aero,
      interior: user.interior
    });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка при получении профиля' });
  }
};

exports.updateProfile = async (req, res) => {
    const {
      name, email, car_brand, car_model, car_year,
      engine, suspension, aero, interior
    } = req.body;
  
    try {
      const user = await User.findByPk(req.userId);
      if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });
  
      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.car_brand = car_brand ?? user.car_brand;
      user.car_model = car_model ?? user.car_model;
      user.car_year = car_year ?? user.car_year;
      user.engine = engine ?? user.engine;
      user.suspension = suspension ?? user.suspension;
      user.aero = aero ?? user.aero;
      user.interior = interior ?? user.interior;
  
      await user.save();
  
      res.json({ msg: 'Профиль обновлён', user });
    } catch (err) {
      res.status(500).json({ msg: 'Ошибка при обновлении профиля', error: err.message });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: 'Файл не загружен' });
  
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
  
      // Обновляем путь к аватару пользователя
      await User.update(
        { avatar: avatarPath },
        { where: { id: req.userId } }
      );
  
      res.json({ msg: 'Аватар обновлён!', avatar: avatarPath });
    } catch (err) {
      console.error('Ошибка при обновлении аватара:', err);
      res.status(500).json({ msg: 'Ошибка сервера' });
    }
};

exports.updateSetup = async (req, res) => {
  const {
    car_brand,
    car_model,
    car_year,
    engine,
    suspension,
    aero,
    interior
  } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

    // Обновляем только указанные поля
    user.car_brand = car_brand ?? user.car_brand;
    user.car_model = car_model ?? user.car_model;
    user.car_year = car_year ?? user.car_year;
    user.engine = engine ?? user.engine;
    user.suspension = suspension ?? user.suspension;
    user.aero = aero ?? user.aero;
    user.interior = interior ?? user.interior;

    await user.save();

    res.json({ msg: 'Сетап обновлён', setup: {
      car_brand: user.car_brand,
      car_model: user.car_model,
      car_year: user.car_year,
      engine: user.engine,
      suspension: user.suspension,
      aero: user.aero,
      interior: user.interior
    }});
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка при обновлении сетапа', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Старый пароль неверен' });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ msg: 'Пароль обновлён!' });
  } catch (err) {
    res.status(500).json({ msg: 'Ошибка сервера', error: err.message });
  }
};