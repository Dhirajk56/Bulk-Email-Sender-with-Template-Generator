import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

export default function App() {
  const [csvData, setCsvData] = useState([]);
  const [RecieverEmails, setRecieverEmails] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [userEmail, SetUserEmail] = useState({
    useremail: "",
    userPasscode: "",
    subject: "",
    template: "",
  });
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          alert("CSV loaded successfully");
        },
      });
    }
  };
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      alert(`Attachment selected: ${file.name}`);
    }
  };

  const generateEmails = async () => {
    if (!userEmail.template || csvData.length === 0) {
      alert("Please upload CSV and enter a message template.");
      return;
    }
    const processedEmails = csvData.map((entry) => ({
      name: entry.name,
      subject: userEmail.subject,
      email: entry.email,
      content: userEmail.template,
    }));

    setRecieverEmails(processedEmails);
  };

  const handleSendEmail = async (email) => {
    try {
      const formData = new FormData();
      formData.append("name", email.name);
      formData.append("recieverEmail", email.email);
      formData.append("subject", email.subject);
      formData.append("content", email.content);
      formData.append("useremail", userEmail.useremail);
      formData.append("userpasscode", userEmail.userPasscode);
      if (attachment) formData.append("attachment", attachment);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/send-email`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(`Email sent to ${email.name}`);
    } catch (error) {
      console.error(error);
      alert("Failed to send email.");
    }
  };

  const HandleAllEmail = async () => {
    if (!RecieverEmails.length) return alert("No emails to send.");
    const confirmed = window.confirm(
      "Are you sure you want to send all emails?"
    );
    if (!confirmed) return;

    try {
      for (const email of RecieverEmails) {
        const formData = new FormData();
        formData.append("name", email.name);
        formData.append("recieverEmail", email.email);
        formData.append("subject", email.subject);
        formData.append("content", email.content);
        formData.append("useremail", userEmail.useremail);
        formData.append("userpasscode", userEmail.userPasscode);
        if (attachment) formData.append("attachment", attachment);

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/send-email`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      alert("All emails have been sent successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to send one or more emails.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 p-6 pt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          📧 Bulk Email Sender
        </h1>
        {/* Email input  */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Enter your Email
          </label>
          <input
            type="text"
            placeholder="Enter your email 'example@gmail.com'"
            value={userEmail.useremail}
            onChange={(e) =>
              SetUserEmail({ ...userEmail, useremail: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
          />
        </div>
        {/* Passcode Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Enter app password without spaces
          </label>
          <input
            type="text"
            placeholder=" Enter 16 digit Generated app Password 'abcd efgh ijkl mnop'"
            value={userEmail.userPasscode}
            onChange={(e) =>
              SetUserEmail({
                ...userEmail,
                userPasscode: e.target.value.replace(/\s/g, ""),
              })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email Subject
          </label>
          <input
            type="text"
            placeholder="Enter Subject"
            value={userEmail.subject}
            onChange={(e) =>
              SetUserEmail({ ...userEmail, subject: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
          />
        </div>

        {/* Email Template */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email Template
          </label>
          <textarea
            rows="6"
            placeholder="Enter your email message here"
            value={userEmail.template}
            onChange={(e) =>
              SetUserEmail({ ...userEmail, template: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
          ></textarea>
        </div>

        {/* File Upload & Buttons */}
        <div className="flex flex-col sm:flex-col items-center gap-4">
          <div>
            <label className="text-gray-700 font-medium mb-1">Upload CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium mb-1">
              Upload Attachment
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleAttachmentChange}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            onClick={generateEmails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            🔄 Generate Emails
          </button>
          <button
            onClick={HandleAllEmail}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            📤 Send To All
          </button>
        </div>

        {/* Email List */}
        {RecieverEmails.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Preview Recipients
            </h2>
            {RecieverEmails.map((val, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 border rounded px-4 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    To: {val.name} ({val.email})
                  </p>
                </div>
                <button
                  onClick={() => handleSendEmail(val)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                >
                  Send
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
