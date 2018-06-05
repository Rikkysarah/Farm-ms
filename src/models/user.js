/***********************
 * Module dependencies *
 ***********************/
let mongoose = require("mongoose");
bcrypt = require('bcrypt');


/********************************************
 *     MONGOOSE MODEL CONFIGURATION         *
 *******************************************/
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your firstname']
    },
    lastName: {
        type: String,
        required: [true, 'Please add your last name']
    },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    meta: {
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    }
});

userSchema.statics.isEmailUnique = function (email) {
    return new Promise((resolve, reject) => {
        this.findOne({ email: email })
            .exec((err, user) => {
                if (user) reject();
                else resolve();
            });
    });

};


userSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err);
        }
        user.password= hash;
        next()
    })
})




// userSchema.statics.authenticate = (email, password, callback) => {
//     var user = this
//     user.findOne({ email: email }).exec((err, user) => {
//         if (err) {
//             return callback(err)
//         } else if (!user) {
//             var err = new Error('user not found');
//             err.status = 401;
//             return callback(err);
//         }
//         bcrypt.compare(password, user.password, (err, result) => {
//             if (result === true) {
//                 return callback(null, user);
//             }
//             else {
//                 return callback()
//             }

//         })
//     })
// }


/******************
 * Export schema  *
 ******************/
module.exports = mongoose.model('User', userSchema);