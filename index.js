const express = require("express");
const { connection } = require("./configs/db");
const { userRoute } = require("./routes/User.route");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
	res.send("hone route");
});

app.use("/users", userRoute);

app.listen(process.env.PORT, async () => {
	try {
		await connection;
		console.log("connection established");
	} catch (error) {
		console.log({ msg: "server connection error", error: error.message });
	}
	console.log("server listening on port " + process.env.PORT);
});
