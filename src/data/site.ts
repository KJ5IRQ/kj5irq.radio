export const site = {
  name: 'Joshua Ford',
  callsign: 'KJ5IRQ',
  location: 'Texas',
  email: 'kj5irq@gmail.com',
  url: 'https://kj5irq.radio',
  defaultTitle: 'Joshua Ford · systems, radio, automation (KJ5IRQ)',
  defaultDescription:
    'Joshua Ford (KJ5IRQ) builds and runs systems in Texas: NetSuite administration at the director level, an AllStarLink node with its own API and MCP server, a homelab, and practical AI tooling.',
  github: 'https://github.com/kj5irq',
  linkedin: 'https://www.linkedin.com/in/kj5irq',
  qrz: 'https://www.qrz.com/db/KJ5IRQ',
  /* Live weather, served by our own Worker on its own subdomain. Not the apex:
     a Worker route only runs on a Cloudflare-proxied hostname and the apex is a
     DNS-only CNAME to GitHub Pages. Same registrable domain, so this is still a
     first-party request. See cloudflare/wx/. */
  weatherEndpoint: 'https://wx.kj5irq.radio/weather.json',
};

export const clusterLabels: Record<string, string> = {
  radio: 'Radio',
  'ai-tooling': 'AI tooling',
  homelab: 'Homelab',
  utilities: 'Utilities',
  'business-systems': 'Business systems',
};
