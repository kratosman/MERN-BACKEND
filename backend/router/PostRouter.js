const express = require('express')
const router = express.Router()
const PostSchema = require('../model/PostSchema')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const dir = './uploads';
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir); 
            } 
            callback(null, './uploads');
        },
        filename: function (req, file, callback ) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })
})

//get all data
router.route('/').get(async (req,res) => {
    const getAllDataCreated = await PostSchema.find({}).sort({createdAt: -1})

    try {
        res.status(200).json({
            success:'Successfully get all data from database!',
            status: getAllDataCreated
        })
    } catch (error) {
        res.status(400).json(createPost, {
            success: 'No, data found!',
            status: error
        })
    }
})

//get singleData
router.route('/:id').get(async (req,res) => {
    const { id } = req.params
    const getSingleId = await PostSchema.findOne({_id: id})
    try {
        res.status(200).json({
            success: 'Successfully get single data!',
            post: getSingleId
        })
    } catch (error) {
        res.status(400).json({
            success: 'no data!',
            status: error
        })
    }
})

// create post
router.route('/').post(upload.any(), async (req,res) => {
    const createPost = await PostSchema.create({
        name: req.body.name,
        post: req.body.post,
        image: req.files[0].filename,
        user_id: req.user.id
    })
    try {
        res.status(200).json({
            success: 'Successfully post created!',
            post: createPost
        })
    } catch (error) {
        res.status(400).json({
            success: 'Opps something went wrong!',
            status: error
        })
    }
})

//delete data
router.route('/:id').delete(async (req,res) => {
    const { id } = req.params
    const deleteSingleData = await PostSchema.findByIdAndRemove({_id: id})
    try {
        res.status(200).json({
            success: 'Successfully delete!',
            post: deleteSingleData
        })
    } catch (error) {
        res.status(400).json({
            success: 'dont delete!',
            status: error
        })
    }
})
module.exports = router