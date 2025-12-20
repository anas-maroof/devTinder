const express = require('express');
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user/login", (req, res) => {
    res.send("User logged in successfully");
})
app.get("/user/data", userAuth, (req, res) => {
    console.log("Inside user Middle Ware");
    res.send("User data send!!");
})

app.get("/admin/getData", (req, res) => {
    // Logic for sending data to database
    res.send("All data send successfully");
})

app.get("/admin/deleteUser", (req, res) => {
    // Logic for deleting a User from database
    res.send("User deleted successfully");
})

// This will only handle GET call to /user
// app.get("/user", (req, res) => {
//     res.send({ firstName: "Anas", lastName: "Maroof" })
// })
// app.get("/user/:userId/:name/:password", (req, res) => {
//     console.log(req.params);
//     res.send({ firstname: "Anas", lastname: "Maroof" });
// })
// app.post("/user", (req, res) => {
//     // Write logic for saving data in database
//     res.send("Data Saved in database successfully")
// })
// app.delete("/user", (req, res) => {
//     // Write logic for deleting user from database
//     res.send("User got deleted from database")
// })
// app.use("/test", (req, res) => {
//     res.send("This is test page of app");
// })

app.listen(7777, () => {
    console.log("Server is successfully learning on port 7777...");
})