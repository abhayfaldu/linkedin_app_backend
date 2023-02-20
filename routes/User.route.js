const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");
const userRoute = express.Router();
const bcrypt = require("bcrypt");

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
	try {
		const users = await UserModel.find({
			email: email,
		});
		if (users.length <= 0) {
			bcrypt.hash(password, 3, async (err, hash) => {
				if (err) res.send({ msg: "some error", error: err.message });
				else {
					const user = new UserModel({
						name,
						email,
						password: hash,
						gender,
						age,
						city,
					});
					await user.save();
					res.send({ msg: "success registered" });
				}
			});
		} else {
			res.send("User already exist, please login");
		}
	} catch (error) {
		res.send({ msg: "some error", error: error.message });
	}
});

userRoute.post("/login", async (req, res) => {
	const { email, pass } = req.body;
	try {
		const users = await UserModel.find({
			email: email,
		});
		if (users.length > 0) {
			bcrypt.compare(pass, users[0].password, (err, result) => {
				if (result) {
					const token = jwt.sign({ userId: users[0]._id }, "linkedin");
					res.send({ msg: "logged in", token: token });
				} else {
					res.send({ msg: "some error" });
				}
			});
		} else {
			res.send("User not found, sign up");
		}
	} catch (error) {
		res.send({ msg: "some error", error: error.message });
	}
});

module.exports = { userRoute };
