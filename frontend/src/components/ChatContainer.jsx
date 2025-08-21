import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { Edit2, Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    updateMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null); // clicked message
  const inputRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cancel edit if clicked outside input
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingMessageId && inputRef.current && !inputRef.current.contains(e.target)) {
        setEditingMessageId(null);
        setEditText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingMessageId]);

  const startEditing = (message) => {
    setEditingMessageId(message._id);
    setEditText(message.text);
    setActiveMessageId(null);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    await updateMessage(editingMessageId, editText.trim());
    setEditingMessageId(null);
    setEditText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-base-200">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-base-200">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;
          const isEditing = editingMessageId === message._id;
          const isActive = activeMessageId === message._id;

          // Theme-based colors
          const bubbleBg = isSentByMe ? "bg-primary text-primary-content" : "bg-base-200 text-base-content";
          const editButtonColor = isSentByMe ? "text-white" : "text-black";
          const editedTextColor = isSentByMe ? "text-primary-content/70" : "text-black/70 dark:text-white/70";

          return (
            <div
              key={message._id}
              className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex items-start relative ${isSentByMe ? "justify-end" : "justify-start"}`}
                onClick={() => setActiveMessageId(activeMessageId === message._id ? null : message._id)}
              >
                {/* Left Avatar */}
                {!isSentByMe && (
                  <div className="chat-image avatar mr-2">
                    <div className="w-10 h-10 rounded-full border overflow-hidden">
                      <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] p-3 rounded-2xl shadow flex flex-col relative ${bubbleBg}`}
                >
                  {message.image && (
                    <img src={message.image} alt="Attachment" className="sm:max-w-[250px] rounded-md mb-2" />
                  )}

                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full border px-2 py-1 rounded text-sm"
                      autoFocus
                    />
                  ) : (
                    <>
                      {message.text && <p className="break-words">{message.text}</p>}
                      {message.edited && (
                        <span className={`text-[10px] mt-1 self-start opacity-70 ${editedTextColor}`}>
                          edited
                        </span>
                      )}
                      <time
                        className={`text-[10px] mt-1 self-end opacity-60 ${
                          isSentByMe ? "text-primary-content/70" : "text-base-content/70"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </>
                  )}
                </div>

                {/* Right Avatar */}
                {isSentByMe && (
                  <div className="chat-image avatar ml-2">
                    <div className="w-10 h-10 rounded-full border overflow-hidden">
                      <img src={authUser.profilePic || "/avatar.png"} alt={authUser.fullName} />
                    </div>
                  </div>
                )}
              </div>

              {/* Edit/Delete buttons BELOW bubble, only on click */}
              {isSentByMe && isActive && !isEditing && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => startEditing(message)}
                    className={`flex items-center gap-1 text-sm ${editButtonColor}/70 hover:${editButtonColor}`}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="flex items-center gap-1 text-sm text-red-500/70 hover:text-red-500"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
