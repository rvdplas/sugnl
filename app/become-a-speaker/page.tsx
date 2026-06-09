import Link from "next/link";
import SpeakerSignupForm from "@/components/SpeakerSignupForm";

export default function BecomeSpeakerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-black [font-family:var(--font-heading)] md:text-5xl">
          Speak at SUGNL
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[color:var(--muted)]">
          SUGNL is a community stage for people who want to share practical, innovative, and sometimes slightly wild ideas with fellow Sitecore professionals. If you have a story, experiment, lesson learned, or fresh perspective that could help the community, we want to hear it.
        </p>
      </header>

      <div className="surface-card space-y-6 p-6 text-[color:var(--ink)] md:p-8">
        <p>
          We actively want to create room for new speakers. If you have never presented before, that is not a disadvantage here. In fact, when we review submissions, we give extra weight to strong ideas from people who are not already MVPs. We love experienced speakers too, but we also want to help new voices grow, get on stage, and take that next step.
        </p>

        <p>
          If you have an idea or a rough pitch, send it to one of the organizers on LinkedIn. Tell us what you want to present, why it matters, and what the audience will take away from it. A polished abstract is welcome, but not required. A clear idea is enough to start the conversation.
        </p>

        <p>
          All speaker ideas are discussed by the organizers, after which we make a selection for the event lineup. We aim for a balanced agenda with useful, relevant, and inspiring sessions.
        </p>

        <div className="pt-2">
          <Link
            href="/organizers"
            className="inline-flex items-center rounded-full border border-[color:var(--nav-line)] bg-[color:var(--button-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--button-primary-hover)]"
          >
            Contact the organizers
          </Link>
        </div>
      </div>

      {/* <SpeakerSignupForm /> */}
    </div>
  );
}
