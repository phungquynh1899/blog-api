const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Catego-ry title is required"],
        unique: true, 
        trim: true,
    },
}, {
    timestamps: true,
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;