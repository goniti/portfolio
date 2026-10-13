# Changelog

All notable changes are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.0] - 2026-10-13

First public release: the home page implements the Portfolio v2 design.

### Added

- Navigation bar with an EN/FR language switch and a light/dark theme toggle (dark by default).
- Scroll progress bar and scroll-spy that highlights the current section in the navigation.
- Hero section with a typewriter terminal and an "Open to work" status.
- Experience timeline.
- Skills section.
- Projects section with filters.
- Tech-watch notes, each readable in a dialog.
- Contact section with a form that opens your mail client (`mailto:`).
- Optional "Book a call" tab: set `NEXT_PUBLIC_CALENDLY_URL` to a Calendly page to show it; leave it empty to hide it.
- Footer.
- Custom cursor follower effect, disabled when reduced motion is requested or the pointer is coarse (touch).
- Design tokens from the Meeple design system in `app/globals.css`.
- Self-hosted DM Sans and JetBrains Mono fonts.
- Shared UI wrappers over goniui: `CtaButton`, `Tag`, `Surface`, `SectionHeading` and `PageSection`.

### Removed

- The starter `Counter` component.
