"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Reuse/Button";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Only allow numbers for phone field
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API call will be added here later
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 5000);
    }, 500);
  };

  return (
    <section className="w-full bg-[#F0F4FF] py-16 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg px-6 py-4 border-l-4 border-[#4977E6] animate-slide-down">
          <p className="text-[#1A202C] font-medium">
            Your message has been received. You will hear from us within 24
            hours.
          </p>
        </div>
      )}

      <div className="w-[90%] lg:max-w-[1240px] mx-auto">
        <h1 className="text-[3rem] font-bold text-center mb-16 text-[#1A202C]">
          Contact Us
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            <h2 className="text-[2.5rem] font-bold text-[#1A202C]">
              Let&apos;s Empower Education Together
            </h2>
            <p className="text-[1rem] text-[#4B4B4B]">
              Have a question, partnership idea, or need help getting started?
              Our team is here to support you from setup to success.
            </p>

            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src="/contact-image.jpg"
                alt="Team collaboration"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/icon-phone.svg"
                  alt="Phone"
                  width={20}
                  height={20}
                />
                <span className="text-[#1A202C]">08164536438</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/icon-email.svg"
                  alt="Email"
                  width={20}
                  height={20}
                />
                <span className="text-[#1A202C]">ansahchikeh@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/icon-location.svg"
                  alt="Location"
                  width={20}
                  height={20}
                />
                <span className="text-[#1A202C]">
                  51 Ubaka Street Achara Layout, Enugu.
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[#1A202C] font-medium">Follow us</p>
              <div className="flex gap-4">
                <Image
                  src="/social-linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
                <Image
                  src="/social-x.svg"
                  alt="X"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
                <Image
                  src="/social-x-alt.svg"
                  alt="X Alt"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
                <Image
                  src="/social-google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="bg-[#1A202C] rounded-[16px] p-8 space-y-6"
            >
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name
                </label>
                <div className="relative">
                  <Image
                    src="/icon-person.svg"
                    alt="Person"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Image
                    src="/icon-email.svg"
                    alt="Email"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@youremail.com"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Image
                    src="/icon-phone.svg"
                    alt="Phone"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4977E6]"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here....."
                  rows={5}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 text-[#1A202C] focus:outline-none focus:ring-2 focus:ring-[#4977E6] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-center"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
