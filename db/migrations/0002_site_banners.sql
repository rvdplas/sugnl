-- Site-wide banners, managed by Admins at /admin/banner. active = FALSE means an Admin removed it.
-- Visitors close banners by id, so a new banner shows again to everyone.
-- message holds plain text with optional links written as [link text](/page).
-- starts_on and ends_on are Dutch calendar days, both inclusive.
-- No start: shows right away. No end: shows until an Admin removes it.

CREATE TABLE IF NOT EXISTS site_banners (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  starts_on DATE,
  ends_on DATE,
  dismissible BOOLEAN NOT NULL DEFAULT TRUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_banners (message)
SELECT 'Never miss a SUGNL event. [Subscribe to the newsletter](/newsletter)'
WHERE NOT EXISTS (SELECT 1 FROM site_banners);
