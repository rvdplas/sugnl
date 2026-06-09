const SITECORE_MVP_BASE_URL = "https://mvp.sitecore.com";
const NETHERLANDS_COUNTRY_ID = 150;

export interface DutchMvp {
  name: string;
  type: string;
  profileUrl: string;
  photoUrl: string;
}

const MVP_CARD_REGEX = /<a href="(\/en\/Directory\/Profile\?id=[^"]+)"\s+class="card m-0 h-100">[\s\S]*?<img src="([^"]+)" class="card-img-top" alt="[^"]*"\s*\/>[\s\S]*?<h5 class="card-title">([^<]+)<\/h5>[\s\S]*?<div>([^<]+)<\/div>[\s\S]*?<span class="card-text"><i class="fa fa-globe" aria-hidden="true"><\/i>\s*([^<]+)<\/span>/gi;

function decodeHtml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

export function getDutchMvpDirectoryUrl(year: number): string {
  const params = new URLSearchParams({
    q: "",
    fc_year: String(year),
    fc_country: String(NETHERLANDS_COUNTRY_ID),
  });

  return `${SITECORE_MVP_BASE_URL}/Directory?${params.toString()}`;
}

function toAbsoluteSitecoreUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITECORE_MVP_BASE_URL}${url}`;
}

export async function getDutchMvpsForYear(year: number): Promise<DutchMvp[]> {
  const directoryUrl = getDutchMvpDirectoryUrl(year);

  const response = await fetch(directoryUrl, {
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load MVP directory for ${year}`);
  }

  const html = await response.text();
  const mvps: DutchMvp[] = [];

  for (const match of html.matchAll(MVP_CARD_REGEX)) {
    const href = match[1];
    const photoUrl = match[2];
    const name = match[3];
    const type = match[4];
    const country = match[5];

    if (!href || !photoUrl || !name || !type || !country) {
      continue;
    }

    if (decodeHtml(country).toLowerCase() !== "netherlands") {
      continue;
    }

    mvps.push({
      name: decodeHtml(name),
      type: decodeHtml(type),
      profileUrl: `${SITECORE_MVP_BASE_URL}${href}`,
      photoUrl: toAbsoluteSitecoreUrl(decodeHtml(photoUrl)),
    });
  }

  return mvps.sort((a, b) => a.name.localeCompare(b.name));
}
