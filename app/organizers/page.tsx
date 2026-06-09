import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";

export default function OrganizersPage() {
  const organizers = [
    {
      name: "Bas Lijten",
      linkedin: "https://www.linkedin.com/in/baslijten/",
      image: "/aboutus/baslijten.jpg"
    },
    {
      name: "Ronald van der Plas",
      linkedin: "https://www.linkedin.com/in/rvdplas/",
      image: "/aboutus/ronaldvanderplas.jpg"
    },
    {
      name: "Theo de Wolf",
      linkedin: "https://www.linkedin.com/in/theodewolf1/",
      image: "/aboutus/theodewolf.jpg"
    }
  ];

  return (
    <PageContainer>
      <PageIntro
        title="About us"
        description="Meet the team behind SUGNL community events"
      />

      <div className="grid gap-8 md:grid-cols-3">
        {organizers.map((organizer) => (
          <div
            key={organizer.name}
            className="surface-card overflow-hidden p-6 text-center"
          >
            <img
              src={organizer.image}
              alt={organizer.name}
              className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
            />
            <h2 className="mb-3 text-xl font-bold text-[color:var(--ink)]">
              {organizer.name}
            </h2>
            <a
              href={organizer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--link)] hover:underline"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn Profile
            </a>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
