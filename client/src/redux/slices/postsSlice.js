import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
	"posts/fetchPosts",
	async function (_, { rejectWithValue }) {
		try {
			const response = await axios.get("/posts");
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const fetchTags = createAsyncThunk(
	"tags/fetchTags",
	async function (_, { rejectWithValue }) {
		try {
			const response = await axios.get("/tags");
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const fetchDeletePost = createAsyncThunk(
	"deletePost/fetchDeletePost",
	async (id, { rejectWithValue }) => {
		try {
			const response = await axios.delete(`/posts/${id}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	posts: {
		items: [],
		status: "loading",
	},
	tags: {
		items: [],
		status: "loading",
	},
};

const postsSlice = createSlice({
	name: "postsSlice",
	initialState,
	reducers: {},
	extraReducers: {
		// get  posts
		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = "loading";
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = "loaded";
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.status = "error";
			state.posts.items = [];
		},

		// get  tags

		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = "loading";
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = "loaded";
		},
		[fetchTags.rejected]: (state) => {
			state.tags.status = "error";
			state.tags.items = [];
		},

		// get  post

		[fetchDeletePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				(obj) => obj._id !== action.meta.arg
			);
		},
		[fetchDeletePost.rejected]: (state,action) => {
			state.posts.status = action.payload;
		},
	},
});

export const postsReducer = postsSlice.reducer;
