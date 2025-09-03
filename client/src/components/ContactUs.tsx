import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";

interface ContactUsProps {
  onRequireLogic: () => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ onRequireLogic }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { isAuthenticated } = useAuth0();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onRequireLogic();
      toast.error("Please login | signup to send a message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://financial-fortress.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(true); 
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 text-base">
      {submitted ? (
        <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
          <CardContent>
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-3xl mb-10">
                <strong>Contact Us</strong>
              </h2>
            </div>
            <p className="text-green-600 font-medium">
              Thank you! Your message has been received. We’ll respond shortly.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white dark:bg-gray-800 shadow-md lg:col-span-1">
            <CardContent>
              <h2 className="text-4xl xs:text-2xl text-gray-700 dark:text-gray-300 py-6">
                <strong>Got questions or ideas?</strong>
              </h2>
              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
                We’re here to help! Whether you’re exploring Financial Fortress
                for the first time, looking for guidance on managing your
                finances, or have feedback to help us improve, we want to hear
                from you. Our team is committed to providing fast, friendly
                support and making sure your experience is seamless.
              </p>
              <p className="text-2xl text-gray-700 dark:text-gray-300">
                Fill out the form below, and we’ll get back to you promptly.
                Your insights help us build better tools to empower your
                financial journey.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <CardContent>
              <h2 className="text-4xl font-bold mb-5">
                <strong>Send Message</strong>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-4 py-4 px-4 rounded-md text-white transition 
                                ${
                                  isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-600 hover:bg-gray-700"
                                }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <Card className=" text-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:col-span-2">
        <CardContent>
          <div className="mt-8 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Email:</strong> contact@akshavi.com.np
            </p>
            <p>
              <strong>Address:</strong> Jawalakhel, Lalitpur 44600
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
