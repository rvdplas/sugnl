"use client";

import { useActionState, useId, useRef, useState } from "react";
import { saveBannerAction } from "@/app/admin/actions";
import { BannerBar } from "@/components/SiteBanner";
import { getVisibleText, MAX_MESSAGE_LENGTH, MAX_MESSAGE_SOURCE_LENGTH } from "@/lib/bannerInput";
import type { SiteBanner } from "@/lib/siteBanner";

const buttonClassName =
  "rounded-md bg-[color:var(--button-primary)] px-4 py-2 text-white transition-colors hover:bg-[color:var(--button-primary-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--button-primary-disabled)]";

const inputClassName =
  "w-full rounded-md border border-[color:var(--input-border)] bg-transparent px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)]";

const emptyFields = { message: "", startsOn: "", endsOn: "", dismissible: true };

interface BannerEditorProps {
  /** The banner to edit; without it the editor creates a new banner. */
  readonly banner?: SiteBanner;
}

export default function BannerEditor({ banner }: BannerEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const [fields, setFields] = useState(emptyFields);
  const title = banner ? "Edit banner" : "New banner";

  // Filled on open, so reopening Edit drops unsaved changes.
  const open = () => {
    if (banner) {
      setFields({
        message: banner.message,
        startsOn: banner.startsOn ?? "",
        endsOn: banner.endsOn ?? "",
        dismissible: banner.dismissible,
      });
    }
    dialogRef.current?.showModal();
  };

  const [error, publish, publishing] = useActionState(async (_previous: string | null, formData: FormData) => {
    const result = await saveBannerAction(formData);
    if (!result) {
      setFields(emptyFields);
      dialogRef.current?.close();
    }
    return result;
  }, null);

  // Wraps the selected text (or a placeholder) in link markup and selects the URL to type over.
  const insertLink = () => {
    const textarea = messageRef.current;
    if (!textarea) {
      return;
    }

    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const text = value.slice(start, end) || "link text";
    const url = "/page";
    const message = `${value.slice(0, start)}[${text}](${url})${value.slice(end)}`;
    setFields({ ...fields, message });

    const urlStart = start + text.length + 3;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(urlStart, urlStart + url.length);
    });
  };

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields({ ...fields, [event.target.name]: event.target.value });

  return (
    <>
      {banner ? (
        <button
          type="button"
          onClick={open}
          aria-label={`Edit banner: ${banner.message}`}
          className="text-sm text-[color:var(--link)] underline-offset-4 hover:underline"
        >
          Edit
        </button>
      ) : (
        <button type="button" onClick={open} className={buttonClassName}>
          New banner
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // A click on the backdrop lands on the dialog element itself.
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        className="w-[min(92vw,44rem)] rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-0 text-[color:var(--ink)] backdrop:bg-black/60"
      >
        <form action={publish} className="space-y-5 p-6 md:p-8">
          {banner && <input type="hidden" name="id" value={banner.id} />}
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[color:var(--muted)] hover:text-[color:var(--ink)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid gap-1 text-sm">
            <div className="flex items-end justify-between gap-3">
              <label htmlFor={`${titleId}-message`}>Message</label>
              <span className="text-[color:var(--muted)]">
                {getVisibleText(fields.message).length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              id={`${titleId}-message`}
              ref={messageRef}
              name="message"
              required
              rows={3}
              maxLength={MAX_MESSAGE_SOURCE_LENGTH}
              aria-describedby={`${titleId}-message-hint`}
              value={fields.message}
              onChange={update}
              // The banner is one line of text: Enter must not add a line break.
              onKeyDown={(event) => event.key === "Enter" && event.preventDefault()}
              placeholder="Never miss a SUGNL event."
              className={`${inputClassName} resize-y`}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p id={`${titleId}-message-hint`} className="text-[color:var(--muted)]">
                Links: <code>[link text](/page)</code> or <code>[link text](https://…)</code>
              </p>
              <button
                type="button"
                onClick={insertLink}
                className="text-[color:var(--link)] underline-offset-4 hover:underline"
              >
                Insert link
              </button>
            </div>
          </div>

          <fieldset className="grid gap-3 md:grid-cols-2">
            <legend className="mb-1 text-sm text-[color:var(--muted)]">
              Dates (optional, Dutch days): shows from the start of the first day through the end of the last. No start
              shows it right away, no end keeps it until you remove it.
            </legend>
            <label className="grid gap-1 text-sm">
              First day
              <input type="date" name="startsOn" value={fields.startsOn} onChange={update} className={inputClassName} />
            </label>
            <label className="grid gap-1 text-sm">
              Last day
              <input
                type="date"
                name="endsOn"
                value={fields.endsOn}
                onChange={update}
                min={fields.startsOn || undefined}
                className={inputClassName}
              />
            </label>
          </fieldset>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="dismissible"
              checked={fields.dismissible}
              onChange={(event) => setFields({ ...fields, dismissible: event.target.checked })}
              className="mt-0.5 h-4 w-4 accent-[color:var(--button-primary)]"
            />
            <span>
              Visitors can close this banner
              <span className="block text-[color:var(--muted)]">
                Turn off for announcements everyone must keep seeing until the end date.
              </span>
            </span>
          </label>

          <div className="space-y-2">
            <p className="text-sm text-[color:var(--muted)]">Preview</p>
            {/* inert: the preview's link and close button must not do anything. */}
            <div inert className="overflow-hidden rounded-lg">
              <BannerBar
                banner={{
                  message: fields.message || "Your message",
                  dismissible: fields.dismissible,
                }}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-[color:var(--error-bg)] p-3 text-sm text-[color:var(--error-ink)]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[color:var(--muted)]">
              {banner
                ? "Visitors who closed this banner will not see it again. Create a new banner to reach them."
                : "Shows next to any other live banners."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="rounded-md px-4 py-2 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
              >
                Cancel
              </button>
              <button type="submit" disabled={publishing} className={buttonClassName}>
                {publishing ? "Saving…" : banner ? "Save" : "Publish"}
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}
