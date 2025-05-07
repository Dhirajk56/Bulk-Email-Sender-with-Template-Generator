import React, { useState } from "react";
import { useParams } from "react-router-dom";

const GeneratedEmail = () => {
  const { data } = useParams();
  const decodedEmail = decodeURIComponent(data);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(decodedEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        📬 Generated Email
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl">
        Below is your personalized email. You can copy and use it as needed.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl border border-blue-100">
        <pre className="whitespace-pre-wrap text-gray-800 mb-4 font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
          {decodedEmail}
        </pre>

        <div className="text-center">
          <button
            onClick={handleCopy}
            className={`${
              copied ? "bg-green-500" : "bg-blue-600"
            } text-white px-6 py-2 rounded-lg transition duration-200 shadow hover:opacity-90`}
          >
            {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedEmail;
