# My Baby's Birthday Universe

This is the birthday website rebuilt around the original idea:

**Earth + outer space + floating memories + a heartfelt birthday letter + our video + friends' messages + Solar Plexus.**

## Folder layout

```text
birthday_website_antigravity/
├── index.html
├── style.css
├── script.js
├── AGENTS.md
├── README.md
└── assets/
    ├── audio/
    │   └── solar-plexus.mp3        <- optional local copy
    ├── images/
    │   ├── earth.svg
    │   ├── photo-1.jpg
    │   ├── photo-2.jpg
    │   ├── photo-3.jpg
    │   ├── photo-4.jpg
    │   ├── photo-5.jpg
    │   ├── photo-6.jpg
    │   └── video-poster.jpg
    └── videos/
        └── us.mp4
```

## Where to put the photos

Put the real photos here:

- `assets/images/photo-1.jpg`
- `assets/images/photo-2.jpg`
- `assets/images/photo-3.jpg`
- `assets/images/photo-4.jpg`
- `assets/images/photo-5.jpg`
- `assets/images/photo-6.jpg`

You can add more orbiting memories later by copying a `.memory` block in `index.html`.

## Where to put the video

Put the video of you two here:

`assets/videos/us.mp4`

The video is intentionally separate from the photos so the project stays easy to manage.

## The song

The selected song is:

**Solar Plexus by Marshall Vincent**

The main button opens YouTube Music search for the exact title and artist.

Browsers, especially on phones, normally block websites from automatically starting external music in the background. That is why the site uses a user-triggered YouTube Music button.

If you have a local copy that you are allowed to use, you can put it here:

`assets/audio/solar-plexus.mp3`

The site has a local play button for it.

## Friends' messages

Friend messages are deliberately written directly inside `index.html`.

Find:

```html
<section class="friends-section section-shell">
```

Then replace:

- `Friend Name 1`
- `Friend Name 2`
- etc.

with the real names and messages.

## Important

Do not rename the main files unless you also update their references.

The project is plain HTML, CSS and JavaScript, so it can be hosted directly on GitHub Pages without a backend.

## Antigravity

`AGENTS.md` is included as the project instruction file. It tells Antigravity what the project is, what must not be changed casually, where assets belong, and what the intended visual experience is.
