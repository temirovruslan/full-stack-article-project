import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:4444",
});

// in every request check if in localStorage exists info and put it into this middleware
instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem("token");
	return config;
});

export default instance;
