# SUGNL Community Events Website

A simple, cost-effective community events website built with Next.js, TypeScript, and Tailwind CSS. Designed to run efficiently on Vercel.

## Features

- 🎯 **Event Listings**: Display upcoming and past events
- 👥 **Speaker Information**: Showcase speakers and their bios
- 📝 **Event Registration**: Links to each event's registration form (`registrationUrl`)
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast & Lightweight**: Optimized for minimal costs on Vercel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Neon](https://neon.com) Postgres in the EU (Frankfurt), connected through the Vercel Marketplace. It holds the newsletter list and the site banners; see [ADR 0001](docs/adr/0001-self-hosted-newsletter-list-in-eu-postgres.md)
- **Deployment**: Vercel
- **Runtime**: Node.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Project Structure

```
sugnl/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   ├── event/[id]/          # Event detail pages
│   ├── past-events/         # Past events page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
├── lib/                     # Utility functions
│   └── events.ts           # Event data and functions
├── types/                   # TypeScript types
│   └── index.ts            # Type definitions
└── public/                  # Static assets
```

### Adding Events (Template Workflow)

Events are managed as JSON files in `content/events`.

1. Copy `content/events/event.template.json`.
2. Rename it to a unique file, for example `my-new-event.json`.
3. Fill in all fields (`id`, title, date, start/end time, location, activities, speakers, etc.).
4. Run a build.

Agenda is built automatically in this fixed sequence:

1. `Diner`
2. Activity 1 (from `activities[0]`)
3. Activity 2 (from `activities[1]`)
4. `Break`
5. Remaining activities (starting from `activities[2]`)
6. `Drinks and snacks`

Each event must have at least 3 items in `activities`.

Each activity must include:

- `speaker.name`
- `speaker.image`
- `speaker.linkedin` (optional)
- `subject`
- `description`
- `startTime`

During build, Next.js reads these files and statically generates event pages for each event id.

Example event JSON:
```typescript
{
  id: "unique-event-slug",
  title: "Event Title",
  date: "2026-03-15",
  startTime: "18:00",
  endTime: "20:00",
  location: "Location Name",
  description: "Event description...",
  activities: [
    {
      speaker: {
        name: "Speaker Name",
        image: "https://example.com/speaker.jpg",
        linkedin: "https://www.linkedin.com/in/speaker-profile", // optional
      },
      subject: "Activity A",
      description: "What this activity covers.",
      startTime: "18:40",
    },
    {
      speaker: {
        name: "Speaker Name",
        image: "https://example.com/speaker.jpg",
      },
      subject: "Activity B",
      description: "What this activity covers.",
      startTime: "19:10",
    },
    {
      speaker: {
        name: "Speaker Name",
        image: "https://example.com/speaker.jpg",
      },
      subject: "Activity C",
      description: "What this activity covers.",
      startTime: "19:40",
    },
  ],
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository on [Vercel](https://vercel.com)

3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Environment Variables

No environment variables are required for basic functionality. See [.env.example](.env.example) for all variables.

### Newsletter

The newsletter mailing list is self-hosted (see [GLOSSARY.md](GLOSSARY.md) and [docs/adr](docs/adr)). To enable it:

1. Create a Neon Postgres database in an EU region and create the role `sugnl_app` with SQL (see [0003_app_role.sql](db/migrations/0003_app_role.sql)). Run the scripts in [db/migrations](db/migrations) against it as the database owner, in order. Set `DATABASE_URL` to a connection string for `sugnl_app`, never the owner.
2. Create a dedicated mailbox (e.g. `newsletter@sugnl.net`) and set the `SMTP_*` variables.
3. Register a GitHub OAuth App with callback URL `https://<your-domain>/api/auth/callback/github`. Set `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` and the Admins' numeric GitHub IDs in `ADMIN_GITHUB_IDS`.
4. Set `CRON_SECRET` so the daily cleanup job in [vercel.json](vercel.json) can run.
5. Set `NEXT_PUBLIC_FEATURE_NEWSLETTER=true`.

Admins manage Subscribers and the site-wide banner at `/admin`.

## Cost Optimization

This site is designed to run cheaply on Vercel's free tier:

- ✅ Uses static generation where possible
- ✅ Minimal API routes
- ✅ Lightweight styling with Tailwind
- ✅ Optimized images (when added)

## Future Enhancements

- [ ] Admin panel for managing events
- [ ] Calendar integration (iCal/Google Calendar)
- [ ] Social sharing features
- [ ] Photo galleries from past events
- [ ] User authentication for members

## External Blog Feed Sources

The website now supports external RSS blog feeds through a reusable adapter in [lib/blogFeeds.ts](lib/blogFeeds.ts).

- Feed data is loaded on request.
- Responses are cached for 24 hours using Next.js revalidation.
- The home page shows the latest feed items.
- An API endpoint is available at `/api/blogposts`.

To add more sources, append entries to the `blogSources` array in [lib/blogFeeds.ts](lib/blogFeeds.ts):

```ts
{
  id: "my-source",
  name: "My Source",
  websiteUrl: "https://example.com",
  feedUrl: "https://example.com/rss.xml",
}
```

## Production Considerations

For production use, consider:

1. **Email Service**: Add email notifications (Resend, SendGrid)
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **SEO**: Add proper meta tags and structured data
4. **Error Tracking**: Add Sentry or similar service

## License

MIT

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.
