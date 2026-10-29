"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/event/icons";
import { primaryButtonClassName } from "@/components/event/styles";
import { gradientButtonClassName } from "@/components/newsletter/styles";

interface NewsletterEmailFormProps {
  readonly endpoint: "/api/newsletter/subscribe" | "/api/newsletter/unsubscribe";
  readonly submitLabel: string;
  /** Show the consent checkbox (required for subscribing). */
  readonly requireConsent?: boolean;
  /** "showcase" uses the large gradient button of NewsletterShowcase. */
  readonly variant?: "default" | "showcase";
}

const inputClassName =
  "w-full rounded-xl border border-(--input-border) bg-(--surface-soft) px-4 py-3 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)";

export default function NewsletterEmailForm({
  endpoint,
  submitLabel,
  requireConsent = false,
  variant = "default",
}: NewsletterEmailFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          website,
          submittedAt: formStartedAt,
          ...(requireConsent ? { consent } : {}),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
        setConsent(false);
        setWebsite("");
        setFormStartedAt(Date.now());
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Newsletter form submission failed:", error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-(--muted)">All fields are required.</p>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input
            type="text"
            id="newsletter-website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="newsletter-email" className="mb-1 block text-sm font-medium text-(--ink)">
            Email
          </label>
          <input
            type="email"
            id="newsletter-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
            className={inputClassName}
            placeholder="your.email@example.com"
          />
        </div>
        {requireConsent && (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="newsletter-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-1 h-4 w-4"
            />
            <label htmlFor="newsletter-consent" className="text-sm text-(--muted)">
              I agree to receive the SUGNL newsletter by email and have read the{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy statement
              </Link>
              .
            </label>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            variant === "showcase"
              ? gradientButtonClassName
              : `${primaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-60`
          }
        >
          {isSubmitting ? "One moment..." : submitLabel}
          <ArrowRightIcon className={variant === "showcase" ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      </form>
      <div role="status">
        {message && (
          <div
            role={message.type === "error" ? "alert" : undefined}
            className={`mt-4 rounded-xl p-4 text-sm ${
              message.type === "success"
                ? "bg-(--success-bg) text-(--success-ink)"
                : "bg-(--error-bg) text-(--error-ink)"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
