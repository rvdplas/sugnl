-- The website connects as sugnl_app, which can only read and write these tables.
-- Migrations keep running as the database owner (neondb_owner).
-- Create the role first with SQL, not in the Neon console: console roles join neon_superuser.
--   CREATE ROLE sugnl_app WITH LOGIN PASSWORD '<openssl rand -hex 32>';
-- The password stays out of this public repository.
-- A migration that adds a table grants sugnl_app what the website needs on it.

GRANT USAGE ON SCHEMA public TO sugnl_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON newsletter_subscribers TO sugnl_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON newsletter_pending_subscriptions TO sugnl_app;

-- No DELETE: an Admin removing a banner sets active = FALSE.
GRANT SELECT, INSERT, UPDATE ON site_banners TO sugnl_app;
GRANT USAGE ON SEQUENCE site_banners_id_seq TO sugnl_app;
