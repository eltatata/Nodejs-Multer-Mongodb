const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imgShema = new Schema({
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Img = mongoose.model("Img", imgShema);

module.exports = Img;