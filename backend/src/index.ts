import express from "express"

const app = express();

app.get("/", async (req, res) => {
    res.send("Welcome to the backend!");
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});