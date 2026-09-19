// One list, two consumers.
//
//   scripts/privacy-grep.mjs  scans the built site in dist/ after astro build
//   scripts/vault-sync.mjs    scans vault notes on their way into the repo
//
// They are the same policy at two different moments, and two hand-maintained
// copies of this list would drift in silence, which is the one failure mode a
// privacy gate cannot have. Change it here and both gates change together.

export const patterns = [
  { name: 'RFC1918 IP (192.168.x.x)', re: /\b192\.168\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (10.x.x.x)', re: /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'RFC1918 IP (172.16-31.x.x)', re: /\b172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/ },
  { name: 'ZIP code 76067', re: /76067(?!\/?")/ },
  { name: 'Employer name', re: /nextlink/i },
  { name: 'Parent company', re: /AMG Technologies/i },
  { name: 'Vault codename', re: /pensieve/i },
  { name: 'Private project name', re: /H\.A\.G\./ },
  { name: 'Key assignment', re: /(api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}/i },
  { name: 'Local filesystem path', re: /(\/home\/[a-z0-9_]+\/|C:\\Users\\)/i },
];

// No exceptions. The WxBot repo was renamed from WxBot_76067 to wxbot so its URL
// no longer carries the ZIP. Keep this list empty unless a legitimate exception is
// deliberately approved; the previous single entry was the hole this closes.
export const allow = [];
