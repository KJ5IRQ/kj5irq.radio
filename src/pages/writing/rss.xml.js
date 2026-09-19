import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../data/site';

/* The feed doc 03 plans alongside the writing index. It lists only published
   pieces, and it renders an empty feed rather than failing while the shelf is
   empty, so the URL is stable from the first day. */
export async function GET(context) {
  const pieces = (await getCollection('writing', ({ data }) => data.publish)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${site.name} · writing`,
    description:
      'Essays and working notes from Joshua Ford (KJ5IRQ): systems, radios, and keeping them running.',
    site: context.site,
    items: pieces.map((piece) => ({
      title: piece.data.title,
      pubDate: piece.data.date,
      description: piece.data.summary,
      link: `/writing/${piece.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
