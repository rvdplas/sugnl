"use client";

import { eraseSubscriberAction } from "@/app/admin/actions";

interface EraseSubscriberButtonProps {
  readonly email: string;
}

export default function EraseSubscriberButton({ email }: EraseSubscriberButtonProps) {
  return (
    <form
      action={eraseSubscriberAction}
      onSubmit={(e) => {
        if (!window.confirm(`Erase ${email}? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        aria-label={`Erase ${email}`}
        className="rounded-md px-3 py-1 text-sm text-(--error-ink) underline-offset-4 hover:underline"
      >
        Erase
      </button>
    </form>
  );
}
