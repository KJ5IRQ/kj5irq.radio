# Writing

Pieces published to /writing/ live here, one Markdown file per piece, filename
becomes the URL slug. The schema is in `src/content.config.ts` and the design is
docs/website-redesign/06_content_model.md sections 3 and 4.

Required frontmatter: `title`, `summary`, `date`, `kind` (essay, note, analysis,
satire, fiction), `publish: true`, `privacyReviewed: true`.

`privacyReviewed: true` is a claim a human makes and the build cannot check it.
Read the piece once as a stranger, once as the employer, once as family before
setting it. Un-publishing cannot un-commit.

Notes arriving from the private vault through the doc 09 pipeline carry
`source: "vault"`. Nothing else should set that field.

The navigation link and search indexing appear automatically when the first
published piece exists, so the shelf is never linked while it is empty.
