import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
	try {
		const { data } = await axios.post("/auth/login", params);
		return data;
	} catch (error) {
		throw new Error("Login failed. Please check your credentials.");
	}
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
	try {
		const { data } = await axios.get("/auth/me");
		return data;
	} catch (error) {
		throw new Error("Login failed. Please check your credentials.");
	}
});

export const fetchRegister = createAsyncThunk("auth/fetchRegister", async (params) => {
	try {
		const { data } = await axios.post("/auth/registration", params);
		return data;
	} catch (error) {
		throw new Error("Login failed. Please check your credentials.");
	}
});

const initialState = {
	data: null,
	status: "loading",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null;
		},
	},
	extraReducers: {
		[fetchAuth.pending]: (state) => {
			state.data = null;
			state.status = "loading";
		},
		[fetchAuth.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.status = "loaded";
		},
		[fetchAuth.rejected]: (state, action) => {
			state.status = "error";
			state.error = action.error.message;
		},

		[fetchAuthMe.pending]: (state) => {
			state.data = null;
			state.status = "loading";
		},
		[fetchAuthMe.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.status = "loaded";
		},
		[fetchAuthMe.rejected]: (state, action) => {
			state.status = "error";
			state.error = action.error.message;
		},

		[fetchRegister.pending]: (state) => {
			state.data = null;
			state.status = "loading";
		},
		[fetchRegister.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.status = "loaded";
		},
		[fetchRegister.rejected]: (state, action) => {
			state.status = "error";
			state.error = action.error.message;
		},
	},
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
