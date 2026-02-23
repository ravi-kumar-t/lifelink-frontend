import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProject } from "../services/projectService";

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    hospitalName: "",
    city: "",
    requiredBloodGroup: "",
    unitsRequired: "",
    urgencyLevel: "Medium"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProject(formData);
      toast.success("Emergency case created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Emergency Case</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required onChange={handleChange} />
        <input name="hospitalName" placeholder="Hospital Name" required onChange={handleChange} />
        <input name="city" placeholder="City" required onChange={handleChange} />
        <input name="requiredBloodGroup" placeholder="Blood Group" required onChange={handleChange} />
        <input
          type="number"
          name="unitsRequired"
          placeholder="Units Required"
          required
          onChange={handleChange}
        />

        <select name="urgencyLevel" onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;