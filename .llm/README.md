# LLM Guide -- CV Customization

This document is the entry point for LLM agents that need to generate a
customized CV URL for a specific job offer.

## Dynamic endpoint (recommended)

The full technology catalog and customization instructions are available at:

    GET /api/llm-guide

This endpoint is dynamically generated and always contains the up-to-date
catalog. Use it as the primary reference for building CV URLs.

## How it works

The CV is a Next.js app. When query parameters describe a job offer, the
page renders match badges showing how the candidate's experience aligns
with the requirements.

## Data source

All CV content (FR + EN) lives in a single file:

    data/cv/bundle.json

The match catalog (skill/framework ids and text tokens used for matching)
is derived from this same file at server startup by
`lib/match-catalog-from-bundle.ts`. There is no separate catalog JSON.

## Quick reference -- query parameters

```
GET /{lang}?company=<name>&requirement=<Label:kw1,kw2>[&...]
```

| Parameter     | Required | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `company`     | yes      | Company name                                       |
| `title`       | no       | Job title (applied to both FR and EN)              |
| `title_fr`    | no       | French job title                                   |
| `title_en`    | no       | English job title                                  |
| `requirement` | yes (1+) | Repeatable. Format: `Label:keyword1,keyword2`      |
| `req`         | alias    | Short alias for `requirement`                      |
| `reqY`        | no       | Override displayed years for the i-th requirement  |
| `contract`    | no       | `cdi` or `freelance` (hides Malt link when `cdi`)  |
| `spec`        | no       | Base64url JSON blob (overrides other offer params) |
| `id`          | no       | Internal offer identifier                          |

### Requirement format

Each `requirement` value follows the pattern `Label:keyword1,keyword2`:

- **Label** (before `:`) -- displayed in the match table.
- **Keywords** (after `:`, comma-separated) -- matched against the CV's
  skill catalog. Use lowercase text or catalog `@id` references.

Example:

```
requirement=React:react,nextjs,typescript
requirement=Cloud+AWS:aws,ec2,s3,lambda
```

### Catalog ids

To get the best matching results, use catalog ids from `bundle.json`:

1. Read `data/cv/bundle.json`.
2. Collect ids from `fr.allSkillsModels`, `en.allSkillsModels`, and each
   locale's `allJobsModels[].frameworks[]`.
3. Reference them as `requirement=Label:@<id>` (encode `@` as `%40` in
   the URL if needed).

Plain text keywords also work (the matcher is punctuation-insensitive).

### Contract type

The `contract` parameter adapts the CV for the type of position:

- `contract=cdi` -- adapts profile and domain texts for a permanent
  position, hides the Malt freelance link.
- `contract=freelance` -- freelance texts and Malt link (default when omitted).

## Example URLs

French, two requirements:

```
/fr?company=Safran&title=Dev+Full+Stack&requirement=Java:java,spring&requirement=Docker:docker,kubernetes&contract=cdi
```

English, with catalog id:

```
/en?company=Acme&title=Engineer&requirement=React:@abc123&requirement=AWS:aws,s3
```

## Compact base64 alternative

For many requirements or automated generation, encode the offer as JSON
in base64url and pass it as `spec`:

```
GET /{lang}?spec=<base64url>
```

The JSON schema supports: `company`, `title` (string or `{fr, en}`),
`requirements` (array of `{label, keywords}`), `contract`, `id`, `url`.

See `lib/dynamic-offer-spec.ts` for encoding helpers.

## Key project files

| File                               | Role                                 |
| ---------------------------------- | ------------------------------------ |
| `data/cv/bundle.json`              | All CV content (FR + EN)             |
| `lib/match-catalog-from-bundle.ts` | Derives match catalog from bundle    |
| `lib/query-offer-params.ts`        | Parses URL query params into offer   |
| `lib/dynamic-offer-spec.ts`        | JSON <-> base64url encoding          |
| `lib/cv-contract-text.ts`          | Resolves CDI/freelance text variants |
| `app/[lang]/page.tsx`              | Main CV page (handles offer params)  |
| `app/[lang]/short/page.tsx`        | Short (1-page) CV                    |
| `app/api/llm-guide/route.ts`       | Dynamic LLM guide with tech catalog  |
