// Define routes for simple signup web app. 
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
app.use(express.urlencoded());

app.get('/', function(request, response) {
  var buf = fs.readFileSync("index.html");
  response.send(buf.toString("utf-8"));
});

app.post('/add-user', function(request, response) {
  var user      = request.body.user;
  console.log(user);
  addUser(user, function(err) {
    if (err) {
      response.send(err);
    } else {
      response.send('User saved successfully')
    }
  });
});

// sync the database and start the server
db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});

// add user to the database if it doesn't already exist
var addUser = function(user, callback) {
  var UserInfo = global.db.UserInfo;
  // find if user has already been added to our database
  UserInfo.find({where: {email: user.email}}).success(function(userInstance) {
    if (userInstance) {
      // user already exists, do nothing
      callback();
    } else {
      // build instance and save
        var newUserInstance = UserInfo.build({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      });
        newUserInstance.save().success(function() {
        callback();
      }).error(function(err) {
        callback(err);
      });
    }
  });
};
