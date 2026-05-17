import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getProfile,
  updateProfile,
} from "../../services/userService";

const ProfilePage = () => {
  const [profile, setProfile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [image, setImage] =
    useState(null);

  // Fetch Profile
  const fetchProfile =
    async () => {
      try {
        const data =
          await getProfile();

        setProfile(data);

        setFormData({
          name: data.name,
          email: data.email,
          password: "",
        });
      } catch {
        toast.error(
          "Failed to load profile"
        );
      }
    };

  useEffect(() => {
    const loadProfile =
      async () => {
        await fetchProfile();
      };

    loadProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Submit Form
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const submitData =
          new FormData();

        submitData.append(
          "name",
          formData.name
        );

        submitData.append(
          "email",
          formData.email
        );

        submitData.append(
          "password",
          formData.password
        );

        if (image) {
          submitData.append(
            "profileImage",
            image
          );
        }

        const updated =
          await updateProfile(
            submitData
          );

        setProfile(updated);

        toast.success(
          "Profile updated successfully"
        );
      } catch {
        toast.error(
          "Update failed"
        );
      }
    };

  // Loading
  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-xl">
          Loading Profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            {/* Avatar */}
            <div>
              {profile.profileImage ? (
                <img
                  src={`https://complaintms-backend-7d29.onrender.com/uploads/${profile.profileImage}`}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-600">
                  {profile.name[0]}
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-4xl font-bold">
                {profile.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {profile.email}
              </p>

              <span className="inline-block mt-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full capitalize">
                {profile.role}
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-xl"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-xl"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">
                New Password
              </label>

              <input
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-xl"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block mb-2 font-medium">
                Profile Image
              </label>

              <input
                type="file"
                onChange={(e) =>
                  setImage(
                    e.target.files[0]
                  )
                }
                className="w-full"
              />
            </div>

            {/* Submit */}
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;