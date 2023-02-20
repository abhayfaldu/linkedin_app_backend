const express = require("express");
const { UserModel } = require("../models/User.model");
const userRoute = express.Router();

// name ==> String
// email ==> String
// gender ==> String
// password ==> String
// age ==> Number
// city ==> String

// /users/register ==> To register a new user.
// /users/login ==> For logging in generating a token
// /posts ==> This will show the posts of logged in users.
// /posts/top ==> This will show the post details that has maximum number of comments for the user who has logged in.
// /posts/update ==> The logged in user can update his/her posts.
// /posts/delete ==> The logged in user can delete his/her posts.

userRoute.get("/", async (req, res) => {
	const query = req.query;
	try {
		const users = await UserModel.find(query);
		res.send(users);
	} catch (error) {
		res.send({ msg: "some error", error: error.message });
	}
});

userRoute.post("/register", async (req, res) => {
	const { name, email, password, gender, age, city } = req.body;
	const checkIfRegistered = await UserModel.findOne({ email: email });
	if (!checkIfRegistered.length) {
		try {
			bcrypt.hash(password, 3, async (err, hash) => {
				if (err) res.send({ msg: "some error", error: err.message });
				else {
					const user = new UserModel({
						name,
						email,
						password,
						gender,
						age,
						city,
					});
					await user.save();
					res.send({ msg: "success registered" });
				}
			});
		} catch (error) {
			res.send({ msg: "some error", error: error.message });
		}
	}
});

userRoute.post("/login", async (req, res) => {
	const { email, pass } = req.body;
	try {
		await UserModel.findOne();
	} catch (err) {
		console.log({ msg: "some error", err: err.message });
	}
});

module.exports = { userRoute };
