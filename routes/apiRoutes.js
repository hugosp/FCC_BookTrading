const express   = require('express');
const jwt       = require('jsonwebtoken');
const validator = require('validator');
const bCrypt    = require('bcrypt-nodejs');
const Book      = require('../models/book');
const gBooks    = require('google-books-search');


const apiRoutes = express.Router(); 

module.exports = function(app,User) {

    apiRoutes.post('/authenticate', function(req, res) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.status(401).json({ success: false, message: 'Authentication failed. Email not found.' });
            } else if (user) {
                if (!bCrypt.compareSync(req.body.password, user.password)) {
                    res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    var token = jwt.sign({id:user._id,user:user.name,email:user.email}, app.get('superSecret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }		
            }
        });
    });

    apiRoutes.post('/signup', function(req, res) {
        let validationResult = validateSignupForm(req.body);
        if (!validationResult.success) {
            res.status(400).json({ success: false, message: validationResult.message });
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null) //createHash(req.body.password)
            });
            newUser.save(function(err){
                if(err) { throw err; }
            });
            res.status(200).json({ success: true, message: 'You have successfully signed up! Now you should be able to log in.' });
        }
});

    // route middleware to authenticate and check token
    apiRoutes.use(function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
                if (err) {
                    return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });		
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;	
                    next();
                }
            });
        } else {
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.'
            });
        }
    });


    // -------------------------------------- authenticated routes --------------------------------------


    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'User logged in and has JWT-Token' });
    });

    apiRoutes.get('/profile', function(req, res) {
        res.json(req.decoded);
    });


    apiRoutes.get('/books/all', function(req, res) {
        Book.find({}, function(err, books) {
            if(err) {
                res.status(400).json({success: false,message:'error getting books'});
            } else {
                res.status(200).json({success: true,books:books});
            }
        });
    });

    apiRoutes.get('/books/my', function(req, res) {
        Book.find({owner:req.decoded.id}, function(err, books) {
            if(err) {
                res.status(400).json({success: false,message:'error getting books'});
            } else {
                res.status(200).json({success: true,books:books});
            }
        });
    });

    apiRoutes.get('/books/delete', function(req, res) {
        console.log(req.query.id);
        Book.findByIdAndRemove(req.query.id, function(err) {
            if(err) {
                res.status(400).json({success: false,message:'error deleting book'});
            } else {
                res.status(200).json({success: true,message: 'Book Deleted'});
            }
        });
    });

    apiRoutes.get('/books/add', function(req, res) {
        let q = req.query;
        let newBook = new Book({
            title:      q.title,
            subTitle:   q.subtitle,
            url:        q.link,
            googleId:   q.id, 
            author:     q.authors,
            thumbnail:  q.thumbnail,
            owner:      req.decoded.id,
            tradeReq:   null,
            traded:     false
        });
        newBook.save(function(err) {
            if(err) {
                res.status(400).json({success: false,message:'error adding book'});
            } else {
                res.status(200).json({success: true,message:'added book'});
            }
        });
    });

    apiRoutes.get('/books/search', function(req, res) {
        let query = req.query.q;
        if(query) {
            gBooks.search(query,function(err,result) {
                if (err) throw err;
                res.status(200).json({success: true,result:result});
            });
        } else {
            res.status(400).json({success: false,message:'no search query'});
        }
    });

    



// -------------------------------------- authenticated routes --------------------------------------
 
    app.use('/api', apiRoutes);

}


    

function validateSignupForm(payload) {
  let isFormValid = true;
  let message = '';

  if (!payload.email || !validator.isEmail(payload.email)) {
    isFormValid = false;
    message = "Please provide a correct email address.";
  }

  if (!payload.password || !validator.isLength(payload.password, 8)) {
    isFormValid = false;
    message = "Password must have at least 8 characters.";
  }

  if (!payload.name || payload.name.trim().length === 0) {
    isFormValid = false;
    message = "Please provide your name.";
  }

  return {
    success: isFormValid,
    message: message,
  };
}