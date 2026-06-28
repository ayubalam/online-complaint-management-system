import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createComplaint } from "../../services/complaintService";

const CreateComplaint = () => {
  const { register, handleSubmit, reset } = useForm();
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("location", data.location);
      formData.append("priority", data.priority);

      if (data.images) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      }

      await createComplaint(formData);

      toast.success("Complaint submitted successfully");
      reset();
      setPreviews([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (e) => {
    const files = Array.from(e.target.files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Create Complaint</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Complaint Title"
            className="w-full border p-3 rounded-lg"
            {...register("title")}
          />

          <textarea
            rows="5"
            placeholder="Description"
            className="w-full border p-3 rounded-lg"
            {...register("description")}
          />

          <input
            type="text"
            placeholder="Category"
            className="w-full border p-3 rounded-lg"
            {...register("category")}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full border p-3 rounded-lg"
            {...register("location")}
          />

          <select
            className="w-full border p-3 rounded-lg"
            {...register("priority")}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full border p-3 rounded-lg"
              {...register("images")}
              onChange={handlePreview}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateComplaint;
