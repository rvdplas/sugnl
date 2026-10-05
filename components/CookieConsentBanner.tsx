"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { cookieConsentConfig } from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run(cookieConsentConfig);
  }, []);

  return null;
}
