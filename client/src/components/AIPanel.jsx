"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AIPanel({ noteId, noteContent }) {
  const { getToken } = useAuth();
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history
  useEffect(() => {
    if (noteId) {
      loadChatHistory();
    }
  }, [noteId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/api/ai/chat/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Load chat error:", error);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setLoadingSummary(true);
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/api/ai/summary/${noteId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Generate summary error:", error);
      alert("Failed to generate summary");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");

    // Add user message immediately
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      setSendingMessage(true);
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/api/ai/chat/${noteId}`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Add AI response
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm("Clear chat history?")) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/api/ai/chat/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (error) {
      console.error("Clear chat error:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Summary Section */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">AI Summary</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
          >
            {loadingSummary ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-3 w-3 mr-1" />
            )}
            Generate
          </Button>
        </div>

        {summary && (
          <div className="text-sm text-muted-foreground bg-accent p-3 rounded">
            {summary}
          </div>
        )}
      </div>

      <Separator />

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Ask Questions</h3>
          {messages.length > 0 && (
            <Button size="sm" variant="ghost" onClick={handleClearChat}>
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm">
              Ask questions about this note
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {sendingMessage && (
            <div className="flex justify-start">
              <div className="bg-accent rounded p-3 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={sendingMessage}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendingMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
