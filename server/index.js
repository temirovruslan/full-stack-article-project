import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import mongoose from "mongoose";
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validation.js";

import checkAuth from "./utils/CheckAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import {
	create,
	getAll,
	getLastTags,
	getOne,
	remove,
	update,
} from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

// allows to read json files
const app = express();
app.use(express.json());
app.use(cors());

mongoose
	.connect(
		"mongodb+srv://admin:12345@cluster0.o2edb48.mongodb.net/bloga?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("MongoDB OK");
		app.listen(4444, (err) => {
			if (err) {
				console.log(err);
			}
			console.log("Server OK");
		});
	})
	.catch((err) => console.log("DB error", err));

// upload image files
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync("uploads")) {
			fs.mkdirSync("uploads");
		}
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/", (req, res) => {});

app.post("/auth/login", loginValidation, handleValidationErrors, login);

app.post(
	"/auth/registration",
	registerValidation,
	handleValidationErrors,
	register
);

app.get("/auth/me", checkAuth, getMe);

// posts CRUD operations
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	create
);
app.get("/posts", getAll);
app.get("/posts/tags", getLastTags);
app.get("/tags", getLastTags);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	update
);
