const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const Img = require("../models/Img");

// establecer como se guardaran las imagenes y donde se guardaran
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/uploads'));
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname);
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
    }
});

// "single("image")" para indicar que es el archivo del input con el "name" "image"
// definir el tamaño maximo fileSize: 5000000 = 5MB
// fileFilter para para que archivos con admitidos
const upload = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        // definir el tipo de archivos que se aceptan
        const fileTypes = /jpeg|jpg|png|gif/;

        // saber el mimeType del archivo
        const mimeType = fileTypes.test(file.mimetype);

        // saber el nombre de la extencion del archivo
        const extName = fileTypes.test(path.extname(file.originalname));

        // si el mimeType y la extencion son validos continuar el proceso
        if (mimeType && extName) {
            return cb(null, true);
        }

        cb(console.log("Error: El archivo no es una imagen".red));
    }
}).single("image");

const renderHome = async (req, res) => {
    // mostrar en consola las imagenes que hay en la base de datos
    console.log(await Img.find().lean());
    const imgs = await Img.find().lean();

    // renderizar la vista home
    res.render("home", { title: "Express", imgs: imgs });
}

// manejar con formulario
const uploadImage =(req, res) => {
    // console.log(req.file);

    // manejo de errores
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw new Error('Fallo el procesamiento del archivo, Error: ' + `${err.message}`.red);
            }

            // GUARDAR EL NOMNRE DE LA IMAGEN EN LA DB
            const img = new Img({name: req.file.filename});
            await img.save();
            console.log(img);

            console.log(req.file);
        } catch (error) {
            console.log(error.message);
        } finally {
            res.redirect("/");
        }
    });
}

const editForm = async (req, res) => {
    console.log(req.params.id);

    try {
        const img = await Img.findById(req.params.id).lean();

        console.log(img);

        res.render("home", { img });
    } catch (error) {
        console.log(error.message);
    }
}

const editImage = (req, res) => {
    console.log(req.params.id);

    upload(req, res, (err) => {
        try {
            const image = req.params.id;

            if (err instanceof multer.MulterError) {
                throw new Error('Fallo el procesamiento del archivo, Error: ' + `${err.message}`.red);
            }

            const dirFile = path.join(__dirname, `../public/images/uploads/${image}`);

            fs.renameSync(req.file.path, dirFile);

            console.log(req.file);
        } catch (error) {
            console.log(error.message);
        } finally {
            res.redirect("/");
        }
    });
}

const deleteImage = async (req, res) => {
    console.log(req.params.id);

    try {
        const image = await Img.findById(req.params.id);

        // eliminar la imagen del servidor
        const dirFile = path.join(__dirname, `../public/images/uploads/${image.name}`);
        fs.unlinkSync(dirFile);

        // eliminar la info de la imagen de DB
        await image.remove(image);

        console.log(`Se elimino la imagen: ${image.name}`.yellow);
    } catch (error) {
        console.log(error.message);
    } finally {
        res.redirect("/");
    }
}

module.exports = {
    renderHome,
    uploadImage,
    editForm,
    deleteImage,
    editImage
}