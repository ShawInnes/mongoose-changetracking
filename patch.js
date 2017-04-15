import mongoose, { Schema } from 'mongoose'
import patchHistory from 'mongoose-patch-history'

import * as _ from 'underscore';

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb');
});
mongoose.connect('mongodb://localhost/mongoose-patch');

var PageSchema = new Schema({
  title : { type : String, required : true},
  content : { type : String, required : true },
  path : { type : String, required : true},
  tags : [String]
});

PageSchema.plugin(patchHistory, { mongoose, name: 'pagePatches' });
var Page = mongoose.model('Page', PageSchema);

/*
var p1 = new Page({
  title: 'Page one',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  path: '/page-one'
});

p1.save();
*/

Page.findOne({ path: /^\/page-one/ }, function (err, result) {
  result.tags = ['tag1', 'tag2'];

  console.log('find', result);
  // result.save();

  result.patches.find({ ref: result.id })
  .then(console.log);
});
