const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AuthSchema = require('../model/AuthSchema')
const router = express.Router()

//get USER
router.route('/').get(async (req, res) => {
    const getUser = await AuthSchema.find({}).sort({createdAt: -1})
    try {
        res.status(200).json({
            success: 'All data from database',
            getUser: getUser
        })
    } catch (error) {
        res.status(400).json({
            success: 'no data found',
            status: false
        })
    }
})
//LOGIN
router.route('/login').post(async (req, res) => {
    const User = await bcrypt.compare(req.body.username)
    const isPasswordHash = await bcrypt.compare(req.body.password, User.password)
    try {
        if ( req.body && req.body.username && req.body.password) {
            AuthSchema.find({ username: req.body.username}, (err, data) => {
                if (data.length > 0) {
                    if (isPasswordHash) {
                        let token = jwt.sign({ User }, 'secret123');
                        return res.status(200).json({ title: 'ok', user:token})
                    } else {
                        return res.status(400).json({ title: 'error', user: false})
                    }
                } else {
                    res.status(400).json({
                        msg: 'Username or Password is Incorrect!',
                        status : false 
                    })
                }
            })
        } else {
            res.status(400).json({
                msg: 'Fill all the fields!',
                status: false
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: 'Opps!, Something went wrong!',
            status: false
        })
    }
})

//REGISTER
router.route('/register').post(async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    
    try {
        if ( req.body && req.body.username && req.body.password) {
            AuthSchema.find({ username: req.body.username}, (err, data) => {
                if (data.length == 0) {
                    let User = new AuthSchema({
                        username: req.body.username, 
                        password: hashPassword
                    });
                    User.save((err, data) => {
                        if( err) {
                            res.status(400).json({
                                msg: err,
                                status: false
                            });
                        } else {
                            res.status(200).json({
                                status: true,
                                title: 'Registered Successfully.'
                            })
                        } 
                    })
                } else {
                    res.status(400).json({
                        msg: `Username ${req.body.username} Already Exist!`,
                        status : false 
                    })
                }
            })
        } else {
            res.status(400).json({
                msg: 'Fill all the fields!',
                status: false
            })
        }
    } catch(error) {
        res.status(400).json({
            msg: 'Opps!, Something went wrong!',
            status: false
        })
    }
})

module.exports = router