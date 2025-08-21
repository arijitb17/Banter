import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-base-100 transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 p-4 lg:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 justify-center lg:justify-start">
          <Users className="w-5 h-5 text-base-content" />
          <span className="hidden lg:block font-semibold text-base-content">Contacts</span>
        </div>

        {/* Online Filter (desktop only) */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Show online only
          </label>
          <span className="text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-2 px-1 lg:px-2">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3 p-2 lg:p-3 rounded-lg transition-all duration-200
                ${isSelected ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-base-200"}
              `}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0 flex justify-center">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-base-200"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col items-center lg:items-start min-w-0 overflow-hidden mt-1 lg:mt-0">
                <span className="font-medium truncate text-base-content text-sm lg:text-base">{user.fullName}</span>
                {/* Online text hidden on mobile */}
                <span
                  className={`text-xs lg:text-sm truncate hidden lg:block ${
                    isOnline ? "text-green-500" : "text-zinc-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
