const TRUE_FLAG_VALUES = new Set(["1", "true", "yes", "on"]);

function isEnabled(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return TRUE_FLAG_VALUES.has(value.trim().toLowerCase());
}

export const featureFlags = {
  newsletter: isEnabled(process.env.NEXT_PUBLIC_FEATURE_NEWSLETTER),
};
