import React, { useState } from "react";
import { useSelector } from "react-redux";
import { profileHttp } from "../../lib/api";

function Contact() {
  const { adminData: admin } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("$500 - $1,500");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const budgetOptions = [
    "< $500",
    "$500 - $1,500",
    "$1,500 - $5,000",
    "$5,000+",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" && nameError) setNameError("");
    if (name === "email" && emailError) setEmailError("");
    if (name === "message" && messageError) setMessageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setNameError("Please enter your name");
      ok = false;
    } else setNameError("");

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setEmailError("Please enter a valid email");
      ok = false;
    } else setEmailError("");

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setMessageError("Please enter a longer message (at least 10 characters)");
      ok = false;
    } else setMessageError("");

    if (!ok) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await profileHttp.post("/api/postContact", {
        ...formData,
        budget: selectedBudget,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto w-full">
        {/* Contact Information Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail text-primary-foreground"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground truncate max-w-[150px] md:max-w-none">
                {admin?.email || "hello@devportfolio.com"}
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin text-primary-foreground"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">
                {admin?.country || admin?.location || "India"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-xl p-6 md:p-8 space-y-5 relative overflow-hidden"
          >
            {error && (
              <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}

            {submitted && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 transition-all animate-in fade-in">
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="Your name"
              />
              {nameError && (
                <div className="text-destructive text-sm mt-1">{nameError}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={255}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="you@example.com"
              />
              {emailError && (
                <div className="text-destructive text-sm mt-1">{emailError}</div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Budget
              </label>
              <div className="flex flex-wrap gap-2">
                {budgetOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedBudget(option)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedBudget === option
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={4}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
              {messageError && (
                <div className="text-destructive text-sm mt-1">{messageError}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full gradient-bg py-3 rounded-lg font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;