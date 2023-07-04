const User = require("../model/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const flash = require("connect-flash");

var localstrategy = require("passport-local").Strategy;

module.exports.signup_post = (req, res) => {
    var { username, email, password, confirmpassword } = req.body;
    var err;
    if (!username || !email || !password) {
        err = "Please fill all the details !";
        res.render("./public/signup", { err: err });
    }
    if (password != confirmpassword) {
        err = "Password and Confirm password do not match !";
        res.render("./public/signup", { err: err });
    }
    if (typeof err == "undefined") {
        User.findOne({ email: email }, function (err, data) {
            if (err) {
                console.log("error in finding user");
                console.log(err);
            }
            if (data) {
                err = "User already exists !";
                res.render("./public/signup", { err: err });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.log("error in salting");
                        console.log(err);
                    }
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            console.log("error in hashing");
                            console.log(err);
                        }
                        password = hash;
                        User({ email, username, password }).save(
                            (err, data) => {
                                if (err) throw err;
                                req.flash(
                                    "success_message",
                                    "Registered successfully"
                                );
                                // res.send({id:this._id})
                                // console.log(this._id);
                                res.redirect("/signin");
                            }
                        );
                    });
                });
            }
        });
    }
};
passport.use(
    new localstrategy({ usernameField: "email" }, (email, password, done) => {
        // console.log("hi");
        User.findOne({ email: email }, (err, data) => {
            if (err) {
                console.log("an error occurred");
                console.log(err);
            }
            if (!data) {
                // console.log("user not found");
                return done(null, false, { message: "User Doesn't Exist !" });
            }
            bcrypt.compare(password, data.password, (err, match) => {
                if (err) {
                    // console.log("error");
                    console.log(err);
                    return done(null, false);
                }
                if (!match) {
                    return done(null, false, {
                        message: "Password doesn't match !",
                    });
                }
                if (match) {
                    return done(null, data);
                }
            });
        });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports.signin_post = (req, res, next) => {
    passport.authenticate("local", {
        failureRedirect: "/signin",
        successRedirect: "/",
        failureFlash: true,
    })(req, res, next);
};

module.exports.forgot_post = (req, res, next) => {
    async.waterfall(
        [
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString("hex");
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ email: req.body.email }, function (err, data) {
                    if (!data) {
                        req.flash(
                            "error_message",
                            "No account with that email address exists."
                        );
                        return res.redirect("/forgot");
                    }

                    data.resetPasswordToken = token;
                    data.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    data.save(function (err) {
                        done(err, token, data);
                    });
                });
            },
            function (token, User, done) {
                // var smtpTransport = nodemailer.createTransport('SMTP', {
                //     service: 'gmail',
                //     auth: {
                //         user: 'ghoshsanchita656@gmail.com',
                //         pass: 'Sanchita@123'
                //     }
                // });
                //"myteams-video-chat.herokuapp.com"
                var smtpTransport = nodemailer.createTransport(
                    "smtps://dollypandey979850%40gmail.com:" +
                        encodeURIComponent("dollypandey@123") +
                        "@smtp.gmail.com:465"
                );
                var mailOptions = {
                    to: User.email,
                    from: "dollypandey979850@gmail.com",
                    subject: "Reset your Password",
                    text:
                        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                        "http://" +
                        "localhost:4040" +
                        "/reset/" +
                        token +
                        "\n\n" +
                        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash(
                        "success_message",
                        "An e-mail has been sent to " +
                            User.email +
                            " with further instructions."
                    );
                    done(err, "done");
                });
            },
        ],
        function (err) {
            if (err) return next(err);
            res.redirect("/forgot");
        }
    );
};
