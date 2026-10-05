import type { CookieConsentConfig } from "vanilla-cookieconsent";

export const EMBEDS_CATEGORY = "embeds";

export const cookieConsentConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: { layout: "box", position: "bottom right" },
    preferencesModal: { layout: "box" },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    [EMBEDS_CATEGORY]: {},
  },
  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "Cookies on SUGNL",
          description:
            "We use cookieless analytics. Some pages embed third-party content, such as Google Maps, which may set cookies. You choose whether to load it.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Only necessary",
          showPreferencesBtn: "Manage preferences",
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Only necessary",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Strictly necessary",
              description:
                "Stores your cookie choice (cc_cookie) and theme preference. Our analytics (Vercel Web Analytics) does not use cookies.",
              linkedCategory: "necessary",
            },
            {
              title: "Embedded content",
              description:
                "Loads Google Maps on event pages. Google may set cookies and receive your IP address when the map is shown.",
              linkedCategory: EMBEDS_CATEGORY,
            },
          ],
        },
      },
    },
  },
};
