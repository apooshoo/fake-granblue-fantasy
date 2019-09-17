module.exports = (app, db) => {

  const granblue = require('./controllers/granblue')(db);

  app.post('/characters/new', granblue.add);
  app.post('/characters/editSlot', granblue.editSlot);
  app.get('/characters/:id', granblue.getUsersCharacters);
  app.get('/characters', granblue.getAll);

  app.post('/users/login', granblue.login);
  app.post('/users/register', granblue.register);

};