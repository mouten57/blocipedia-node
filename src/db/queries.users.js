const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');


module.exports = {

    createUser(newUser, callback){
        // const OGuser = Boolean(User.findAll({ where: {email: newUser.email}}));
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        // console.log(OGuser)

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {

            // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            // const msg = {
            //     to: user.email,
            //     from: 'signedup@blocipedia.com',
            //     subject: "You've Signed Up with Blocipedia!",
            //     text: 'Log in and start collaborating on wikis!',
            //     html: '<strong>Log in and start collaborating on wikis!</strong>',
            // };
            // sgMail.send(msg);
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
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