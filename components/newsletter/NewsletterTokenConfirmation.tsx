"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, MailIcon } from "@/components/event/icons";
import {
  cardClassName,
  cardHeadingClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "@/components/event/styles";
import Confetti from "@/components/newsletter/Confetti";
import { gradientButtonClassName, iconBadgeClassName } from "@/components/newsletter/styles";

interface NewsletterTokenConfirmationProps {
  readonly endpoint: "/api/newsletter/confirm" | "/api/newsletter/unsubscribe/confirm";
  readonly heading: string;
  readonly text: string;
  readonly buttonLabel: string;
  readonly successHeading: string;
  readonly successText: string;
  /** "card" renders its own card; "showcase" renders bare content for NewsletterShowcase. */
  readonly variant?: "card" | "showcase";
  /** Shown instead when the URL carries no token, rather than the "link is incomplete" message. */
  readonly fallback?: ReactNode;
}

type Status = "idle" | "submitting" | "done" | "error";

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const getHash = () => window.location.hash;
// The fragment is unknown during server rendering.
const getServerHash = () => null;

/**
 * Reads the token from the URL fragment and only uses it when the person clicks
 * the button, so email link scanners that open links can't act on their behalf.
 */
export default function NewsletterTokenConfirmation({
  endpoint,
  heading,
  text,
  buttonLabel,
  successHeading,
  successText,
  variant = "card",
  fallback,
}: NewsletterTokenConfirmationProps) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const token = hash === null ? null : new URLSearchParams(hash.slice(1)).get("token");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const isMissingToken = hash !== null && !token;
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // The confirm button unmounts on success; move focus so keyboard users keep their place.
  useEffect(() => {
    if (status === "done") {
      successHeadingRef.current?.focus();
    }
  }, [status]);

  // Also during server rendering, so a plain visit doesn't flash the confirm button.
  if (fallback && !token && status !== "done") {
    return fallback;
  }

  const handleConfirm = async () => {
    setStatus("submitting");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        // Drop the spent token from the address bar and history.
        window.history.replaceState(null, "", window.location.pathname);
        setStatus("done");
      } else {
        const data = await response.json();
        setErrorText(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Newsletter confirmation failed:", error);
      setErrorText("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const isShowcase = variant === "showcase";
  const wrap = (children: ReactNode, role?: string) =>
    isShowcase ? <div role={role}>{children}</div> : <section role={role} className={cardClassName}>{children}</section>;

  if (status === "done") {
    return (
      wrap(
        <>
        {endpoint === "/api/newsletter/confirm" && <Confetti />}
        <span className="pill mb-4 inline-block bg-(--success-bg) text-(--success-ink)">
          Done
        </span>
        <h2 ref={successHeadingRef} tabIndex={-1} className={`${cardHeadingClassName} mb-2 focus:outline-hidden`}>
          {successHeading}
        </h2>
        <p className="mb-6 text-(--muted)">{successText}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/events" className={primaryButtonClassName}>
            See upcoming events
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link href="/" className={secondaryButtonClassName}>
            Back to the homepage
          </Link>
        </div>
        </>,
        "status"
      )
    );
  }

  return (
    wrap(
      <>
      <div className={isShowcase ? "mb-6 flex items-start gap-4" : ""}>
        {isShowcase && (
          <span className={iconBadgeClassName}>
            <MailIcon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className={`${cardHeadingClassName} mb-2`}>{heading}</h2>
          <p className={`${isShowcase ? "" : "mb-6 "}text-(--muted)`}>{text}</p>
        </div>
      </div>

      {isMissingToken ? (
        <p className="rounded-xl bg-(--error-bg) p-4 text-sm text-(--error-ink)">
          This link is incomplete. Please open the full link from the email we sent you.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!token || status === "submitting"}
          className={
            isShowcase
              ? gradientButtonClassName
              : `${primaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-60`
          }
        >
          {status === "submitting" ? "One moment..." : buttonLabel}
          <ArrowRightIcon className={isShowcase ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-(--error-bg) p-4 text-sm text-(--error-ink)">
          {errorText}
        </p>
      )}
      </>
    )
  );
}
