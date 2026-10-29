# SUGNL

## Dependencies

Install every new package at its current stable version: look it up with `npm view <pkg> version`, then install `<pkg>@<that version>`. Before calling a feature done, run `npm audit --omit=dev` and report anything high or critical.

When a peer dependency range holds a package back, name the blocker and the version gap to the user, then choose together. nodemailer is the precedent: `next-auth` 5 beta lists it as an optional peer up to `^8`, which only matters for its email sign-in, and this site signs Admins in with GitHub. The `overrides` entry in `package.json` lets next-auth accept nodemailer 10; drop it once next-auth's range includes the installed nodemailer.
