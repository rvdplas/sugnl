# SUGNL

## Dependencies

Install every new package at its current stable version: look it up with `npm view <pkg> version`, then install `<pkg>@<that version>`. Before calling a feature done, run `npm audit --omit=dev` and report anything high or critical.

When a peer dependency range holds a package back, name the blocker and the version gap to the user, then choose together. nodemailer is the precedent: `next-auth` 5 beta lists it as an optional peer up to `^8`, which only matters for its email sign-in, and this site signs Admins in with GitHub. The `overrides` entries in `package.json` record each accepted gap; drop an entry once the package's own range covers the installed version:

- next-auth and @auth/core accept nodemailer 10.
- eslint-plugin-import, -jsx-a11y and -react (bundled in eslint-config-next) accept ESLint 10; they declare support up to 9.

TypeScript stays on 6.x: Next.js type-checks through TypeScript's JavaScript API, which TypeScript 7 does not ship.
