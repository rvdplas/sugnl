import { permanentRedirect } from "next/navigation";

export default function BlogRedirectPage() {
  permanentRedirect("/community-blogs");
}
