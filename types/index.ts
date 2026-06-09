export interface Speaker {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
}

export interface ActivitySpeaker {
  name: string;
  image: string;
  linkedin?: string;
}

export interface Activity {
  type?: string;
  speaker?: ActivitySpeaker;
  subject: string;
  description?: string;
  startTime: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationUrl?: string;
  registrationUrl: string;
  description: string;
  activities: Activity[];
  isPast: boolean;
}

export interface RSVP {
  eventId: string;
  name: string;
  email: string;
  timestamp: string;
}

export interface BlogSource {
  id: string;
  name: string;
  websiteUrl: string;
  feedUrl: string;
}

export interface BlogPost {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  excerpt?: string;
  publishedAt: string;
}
