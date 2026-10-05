"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { secondaryButtonClassName } from "@/components/event/styles";
import { EMBEDS_CATEGORY } from "@/lib/cookieConsent";

type MapEmbedProps = {
  readonly src: string;
  readonly title: string;
};

export default function MapEmbed({ src, title }: MapEmbedProps) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(CookieConsent.acceptedCategory(EMBEDS_CATEGORY));
    sync();
    window.addEventListener("cc:onConsent", sync);
    window.addEventListener("cc:onChange", sync);
    return () => {
      window.removeEventListener("cc:onConsent", sync);
      window.removeEventListener("cc:onChange", sync);
    };
  }, []);

  const loadMap = () => {
    const { acceptedCategories } = CookieConsent.getUserPreferences();
    CookieConsent.acceptCategory([...acceptedCategories, EMBEDS_CATEGORY]);
    CookieConsent.hide();
  };

  if (allowed) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="map-embed h-full w-full border-0"
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="max-w-sm text-sm text-[color:var(--muted)]">
        This map is provided by Google Maps, which may set cookies.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={loadMap} className={secondaryButtonClassName}>
          Load map
        </button>
        <button
          type="button"
          onClick={() => CookieConsent.showPreferences()}
          className="text-sm font-semibold text-[color:var(--link)] hover:opacity-80"
        >
          Cookie settings
        </button>
      </div>
    </div>
  );
}
