# Antigravity Project Instructions

## Project

This is a personal birthday website for the user's girlfriend.

The site is intentionally designed as a **little universe**, not a normal collection of webpage cards.

The core visual concept is:

**outer space + Earth + orbiting/floating memories + romantic atmosphere.**

## Non-negotiable design direction

1. Keep Earth and outer space as the main visual environment.
2. Keep the floating/orbiting photos around Earth.
3. Do not replace the Earth/space experience with a generic hero section or normal card grid.
4. The main greeting should say **"my babyyyyyyyy"** with hearts. Do not make "Adolisa" the main greeting.
5. Keep the experience romantic, cinematic, intimate and personal.
6. The site must work well on phones.
7. Keep animations elegant and lightweight.
8. Preserve the user's existing visual style when adding new pages or features.
9. Do not add a backend unless explicitly requested.
10. Do not turn the site into a generic portfolio, dashboard, template or ecommerce design.

## Assets

### Photos

User photos go in:

`assets/images/photo-1.jpg` through `assets/images/photo-6.jpg`

The photos should appear as floating memories orbiting Earth.

If more photos are needed, extend the orbit system instead of creating a generic gallery first.

### Video

The couple's video goes here:

`assets/videos/us.mp4`

Keep the video separate from the photo assets.

### Music

The chosen song is:

**Solar Plexus by Marshall Vincent**

The website provides a YouTube Music button.

Do not assume external YouTube Music audio can autoplay in the background. Modern browsers often block autoplay until the user interacts.

The optional local audio path is:

`assets/audio/solar-plexus.mp3`

Only use a local audio file supplied by the user or otherwise properly licensed for use.

## Birthday message

The birthday letter must preserve this exact emotional idea:

**"I hope it feels like your birthday now, my love."**

The user specifically wanted the message to acknowledge that she had been saying she was not feeling her birthday.

Keep the writing human and sincere. Avoid corporate, overly polished or obviously AI-generated wording.

## Friends' messages

Friend messages must remain directly editable inside `index.html`.

Do not create separate text files for friend messages unless the user explicitly asks for a different architecture.

## Editing rules

When changing the project:

- Read `AGENTS.md` first.
- Preserve the Earth and orbit system.
- Preserve the separate `assets/images`, `assets/videos`, and `assets/audio` folders.
- Do not remove the existing memory lightbox.
- Do not remove the mobile responsive behavior.
- Do not replace the heartfelt message with generic birthday copy.
- Test that image paths still point to `assets/images/...`.
- Test that the video path still points to `assets/videos/us.mp4`.
- Test that the stylesheet and script are still loaded by `index.html`.

## Deployment

The project is plain HTML/CSS/JavaScript and should remain GitHub Pages friendly.

No server-side code is required.
