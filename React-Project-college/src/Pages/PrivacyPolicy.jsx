import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-10">
      
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Last updated: April 25, 2026
        </p>

        {/* Section */}
        <div className="space-y-6 text-gray-300 leading-relaxed">

          <p>
            This Privacy Policy describes how we collect, use, and protect your
            information when you use our platform.
          </p>

          {/* About */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              About Our Platform
            </h2>
            <p>
              Turn any YouTube video into smart notes, quizzes, and downloadable
              PDFs in seconds. This AI-powered platform helps you learn faster by
              summarizing video content, generating practice questions, and
              allowing you to ask doubts directly from the video. With features
              like saved history, easy access to previous notes, and a clean
              dashboard, it acts as your personal study assistant—making learning
              simple, efficient, and organized.
            </p>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Password</li>
            </ul>
          </div>

          {/* Usage */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              How We Use Your Information
            </h2>
            <p>
              We use your data to provide and improve our services, manage your
              account, and ensure security.
            </p>
          </div>

          {/* AI */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              AI Features
            </h2>
            <p>
              Our platform uses AI technologies to analyze video content and
              generate notes, quizzes, and answers. Your data is processed
              securely.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions, feel free to contact us.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;