import React, { useState } from "react";
import { labeldata } from "./labeldata";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateEmail = () => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    name: "",
    email: "",
    recipientname: "",
    recipientEmail: "",
    subject: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, recipientEmail, subject, content } = emailData;

    if (!name || !email || !recipientEmail || !subject || !content) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://bulk-email-sender-with-template-generator.onrender.com/api/generate-email",
        emailData
      );
      const generatedEmail = response.data.generatedEmail;
      setLoading(false);
      navigate(`/generate-email/${encodeURIComponent(generatedEmail)}`);
    } catch (err) {
      console.error("Error generating email:", err);
      alert("Failed to generate email. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-20 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          📨 Generate Email
        </h1>
        <p className="text-gray-600 text-lg">
          Use the form below to craft your personalized email.
        </p>
      </div>

      <form
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl space-y-5"
        onSubmit={handleSubmit}
      >
        {labeldata.map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={emailData[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          {loading ? "Generating..." : "✨ Generate Email"}
        </button>
      </form>
    </div>
  );
};

export default GenerateEmail;
