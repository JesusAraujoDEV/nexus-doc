# 0001 — Use 60 s stale queries, lazy routes and blob-backed attachment content

- **Status**: Accepted
- **Date**: 2026-10-17
- **Owner role**: frontend-architect
- **Affects**: `src/App.tsx`, `src/components/layout/AdminLayout.tsx`, `src/hooks/use-attachment-*`, `src/lib/files-api.ts`

## Context

The single bundle was ~733 KB, too heavy for the doctor's phone. The default QueryClient (staleTime 0, refetch on focus) refetched every time she came back from the camera or WhatsApp, and background refetches overwrote forms that copied server data into local state. Attachment content requires the `Authorization` header, so it cannot be used as `<img src>`.

## Decision

Set QueryClient defaults to `staleTime: 60_000`, `refetchOnWindowFocus: false`, `retry: 1`; load every page with `React.lazy`, with `Suspense` inside `AdminLayout` (so the sidebar and bottom-nav stay put) plus one at the root; fetch attachment content as a Blob through TanStack Query (`["attachment-content", id]`, `staleTime: Infinity`) and turn it into an object URL per consumer, revoked on unmount.

Forms that edit server data read their initial values once and are remounted with a `key` to reload (the edit page waits for a fresh fetch with `refetchOnMount: "always"`). All attachment queries live under the `["attachments", ...]` prefix and mutations invalidate that prefix.

## Considered alternatives

- **Keep refetch on focus with a short staleTime** — keeps data fresh across devices. Rejected because on mobile it fires on every return to the app, and it is the trigger of the form-overwrite bugs.
- **Signed/tokenized content URLs from the backend** — would allow `<img src>` and browser caching. Rejected for now: needs a backend contract change; the blob approach works with the current API.
- **Manual chunks (vendor split) only** — less granular than per-route lazy loading for a phone that only opens 2–3 screens.

## Consequences

- **Positive**: smaller initial download; no refetch storms on mobile; typed text is never replaced by a background refetch.
- **Negative**: any mutation that forgets to invalidate shows stale data for up to 60 s (before, a focus refetch hid that). Thumbnails download the full image (no thumbnail endpoint).
- **Neutral**: first visit to each page shows a short spinner while its chunk loads.

## Open coordination points

- `system-architect`: a thumbnail (resized) variant of `GET /files/:id/content` would cut mobile data use in the grids.
