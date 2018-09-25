const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            //my duplicate user error wasn't showing up unless I did this.
            newErr= [{
                param: err.errors[0].path,
                msg: err.errors[0].message
              }]
              callback(newErr);
        });
    },

    getUser(id, callback){
        let result = {};
        User.findById(id)
        .then((user) => {
            if(!user) {
                callback(404);
            } else {
                result["user"] = user;
            }
            });
        }

}