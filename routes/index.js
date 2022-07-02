let express = require('express');
let router = express.Router();
let User = require('../models/member');
let Message = require('../models/message');
let bcrypt = require('bcryptjs');
const passport = require('passport');
const app = require('../app');

// get home page
router.get('/', function(req, res, next) {
  Message.find()
    .sort([['timestamp', 'ascending']])
    .exec((err, messages) => {
      if (err) {return next(err)}
      res.render('index', {title: "Members' Board", user: req.user, messages: messages})
    })
});
// get sign up page
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up', {title: "Sign-Up"})
})
// get create message page
router.get('/create-message', (req, res, next) => {
  res.render('create-message', {title: "Create New Message", user: req.user})
})
// get membership
router.get('/member', (req, res, next) => {
  res.render('member', {title: 'Authorize Member', user: req.user})
})
// get admin
router.get('/admin', (req, res, next) => {
  res.render('admin', {title: 'Authorize Admin', user: req.user})
})
// post sign up
router.post('/sign-up', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {return next(err)}
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name, 
      username: req.body.username,
      password: hashedPassword,
      membership_status: false,
      admin_status: false
    }).save(err => {
      if (err) {return next(err)}
      res.redirect('/')
    })
  })
})
// post log in
router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
}))
// post create message
router.post('/create-message', (req, res, next) => {
  const message = new Message({
    title: req.body.title, 
    timestamp: new Date(),
    message: req.body.message,
    author: req.user.username
  }).save(err => {
    if (err) {return next(err)}
    res.redirect('/')
  })
})
// post membership
router.post('/member', (req, res, next) => {
  if (req.body.member_pass !== 'memberpass') {
    res.redirect('/member', {title: 'Authorize Member'})
  }
  else if (req.body.member_pass === 'memberpass') {
    User.findByIdAndUpdate(req.user._id, {membership_status: true}, err => {
      if (err) {return next(err)}
      res.redirect('/')
    })
  }
})
// post admin
router.post('/admin', (req, res, next) => {
  if (req.body.admin_pass !== 'adminpass') {
    res.redirect('/admin', {title: 'Authorize Admin'})
  }
  else if (req.body.admin_pass === 'adminpass') {
    User.findByIdAndUpdate(req.user._id, {admin_status: true}, err => {
      if (err) {return next(err)}
      res.redirect('/')
    })
  }
})
// post delete message
router.post('/delete', (req, res, next) => {
  Message.findByIdAndRemove(req.body.message_id, (err) => {
    if (err) {return next(err)}
    res.redirect('/')
  })
})
// log out
router.get('/log-out', (req, res) => {
  req.logout((err) => {
    if (err) {return next(err)}
    res.redirect('/')
  })
})

module.exports = router;
