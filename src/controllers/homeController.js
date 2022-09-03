const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

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

const renderHome = (req, res) => {
    // mostrar en consola las imagenes que hay '../public/images/uploads'
    console.log({ imgs: fs.readdirSync(path.join(__dirname, '../public/images/uploads')) });

    // renderizar la vista home
    res.render("home", { title: "Express", imgs: fs.readdirSync(path.join(__dirname, '../public/images/uploads')) });
}

// manejar con formulario
const uploadImage = (req, res) => {
    // console.log(req.file);

    // manejo de errores
    upload(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                throw new Error('Fallo el procesamiento del archivo, Error: ' + `${err.message}`.red);
            }

            console.log(req.file);
        } catch (error) {
            console.log(error.message);
        } finally {
            res.redirect("/");
        }
    });
}

const editForm = (req, res) => {
    // id del imagen pasador por params
    const editImage = req.params;

    console.log({ img: editImage });
    // renderizar con el id de la imagen
    res.render("home", { img: editImage });
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

const deleteImage = (req, res) => {
    // console.log(req.params.id);

    try {
        const image = req.params.id;

        // eliminar la imagen
        const dirFile = path.join(__dirname, `../public/images/uploads/${image}`);
        fs.unlinkSync(dirFile);

        console.log(`Se elimino la imagen: ${image}`.yellow);
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