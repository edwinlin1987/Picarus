var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : '',
    port    : 5432,
    password : '',
    database : 'picarus',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);
db.plugin('registry');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('FacebookId', 100).unique();
      user.string('username', 100);
      user.integer('karma', 11).defaultTo(0);
      user.timestamps();
    }).then(function(table) {
      console.log('Created users table');
    });
  }
});

db.knex.schema.hasTable('requests').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('requests', function (request) {
      request.increments('id').primary();
      request.string('text', 255);
      request.integer('likes', 11).defaultTo(0);
      request.integer('user_id').unsigned();
      request.timestamps();
    }).then(function(table) {
      console.log('Created requests table');
    });
  }
});

db.knex.schema.hasTable('photos').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('photos', function (photo) {
      photo.increments('id').primary();
      photo.string('filename', 100);
      photo.string('filetype', 100);
      photo.string('username', 100);
      photo.string('description', 100);
      photo.integer('likes', 11).defaultTo(0);
      photo.integer('user_id').unsigned();
      photo.integer('request_id').unsigned();
      photo.timestamps();
    }).then(function(table) {
      console.log('Created photos table');
    });
  }
});

db.knex.schema.hasTable('comments').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('comments', function (comment) {
      comment.increments('id').primary();
      comment.string('text', 255);
      comment.string('username', 100);
      comment.integer('likes', 11).defaultTo(0);
      comment.integer('user_id').unsigned();
      comment.integer('photo_id').unsigned();
      comment.timestamps();
    }).then(function(table) {
      console.log('Created comments table');
    });
  }
});

db.knex.schema.hasTable('tags').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('tags', function(tag) {
      tag.increments('id').primary();
      tag.string('tagname', 60).unique();
      tag.integer('photos_count', 11).defaultTo(0);
    }).then(function(table) {
      console.log('Created tags table');
    });
  }
});

db.knex.schema.hasTable('photos_tags').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('photos_tags', function(photo_tag) {
      photo_tag.increments('id').primary();
      photo_tag.integer('photo_id');
      photo_tag.integer('tag_id');
    }).then(function(table) {
      console.log('Created photos_tags table');

      // db triggers on photo like
      var trigFunc = "CREATE FUNCTION incer() RETURNS trigger AS $$ \nBEGIN \n UPDATE users SET karma = karma+1 WHERE id = NEW.user_id; \nRETURN NULL; \n END; \n $$ LANGUAGE plpgsql;";

      db.knex.raw(trigFunc)
      .then(function(response){
        console.log('defined incer()');

        // create trigger itself AFTER creating its function
        var trigger = "CREATE TRIGGER bumpKarma AFTER UPDATE OF likes ON photos FOR EACH ROW EXECUTE PROCEDURE incer();";

        db.knex.raw("CREATE TRIGGER bumpKarma AFTER UPDATE OF likes ON photos FOR EACH ROW EXECUTE PROCEDURE incer();")
        .then(function(response){
          console.log('defined bumpKarma trigger');
        });
      });

    });
  }
});

db.knex.schema.hasTable('requests_tags').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('requests_tags', function(request_tag) {
      request_tag.increments('id').primary();
      request_tag.integer('request_id');
      request_tag.integer('tag_id');
    }).then(function(table) {
      console.log('Created requests_tags table');
    });
  }
});


db.knex.schema.hasTable('users_liked_photos').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_liked_photos', function(user_liked_photo) {
      user_liked_photo.increments('id').primary();
      user_liked_photo.integer('user_id');
      user_liked_photo.integer('photo_id');
    }).then(function(table) {
      console.log('Created user_liked_photo table');
    });
  }
});


db.knex.schema.hasTable('users_liked_photos').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users_liked_photos', function(user_liked_photo) {
      user_liked_photo.increments('id').primary();
      user_liked_photo.integer('user_id');
      user_liked_photo.integer('photo_id');
    }).then(function(table) {
      console.log('Created user_liked_photo table');
    });
  }
});

// create users_liked_requests join table




module.exports = db;