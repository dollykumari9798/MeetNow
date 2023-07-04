const checkauth = function (req, res, next) {
    if (req.isAuthenticated()) {
        // console.log("authenticated")
        res.set(
            "Cache-Control",
            "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
        );
        next();
    } else {
        // console.log("not authenticated")
        res.redirect("/home");
    }
};
const checkauthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("authenticated");
        //res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        console.log("not authenticated");
        res.redirect("/signin");
    }
};

module.exports = { checkauth, checkauthenticated };
