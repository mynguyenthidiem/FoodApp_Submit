import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, googleLogin } from "../services/authService";
import { setToken, removeToken } from "../utils/tokenStorage";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await login({ email, password });

            const { token } = res;

            await setToken(token);

            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const loginWithGoogle = createAsyncThunk(
    "auth/loginWithGoogle",
    async ({ idToken }, { rejectWithValue }) => {
        try {
            const res = await googleLogin({ idToken });

            const { token } = res;

            await setToken(token);

            return res;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        await removeToken();
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(loginWithGoogle.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.status = "idle";
                state.error = null;
            });
    },
});

export default authSlice.reducer;