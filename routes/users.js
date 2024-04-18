const express = require('express');
const router = express.Router();

//Schema calling
const User = require('../models/user');

//Get the registeration form
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Saving userdata
router.post('/register', async(req, res) => {
    res.send(req.body);
})

module.exports = router;