"use client";

import { useState } from "react";

interface RSVPFormProps {
  readonly eventId: string;
  readonly eventTitle: string;
}

export default function RSVPForm({ eventId, eventTitle }: RSVPFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          name,
          email,
          website,
          submittedAt: formStartedAt,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setMessage({
          type: "success",
          text: `You're registered for ${eventTitle}. We'll send event details via email.`,
        });
        setName("");
        setEmail("");
        setWebsite("");
        setFormStartedAt(Date.now());
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("RSVP submission failed:", error);
      setMessage({
        type: "error",
        text: "Failed to submit RSVP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surface-card bg-[color:var(--surface-soft)] p-6">
      <h3 className="mb-2 text-xl font-bold [font-family:var(--font-heading)]">Register for {eventTitle}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company-website">Website</label>
          <input
            type="text"
            id="company-website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
            placeholder="your.email@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[color:var(--button-primary)] px-4 py-2 text-white transition-colors hover:bg-[color:var(--button-primary-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--button-primary-disabled)]"
        >
          {isSubmitting ? "Submitting..." : "Register Now"}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
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
