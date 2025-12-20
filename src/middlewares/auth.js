const adminAuth = (req, res, next) => {
    console.log("Admin Authorization is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
}
const userAuth = (req, res, next) => {
    console.log("User Authorization is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth,
};