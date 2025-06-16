import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const { name, email, subject, message } = formData;

  // Construct the mailto link
  const mailtoLink = `mailto:your@email.com?subject=${encodeURIComponent(subject || "New Contact Message")}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  )}`;

  // Open the mail client
  window.location.href = mailtoLink;
};

  return (
    <div className="pt-20">
      {/* Banner */}
      <div className="bg-gray-100 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Contact</h2>
        <p className="text-gray-500 mt-2">Home &gt; Contact</p>
      </div>

      {/* Contact Info + Form */}
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-12">
        {/* Info Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Get In Touch With Us</h3>
          <p className="text-gray-600">
            For more information about our products & services, please feel free to drop us a message.
            Our staff is always here to help you out. Don’t hesitate!
          </p>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">📍 Address</h4>
            <p className="text-gray-600">236 5th SE Avenue, New York, NY 10000, United States</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">📞 Phone</h4>
            <p className="text-gray-600">Mobile: (+84) 546-6789</p>
            <p className="text-gray-600">Hotline: (+84) 456-6789</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">🕒 Working Time</h4>
            <p className="text-gray-600">Monday – Friday: 9:00 – 22:00</p>
            <p className="text-gray-600">Saturday – Sunday: 9:00 – 21:00</p>
          </div>
        </div>

        {/* Form Section */}
        <form className="bg-white shadow-md p-8 rounded space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-sm text-gray-400">(optional)</span></label>
            <input
              type="text"
              name="subject"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
