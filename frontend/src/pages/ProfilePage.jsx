import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    profilePic: authUser?.profilePic || "",
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        profilePic: authUser.profilePic || "",
        fullName: authUser.fullName || "",
        email: authUser.email || "",
      });
    }
  }, [authUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setFormData((prev) => ({ ...prev, profilePic: base64Image }));
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-base-content">Your Profile</h1>
          <p className="mt-2 text-zinc-400">Edit your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-base-300 shadow-lg rounded-2xl p-8 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={selectedImg || formData.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-base-200 transition-transform group-hover:scale-105"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer flex items-center justify-center transition ${
                  isUpdatingProfile ? "pointer-events-none animate-pulse" : "hover:scale-110"
                }`}
              >
                <Camera className="w-5 h-5 text-base-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera to change your photo"}
            </p>
          </div>

          {/* Editable Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 px-4 py-2 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 px-4 py-2 bg-base-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isUpdatingProfile}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-content rounded-lg shadow hover:bg-primary-focus disabled:opacity-50"
            >
              {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-base-200 p-6 rounded-xl border border-base-300">
            <h2 className="text-lg font-semibold text-base-content mb-4">Account Information</h2>
            <div className="space-y-3 text-sm text-base-content">
              <div className="flex justify-between border-b border-base-300 py-2">
                <span>Member Since</span>
                <span>{authUser?.createdAt ? authUser.createdAt.split("T")[0] : "-"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Account Status</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
