import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "../validation.js";
// import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../modules/User.js";
// import checkAuth from "../utils/checkAuth.js";

export const register = async (req, res) => {
	try {
		

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign(
			// 1 parameter
			{
				_id: user._id,
			},
			// 2 parameter
			"secret123",
			// 3 parameter
			{
				expiresIn: "30d",
			}
		);
		// no need to show  passwordHash
		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось зарегистрироваться",
		});
	}
};

export const login = async (req, res) => {
	try {
		// find in database user with username and password
		const user = await UserModel.findOne({ email: req.body.email });

		// no need to explain to user the reason why
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);
		if (!isValidPass) {
			return res.status(400).json({
				message: "Неверный логин или пароль",
			});
		}
		const token = jwt.sign(
			// 1 parameter
			{
				_id: user._id,
			},
			// 2 parameter
			"secret123",
			// 3 parameter
			{
				expiresIn: "30d",
			}
		);
		// no need to show  passwordHash
		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось авторизоваться",
		});
	}
};

export const getMe = async (req, res) => {
	try {
	  const user = await UserModel.findById(req.userId);
  
	  if (!user) {
		return res.status(404).json({
		  message: 'Пользователь не найден',
		});
	  }
  
	  const { passwordHash, ...userData } = user._doc;
  
	  res.json(userData);
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Нет доступа',
	  });
	}
  };
