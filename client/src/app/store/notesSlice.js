import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Async thunks
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (token) => {
    const response = await axios.get(`${API_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async ({ noteData, token }) => {
    const response = await axios.post(`${API_URL}/api/notes`, noteData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, noteData, token }) => {
    const response = await axios.put(`${API_URL}/api/notes/${id}`, noteData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async ({ id, token }) => {
    await axios.delete(`${API_URL}/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  },
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    selectedNote: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    clearSelectedNote: (state) => {
      state.selectedNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          (n) => n._id === action.payload._id,
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n._id !== action.payload);
      });
  },
});

export const { setSelectedNote, clearSelectedNote } = notesSlice.actions;
export default notesSlice.reducer;
