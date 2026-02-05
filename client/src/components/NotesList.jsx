"use client";

import { formatDistanceToNow } from "date-fns";

export default function NotesList({ notes, selectedNote, onSelectNote }) {
  return (
    <div className="divide-y">
      {notes.map((note) => (
        <button
          key={note._id}
          onClick={() => onSelectNote(note)}
          className={`w-full p-4 text-left hover:bg-accent transition-colors ${
            selectedNote?._id === note._id ? "bg-accent" : ""
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium truncate">{note.title}</h3>
            </div>

            <p className="text-xs text-muted-foreground">{note.topic}</p>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {note.content}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(note.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
