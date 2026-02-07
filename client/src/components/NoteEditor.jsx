"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { updateNote, deleteNote, clearSelectedNote } from "@/store/notesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AIPanel from "./AIPanel";

export default function NoteEditor() {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { selectedNote } = useSelector((state) => state.notes);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTopic(selectedNote.topic);
      setTags(selectedNote.tags || []);
      setHasChanges(false);
    }
  }, [selectedNote]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      await dispatch(
        updateNote({
          id: selectedNote._id,
          noteData: { title, content, topic, tags },
          token,
        }),
      );
      setHasChanges(false);
      toast.success("Note saved successfully");
    } catch (error) {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      await dispatch(deleteNote({ id: selectedNote._id, token }));
      dispatch(clearSelectedNote());
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setHasChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setHasChanges(true);
  };

  if (!selectedNote) return null;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-scroll">
      {/* Note Content */}
      <div
        className={`flex-1 flex flex-col ${showAI ? "md:border-r" : ""} min-w-0`}
      >
        {/* Header */}
        <div className="p-3 md:p-4 border-b flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:flex"
              onClick={() => dispatch(clearSelectedNote())}
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">
              {hasChanges ? "Unsaved" : "Saved"}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant={showAI ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className="text-xs md:text-sm"
            >
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
              <span className="hidden md:inline">AI Tools</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className="text-xs md:text-sm"
            >
              <Save className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasChanges(true);
            }}
            className="text-xl md:text-2xl font-semibold border-0 px-0 focus-visible:ring-0"
          />

          <Input
            placeholder="Topic"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setHasChanges(true);
            }}
            className="border-0 px-0 focus-visible:ring-0"
          />

          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="max-w-xs text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setHasChanges(true);
            }}
            className="min-h-[300px] md:min-h-[400px] border-0 px-0 focus-visible:ring-0 resize-none text-sm md:text-base"
          />
        </div>
      </div>

      {/* AI Panel */}
      {showAI && (
        <div className="w-full md:w-96 border-t md:border-t-0 flex-shrink-0">
          <AIPanel noteId={selectedNote._id} noteContent={content} />
        </div>
      )}
    </div>
  );
}
