"use client";

import { useState } from "react";

type SignupMessage = {
  type: "success" | "error";
  text: string;
};

export default function NewsletterSignupForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<SignupMessage | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
          consent,
          website,
          submittedAt: formStartedAt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Could not subscribe right now. Please try again.",
        });
        return;
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: data.message || "Thanks for subscribing!",
      });
      setFirstName("");
      setEmail("");
      setConsent(false);
      setWebsite("");
      setFormStartedAt(Date.now());
    } catch (error) {
      console.error("Newsletter sign-up failed:", error);
      setMessage({
        type: "error",
        text: "Could not subscribe right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="surface-card mt-12 p-6 md:p-8">
      <h2 className="text-2xl font-black [font-family:var(--font-heading)]">Join the SUGNL Newsletter</h2>
      <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
        Get event announcements, speaker spotlights, and community updates delivered to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="newsletter-first-name" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
              First name (optional)
            </label>
            <input
              id="newsletter-first-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
              placeholder="Your first name"
            />
          </div>

          <div>
            <label htmlFor="newsletter-email" className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--focus-ring)]"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-[color:var(--muted)]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            required
            className="mt-0.5"
          />
          <span>
            I agree to receive community emails from SUGNL. You can unsubscribe at any time.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-md bg-[color:var(--button-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--button-primary-disabled)]"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            message.type === "success"
              ? "bg-[color:var(--success-bg)] text-[color:var(--success-ink)]"
              : "bg-[color:var(--error-bg)] text-[color:var(--error-ink)]"
          }`}
        >
          {message.text}
        </div>
      )}
    </section>
  );
}
