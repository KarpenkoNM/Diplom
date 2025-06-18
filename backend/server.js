const app = require('./app');
const { sequelize } = require('./index'); // подключаем инициализированную базу

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ БД подключена');
    app.listen(PORT, () => console.log(`🚀 Сервер стартанул на порту ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к БД:', err);
  });
