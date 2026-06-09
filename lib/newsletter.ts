export interface NewsletterSubscribeInput {
  email: string;
  firstName?: string;
}

export interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
}

const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID);
}

export async function subscribeToNewsletter({
  email,
  firstName,
}: NewsletterSubscribeInput): Promise<NewsletterSubscribeResult> {
  if (!isBrevoConfigured()) {
    console.warn(
      "Newsletter sign-up received but Brevo is not configured. Set BREVO_API_KEY and BREVO_LIST_ID."
    );

    return {
      success: true,
      message: "Thanks for subscribing!",
    };
  }

  const listId = Number(process.env.BREVO_LIST_ID);
  if (!Number.isFinite(listId)) {
    return {
      success: false,
      message: "Newsletter provider is misconfigured (invalid BREVO_LIST_ID).",
    };
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY ?? "",
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: {
        ...(firstName ? { FIRSTNAME: firstName } : {}),
        SOURCE: "sugnl-website",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Brevo subscribe error:", errorText);

    return {
      success: false,
      message: "Unable to subscribe right now. Please try again shortly.",
    };
  }

  return {
    success: true,
    message: "Thanks for subscribing!",
  };
}
