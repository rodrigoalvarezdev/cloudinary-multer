const {Router} = require('express');
const Photo = require('../models/photo.models');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const router = Router();

router.get('/images', async (req, res)=>{
    const photos = await Photo.find().lean();
    res.render('images', {photos});
});

router.get('/images/add', async (req, res)=>{
    const photos = await Photo.find().lean();
    res.render('image-form', {photos});
});

router.post('/images/add', async (req, res)=>{
    const {title, description} = req.body;
    console.log(req.file)
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    const newPhoto = new Photo({
        title,
        description,
        imageURL: result.url,
        public_id: result.public_id
    });
    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/images');
});

router.get('/images/delete/:photo_id', async (req, res)=>{
    const {photo_id} = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id);
    const result = await cloudinary.v2.uploader.destroy(photo.public_id);
    res.redirect('/images/add');
})

module.exports = router;