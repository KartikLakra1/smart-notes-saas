"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { createNote } from "../store/notesSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateNoteDialog({ open, onOpenChange }) {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !content.trim() || !topic.trim()) return;

    const token = await getToken();
    await dispatch(
      createNote({
        noteData: { title, content, topic, tags: [] },
        token,
      }),
    );

    // Reset and close
    setTitle("");
    setContent("");
    setTopic("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Input
              placeholder="e.g., Mathematics, History, Programming"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || !content.trim() || !topic.trim()}
          >
            Create Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
