const mongoose = require('mongoose');
/* ref
const roomSchema = new mongoose.Schema({
    id: String,
    name: String
}, { versionKey: false });
*/
//Helpful Link: https://mongoosejs.com/docs/guide.html
const userSchema = new mongoose.Schema({
    googleID: {type: String, required: true},
    // email: {type:String, required: true}, 
    firstName: {type:String, required: true}, 
    lastName: {type:String, required: true}, 
    image: {type:String}, 
    aboutMe: {type:String}, 
    createdAt: { type: Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema);
