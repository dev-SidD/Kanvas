import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, User, Image as ImageIcon, Save, X, Trash2, Loader2 } from 'lucide-react';

// --- Helper Components for Cleaner JSX ---

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-4">
    <Icon className="h-6 w-6 text-indigo-500" />
    <h3 className="ml-3 text-xl font-bold text-gray-800">{title}</h3>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <label className="text-sm font-semibold text-gray-500">{label}</label>
    <p className="mt-1 text-md text-gray-900">{value}</p>
  </div>
);

const FormInput = ({ id, label, value, onChange, type = "text" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-md placeholder:text-gray-400"
    />
  </div>
);

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUser = res.data;
        setUser(fetchedUser);

        const nameParts = fetchedUser.name ? fetchedUser.name.split(" ") : ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          name: fetchedUser.name || "",
          avatarUrl: fetchedUser.avatarUrl || "",
          email: fetchedUser.email || "",
          firstName: firstName,
          lastName: lastName,
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "userProfile_pictures");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dncaefs5d/image/upload`,
        data
      );
      setFormData((prev) => ({ ...prev, avatarUrl: res.data.secure_url }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        avatarUrl: formData.avatarUrl,
      };
      const res = await axios.put(
        "http://localhost:5001/api/users/me",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 p-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 text-lg">View and manage your personal information</p>
      </div>

      {editMode ? (
        // --- EDIT MODE FORM ---
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 animate-in fade-in-0 slide-in-from-bottom-4">
          <form onSubmit={handleUpdate} className="space-y-8">
            <SectionTitle icon={Edit} title="Edit Your Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <FormInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                    <img
                        src={formData.avatarUrl || `https://placehold.co/96x96/E0E7FF/4F46E5?text=${formData.name[0]}`}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <label htmlFor="avatar-upload" className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        <ImageIcon className="h-4 w-4" />
                        <span>{uploading ? 'Uploading...' : 'Change Picture'}</span>
                    </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button 
                type="button" 
                onClick={() => setEditMode(false)}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        // --- DISPLAY MODE VIEW ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 text-center flex flex-col items-center">
              <div className="relative">
                  <img
                    src={user.avatarUrl || `https://placehold.co/128x128/E0E7FF/4F46E5?text=${user.name[0]}`}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="mt-1 text-md text-gray-600">{user.email}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 space-y-8">
              <div>
                <SectionTitle icon={User} title="Personal Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <InfoField label="First Name" value={formData.firstName} />
                  <InfoField label="Last Name" value={formData.lastName} />
                  <div className="sm:col-span-2">
                    <InfoField label="Email Address" value={user.email} />
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t">
                <SectionTitle icon={Trash2} title="Account Actions" />
                <p className="text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
