import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="py-24">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
    </PageContainer>
  );
}
