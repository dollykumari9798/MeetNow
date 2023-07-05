// importing libraries
const hbs = require("hbs");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const user = require("./model/User.js");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const { ExpressPeerServer } = require("peer");
const { v4: uuidV4 } = require("uuid");
const {checkauth,checkauthenticated} = require('./middlewares/authMiddleware.js')
const authRoutes = require('./Routes/authRoutes.js')
const app = express();
require('dotenv').config()


const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("views", path.join(__dirname));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname)));
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

mongoose
    .connect("mongodb://localhost:27017/Teams", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log("Can't connect to database " + err));

app.use(cookieParser("TeamProject"));
app.use(
    session({
        secret: "TeamProject",
        maxAge: 3600000, // in miliseconds
        saveUninitialized: true,
        resave: true,
    })
);

//connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes)


//global variables
app.use(function (req, res, next) {
    res.locals.success_message = req.flash("success_message"); //they are always available otherwise empty
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    next();
});

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);

// get routes
app.get("/home", (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    res.render("./public/home", { roomId: uuidV4 });
});

app.get("/signin", (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    res.render("./public/signin");
});

app.get("/signup", (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    res.render("./public/signup");
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/users/:username", checkauth, (req, res) => {
    res.render("./public/home", { user: req.user, roomId: uuidV4 });
});

app.get("/", checkauth, (req, res) => {
    res.redirect(`/users/${req.user.username}`);
});


app.get("/roomid/:room", checkauthenticated, (req, res) => {
    res.render("./public/chatui", { roomId: req.params.room, user: req.user });
});
app.post("/users/joinmeet", urlencodedParser, function (req, res) {
    const roomcode = req.body.roomcode;
    res.redirect(`/roomid/${roomcode}`);
});
app.post("/joinmeet", urlencodedParser, function (req, res) {
    const roomcode = req.body.roomcode;
    res.redirect(`/roomid/${roomcode}`);
});

//--------------------------------------------------------

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
        socket.on("message", (message, uname) => {
            io.to(roomId).emit("createMessage", message, uname);
        });
        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});

//----------------------------------

app.get("/forgot", function (req, res) {
    res.render("./public/forgot-password", {
        User: req.user,
    });
});

app.get("/reset/:token", function (req, res) {
    user.findOne(
        {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        },
        function (err, data) {
            if (!data) {
                req.flash(
                    "error_message",
                    "Password reset token is invalid or has expired."
                );
                return res.redirect("/forgot");
            }
            res.render("./public/reset-password", {
                token: req.params.token,
                user: req.user,
            });
        }
    );
});


//-----------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
