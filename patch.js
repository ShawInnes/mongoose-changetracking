import mongoose, { Schema } from 'mongoose'
import patchHistory from 'mongoose-patch-history'
import AutoIncrement from 'mongoose-sequence';

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
  user : { type : String, required : true},
  tags : [String]
});

PageSchema.plugin(patchHistory, { mongoose, name: 'pagePatches' });

PageSchema.plugin(AutoIncrement, { id: 'comment_seq', inc_field: 'comments', reference_fields: ['user'] });

var Page = mongoose.model('Page', PageSchema);

var p1 = new Page({
  title: 'Page one',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  path: '/page-one',
  user: 'shaw'
}).save();

var p2 = new Page({
  title: 'Page Two',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  path: '/page-two',
  user: 'shaw'
}).save();

var p3 = new Page({
  title: 'Page Three',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  path: '/page-three',
  user: 'fred'
}).save();

Page.find({ }, function (err, results) {
  console.log('find', results);
  _.each(results, (item) => {
    console.log(item.title);
  });
});
