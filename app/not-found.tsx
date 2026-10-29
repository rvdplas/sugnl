import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { primaryButtonClassName } from "@/components/event/styles";

export default function NotFound() {
  return (
    <PageContainer className="py-24">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="mb-8 text-(--muted)">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className={primaryButtonClassName}
      >
        Go Back Home
      </Link>
    </PageContainer>
  );
}
