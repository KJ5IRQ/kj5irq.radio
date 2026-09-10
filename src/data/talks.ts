// Static talks inventory. Title, date, and venue are the record.
// Recording URLs are optional and may rot; the page must still make sense without them.
export type Talk = {
  title: string;
  date: string;
  venue: string;
  venueUrl: string;
  recordingUrl?: string;
};

export const talks: Talk[] = [
  {
    title: 'AI Part 2',
    date: '2026-08-11',
    venue: 'Absolute Tech',
    venueUrl: 'https://www.absolutetech.org/',
    recordingUrl:
      'https://www.iheart.com/podcast/269-absolute-tech-84548459/episode/artificial-inteligence-pt-2-08112026-342336610',
  },
  {
    title: 'AI Basics / AI Agents',
    date: '2026-06-30',
    venue: 'Absolute Tech',
    venueUrl: 'https://www.absolutetech.org/',
  },
  {
    title: 'AI Basics 101: What It Is, Why It Matters',
    date: '2026-05-05',
    venue: 'Absolute Tech',
    venueUrl: 'https://www.absolutetech.org/',
  },
];
