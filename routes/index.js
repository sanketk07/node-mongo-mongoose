var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

//Just define the layouthere
var userDataSchema = new Schema({
    title: {type: String, required: true},
    content: String,
    author: String
}, {collection: 'user-data'});
//the additional object will help overwrite the collection name in plural form


//creation of actual model to instantiate and to actually write data to the database
//by default, its stored in tthe plural form of the name specified. Eg, Userdatas here. 
//To avoid that, add additional options while defining the layout. Eg, collection above in line 12
//Setup one for each collection in the database
var UserData = mongoose.model('UserData', userDataSchema);

var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  	
    UserData.find()
      .then(function(doc){
          res.render('index', {items: doc});
      });
  	
});

router.post('/insert', function(req, res, next) {
   var item = {
   	 title: req.body.title,
   	 content: req.body.content,
   	 author: req.body.author
   };
   
   var data = new UserData(item);
   data.save();

   res.redirect('/');


});

router.post('/update', function(req, res, next) {

   	var id = req.body.id;

    UserData.findById(id, function(err, doc){
        if(err){
            console.log('error, no entry found');
        }
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.author = req.body.author;
        doc.save();

    }); 
    res.redirect('/');	
});

router.post('/delete', function(req, res, next) {
  
  	var id = req.body.id;

    UserData.findByIdAndRemove(id).exec();

   	res.redirect('/');
});

module.exports = router;
