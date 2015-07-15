var User = require('../db/models/user');

module.exports = {
  addUser: function (req, res, next) {
    var data = req.body;  // {username: 'myname'}
    console.log(data);
    new User({FacebookId: data.FacebookId, username: data.username})
      .fetch()
      .then(function (found) {
        if (found) {
          res.send(found);
        } else {
          var newUser = new User({FacebookId: data.FacebookId, username: data.username});
          newUser.save()
            .then(function (created) {
              res.send(created);
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  getInfoForUser: function(req, res, next) {
    var username = req.params.username;

    new User({username: username})
      .fetch({
        withRelated: ['requests', 'photos']
      })
      .then(function (found) {
        if (found) {
          res.send(found);
        } else {
          res.send('User not found!');
        }
      });
  }

};