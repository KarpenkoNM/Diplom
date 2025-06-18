const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateAvatar, updateSetup, updatePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../models/User');


router.post('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile/update', authMiddleware, updateProfile);
router.patch('/setup', authMiddleware, updateSetup);
router.patch('/password', authMiddleware, updatePassword);
router.patch('/me', authMiddleware, updateProfile);
router.patch('/me/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(404).json({ msg: 'Не найден' });
  res.json({ 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    avatar: user.avatar, 
    role: user.role,
    car: {
      brand: user.car_brand || '',
      model: user.car_model || '',
      year: user.car_year || ''
    },
    setup: {
      engine: user.engine || 'Стоковая деталь',
      suspension: user.suspension || 'Стоковая деталь',
      aero: user.aero || 'Стоковая деталь',
      interior: user.interior || 'Стоковая деталь'
    }
  });
});

module.exports = router;
