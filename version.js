var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var version = require('mongoose-version2');
var _ = require('underscore');

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb');
});
mongoose.connect('mongodb://localhost/mongoose-version');


var PageSchema = new Schema({
  title : { type : String, required : true},
  content : { type : String, required : true },
  path : { type : String, required : true},
  tags : [String],

  lastModified : Date,
  created : Date
});

PageSchema.plugin(version);

var Page = mongoose.model('Page', PageSchema);

/*
var p1 = new Page({
  title: 'Page one',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  path: '/page-one'
}).save();
*/

Page.findOne({ path: /^\/page-one/ }, function (err, result) {
  console.log('result.modified', result.isModified());
  result.tags = ['tag1', 'tag2'];
  result.content = result.content.toUpperCase();
  console.log('result.modified', result.isModified());
  if (result.isModified()) {
    console.log('document is modified, saving');
    result.save();
  }
});

var PageVersions = Page.VersionModel;
//console.log(prevVersions);
PageVersions.find({  }, function (err, results) {
  _.each(results, function (item) {
    console.log(item.doc._id, item.doc._v, item.doc.tags);
  });
});
