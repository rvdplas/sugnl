"use client";

import { useState } from "react";

export default function SpeakerSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [linkedin, setLinkedin] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/speakers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          linkedin,
          sessionTitle,
          sessionDescription,
          website,
          submittedAt: formStartedAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      } else {
        setMessage({
          type: "success",
          text:
            data.message ||
            "Thanks for your submission. Speaking slots are not guaranteed and every submission is reviewed.",
        });
        setName("");
        setEmail("");
        setWebsite("");
        setFormStartedAt(Date.now());
        setLinkedin("");
        setSessionTitle("");
        setSessionDescription("");
      }
    } catch (error) {
      console.error("Speaker submission failed:", error);
      setMessage({
        type: "error",
        text: "Failed to submit request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surface-card bg-[color:var(--surface-soft)] p-6">
      <h2 className="mb-2 text-2xl font-black [font-family:var(--font-heading)]">Become a speaker</h2>
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        Speaker slots are not guaranteed. Every submission is reviewed by the organizers before final selection.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="personal-website">Website</label>
          <input
            type="text"
            id="personal-website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="speaker-name" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Full name
          </label>
          <input
            type="text"
            id="speaker-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="speaker-email" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Email
          </label>
          <input
            type="email"
            id="speaker-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="speaker-linkedin" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            LinkedIn (optional)
          </label>
          <input
            type="url"
            id="speaker-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </div>

        <div>
          <label htmlFor="session-title" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Session title
          </label>
          <input
            type="text"
            id="session-title"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            required
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="Title of your talk"
          />
        </div>

        <div>
          <label htmlFor="session-description" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Session description
          </label>
          <textarea
            id="session-description"
            value={sessionDescription}
            onChange={(e) => setSessionDescription(e.target.value)}
            required
            rows={5}
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="Briefly describe your session and audience takeaways"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[color:var(--button-primary)] px-4 py-2 text-white transition-colors hover:bg-[color:var(--button-primary-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--button-primary-disabled)]"
        >
          {isSubmitting ? "Submitting..." : "Submit speaker request"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 rounded-md p-3 ${
            message.type === "success"
              ? "bg-[color:var(--success-bg)] text-[color:var(--success-ink)]"
              : "bg-[color:var(--error-bg)] text-[color:var(--error-ink)]"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
