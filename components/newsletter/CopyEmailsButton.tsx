"use client";

import { useState } from "react";

interface CopyEmailsButtonProps {
  readonly emails: readonly string[];
}

/** Copies the Subscriber Export as text, ready to paste into a BCC field. */
export default function CopyEmailsButton({ emails }: CopyEmailsButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emails.join("; "));
      setStatus("copied");
    } catch (error) {
      console.error("Copying email addresses failed:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        disabled={emails.length === 0}
        className="rounded-md bg-(--button-primary) px-4 py-2 text-white transition-colors hover:bg-(--button-primary-hover) disabled:cursor-not-allowed disabled:bg-(--button-primary-disabled)"
      >
        Copy all email addresses
      </button>
      <span role="status" className="text-sm text-(--muted)">
        {status === "copied" && `Copied ${emails.length} addresses.`}
        {status === "failed" && "Copying failed. Select the addresses below instead."}
      </span>
    </div>
  );
}
