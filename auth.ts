import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Admins are GitHub numeric user IDs listed in ADMIN_GITHUB_IDS (comma separated).
// The list lives only in environment configuration because this repository is public.
// See docs/adr/0002-admin-sign-in-with-github-allowlist.md
function isAdminGitHubId(githubId: string | undefined): boolean {
  if (!githubId) {
    return false;
  }

  const adminIds = (process.env.ADMIN_GITHUB_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return adminIds.includes(githubId);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      // Identity only: no email address or avatar is requested or kept.
      authorization: { params: { scope: "read:user" } },
      profile(profile) {
        return { id: String(profile.id), name: profile.login };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin", error: "/admin" },
  callbacks: {
    signIn({ account, profile }) {
      return account?.provider === "github" && isAdminGitHubId(profile?.id?.toString());
    },
    jwt({ token, profile }) {
      if (profile?.id) {
        token.githubId = profile.id.toString();
      }

      return token;
    },
    // Re-checked on every request, so removing an ID from the allowlist revokes access.
    session({ session, token }) {
      session.isAdmin = isAdminGitHubId(token.githubId);
      return session;
    },
  },
});
