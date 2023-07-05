import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const [isLoading, setLoading] = useState(false);

	const isEdit = Boolean(id);

	const inputFileRef = useRef(null);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append("image", file);
			const { data } = await axios.post("/upload", formData);
		
			setImageUrl(data.url);
		} catch (error) {
			console.warm("Не удалось загр картинку");
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl(null);
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);
			const fields = {
				title,
				// tags: tags.split(","),
				tags,
				text,
				imageUrl,
			};

			const { data } = isEdit
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post("/posts", fields);

			const _id = isEdit ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warm("Ошибка при содании статьи");
		}
	};

	useEffect(() => {
		if (id) {
			axios
				.get(`posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags);
				})
				.catch((error) => console.error(error));
		}
	}, []);
	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	if (!window.localStorage.getItem("token") && !isAuth) {
		return <Navigate to="/" />;
	}

	// console.log({ title, tags, value });

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type="file"
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`http://localhost:4444${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Заголовок статьи..."
				fullWidth
			/>
			<TextField
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEdit ? "Сохранить" : "Опубликовать"}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
