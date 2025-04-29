const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getMoneys', mid.requiresLogin, controllers.Money.getMoneys);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Money.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Money.makeMoney);

  app.post('/set', mid.requiresLogin, controllers.Money.modMoney);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = router;
