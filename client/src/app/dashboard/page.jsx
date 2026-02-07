"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  setSelectedNote,
  clearSelectedNote,
} from "@/store/notesSlice";
import { Button } from "@/components/ui/button";
import { Plus, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import NotesList from "@/components/NotesList";
import NoteEditor from "@/components/NoteEditor";
import CreateNoteDialog from "@/components/CreateNoteDialog";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { notes, selectedNote, loading } = useSelector((state) => state.notes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      const token = await getToken();
      dispatch(fetchNotes(token));
    };
    loadNotes();
  }, [dispatch, getToken]);

  useEffect(() => {
    if (selectedNote && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [selectedNote]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-full flex relative">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-0 left-0 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-80 border-r flex flex-col bg-background
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          h-full
        `}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-3 mt-14 md:mt-0">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Notes</h2>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {searchQuery
                ? "No notes found"
                : "No notes yet. Create your first note!"}
            </div>
          ) : (
            <NotesList
              notes={filteredNotes}
              selectedNote={selectedNote}
              onSelectNote={(note) => dispatch(setSelectedNote(note))}
            />
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-h-full">
        {selectedNote ? (
          <NoteEditor />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
            <div className="text-center space-y-2">
              <p>Select a note to view</p>
              <p className="text-sm">or create a new one</p>
              <Button
                className="mt-4 md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4 mr-2" />
                View Notes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <CreateNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
