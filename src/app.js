const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    const data = req.body;

    try {
        const ALLOWED_FIELDS = [
            "firstName",
            "lastName",
            "emailId",
            "password",
            "age",
            "gender",
            "photoUrl",
            "skills",
            "about"
        ];

        // check allowed fields
        const isAllowed = Object.keys(data).every((key) =>
            ALLOWED_FIELDS.includes(key)
        );

        if (!isAllowed) {
            throw new Error("Some fields are not allowed");
        }

        // skills length check
        if (data?.skills && data.skills.length > 15) {
            throw new Error("Skills cannot be more than 15");
        }

        const user = new User(data);
        await user.save();

        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("SIGNUP FAILED: " + err.message);
    }
});


// GET USER by emailId
app.get("/user", async (req, res) => {
    try {
        const users = await User.find({ emailId: req.body.emailId });
        if (users.length === 0) {
            res.status(404).send("User not found");
        }
        else {
            res.send(users);
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// FEED API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// Delete the data of user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// Update the data of user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["age", "photoUrl", "skills", "about"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed!!");
        }
        if (data?.skills.length > 15) {
            throw new Error("Skills are not allowed more than 15");
        }
        await User.findByIdAndUpdate(userId, data, { runValidators: true });
        res.send("User data updated successfully");
    }
    catch (err) {
        res.status(400).send("UPDATE FAILED : " + err.message);
    }
})
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        })
    })
    .catch((err) => {
        console.error("Database does not connected");
    })









// const { adminAuth, userAuth } = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.get("/user/login", (req, res) => {
//     res.send("User logged in successfully");
// })
// app.get("/user/data", userAuth, (req, res) => {
//     console.log("Inside user Middle Ware");
//     res.send("User data send!!");
// })

// app.get("/admin/getData", (req, res) => {
//     // Logic for sending data to database
//     res.send("All data send successfully");
// })

// app.get("/admin/deleteUser", (req, res) => {
//     // Logic for deleting a User from database
//     res.send("User deleted successfully");
// })

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