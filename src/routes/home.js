const express = require('express');
const { renderHome, uploadImage, deleteImage, editForm, editImage } = require('../controllers/homeController');
const router = express.Router();

/* GET home page. */
router.get("/", renderHome);

router.post("/upload", uploadImage);

router.get("/delete/:id", deleteImage);

router.get("/edit/:id", editForm);

router.post("/edit/:id", editImage);


module.exports = router;
