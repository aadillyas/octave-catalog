# Octave Product Catalogue

Client-facing platform for exploring Octave's 60+ AI and data use cases across five industry verticals.

## Structure

```
catalog/          Content — one folder per use case, populated by the delivery team
scripts/          generate_use_case.py — run locally to generate schema files from source docs
src/              React frontend (Vite)
```

## Adding a Use Case

1. Create the folder under `catalog/Industry/Value_Chain/Use_Case_Name/`
2. Drop `solution_blueprint` and `pilot_results` documents into the `source/` subfolder
3. Run the generation script (see `scripts/` for usage)
4. Review and approve the generated files in `schema/`
5. Update `metadata.md` status to `Approved`
6. Commit to `draft` branch → open PR to `main` → merge
7. Vercel auto-deploys. Use case is live within ~90 seconds.

## Environment Variables

Copy `.env.example` to `.env.local` and add your Anthropic API key.
Set `VITE_ANTHROPIC_API_KEY` in Vercel project settings for production.

## Branches

- `main` — production. Only Approved use cases reach the live site.
- `draft` — work in progress. All new content is committed here first.
