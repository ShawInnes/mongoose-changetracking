import mongoose from 'mongoose';
import MongooseVersion from 'mongoose-version2';
import MongooseSequence from 'mongoose-sequence';

var Schema = mongoose.Schema;
var _ = require('lodash');
var moment = require('moment');

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb');
});
mongoose.connect('mongodb://localhost/mongoose-version');

var PageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  path: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  tags: [String]
});

PageSchema.plugin(MongooseVersion);
PageSchema.plugin(MongooseSequence, { id: 'comment_seq', inc_field: 'commentNumber', reference_fields: ['user'] });

var Page = mongoose.model('Page', PageSchema);

var p1 = new Page({
  title: 'Page one',
  content: 'Lorem ipsum dolor sit amet',
  user: 'user1',
  path: '/page-one',
}).save().then((doc) => {
  console.log('created ' + doc._id);
}).catch((err) => {
  console.log('error ' + err.errmsg);
});

var p2 = new Page({
  title: 'Page two',
  content: 'Lorem ipsum dolor sit amet',
  user: 'user1',
  path: '/page-two',
}).save().then((doc) => {
  console.log('created ' + doc._id);
}).catch((err) => {
  console.log('error ' + err.errmsg);
});

var p3 = new Page({
  title: 'Page three',
  content: 'Lorem ipsum dolor sit amet',
  user: 'user2',
  path: '/page-three',
}).save().then((doc) => {
  console.log('created ' + doc._id);
}).catch((err) => {
  console.log('error ' + err.errmsg);
});

Page.findOne({ path: /^\/page-one/ }, function (err, result) {
  if (err) {
    console.log('error retrieving document');
    return;
  }

  result.content = result.content.toUpperCase();
  result.content = result.content + ' appended text';

  if (result.isModified()) {
    console.log('document is modified, saving');
    result.save();
  } else {
    console.log('it\'s okay, nothing really changed so I won\'t save');
  }
});

Page.findOne({ path: /^\/page-two/ }, function (err, result) {
  if (err) {
    console.log('error retrieving document');
    return;
  }

  result.content = result.content + ' appended text';
  if (result.isModified()) {
    console.log('document is modified, saving');
    result.save();
  } else {
    console.log('it\'s okay, nothing really changed so I won\'t save');
  }
});

var PageVersions = Page.VersionModel;

PageVersions.find({  }, function (err, results) {
  _.each(_.orderBy(results, ['doc.path', 'doc._v'], ['asc', 'asc']), function (item) {
    console.log('document version ', item.doc.path, item.doc._id, item.doc._v, item.doc.tags);
  });
});
