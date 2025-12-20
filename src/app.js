const express = require('express');
const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello from my app");
})
app.use("/test", (req, res) => {
    res.send("This is test page of app");
})
app.use((req, res) => {
    res.send("Welcome to homepage");
})
app.listen(7777, () => {
    console.log("Server is successfully learning on port 7777...");
})