import express from "express"

const app = express();

app.get("/", async (req, res) => {
    res.send("Welcome to the backend4!");
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});