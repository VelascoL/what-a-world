# What a world, huh?

A field journal for nature stories.

## Publish on GitHub

1. Create a **new public repository** named **what-a-world** under **VelascoL**.
   Keep the academic website's repository separate. You can initialize the new
   repository with a README so its `main` branch exists.
2. Unzip the download. Open the `what-a-world` folder and upload **its contents**
   to the repository using **Add file → Upload files**. Drag in the folders too.
   `index.html`, `_config.yml`, `_layouts`, `_stories`, and `assets` must appear
   at the repository root, not inside a second `what-a-world` folder.
3. Edit `_config.yml` and put the public URL of your existing submission form
   in `submission_url`. Leave `submission_embed_url` empty unless your form
   provider supplies a supported iframe embed URL.
4. Review the six files in `_stories`. They are fictional design samples, clearly
   labeled on the website. **Remove the sample files before your public launch**
   and add accounts you have permission to publish. With no stories, the home
   page shows a simple invitation to contribute.
5. Open **Settings → Pages**. Under **Build and deployment**, choose
   **Deploy from a branch**, then **main** and **/(root)**. Click **Save**.
6. GitHub builds the website. Check the **Actions** tab for the Pages build and
   deployment result. Once it succeeds, your address should be:
   **https://velascol.github.io/what-a-world/**

The package is configured for that repository name and account. If you choose
another repository name, update `baseurl` to `/<your-repository-name>` in
`_config.yml`. For another account, update `url` too. A custom domain can be
connected later; at that point `url` and `baseurl` should match the final address.

## Add a story

Copy `examples/story-template.md` into `_stories` with a short filename such as
`first-cicada.md`. You can also use **Add file → Create new file** on GitHub and
enter `_stories/first-cicada.md` as the filename.

```markdown
---
title: "The first cicada"
contributor: "Anonymous"
place: "An ordinary afternoon"
order: 1
sample: false
---

The first paragraph appears as the excerpt on the collection page.

The rest of the account goes here. Leave a blank line between paragraphs.
```

- Use the contributor's chosen public name, or `Anonymous`.
- `place` is optional and can be a broad setting rather than a precise location.
- Lower `order` numbers appear earlier. The first entry receives more space.
- Keep `sample: false` for real accounts. This flag labels examples; it is not
  a publication-permission or privacy control.
- Commit the file. GitHub rebuilds the site automatically.

Everything committed to a public repository is public, including its history.
Keep emails, submission exports, unpublished drafts, and permission records in
your private form account. Add only the approved public version to `_stories`.

## How submissions work

GitHub Pages displays the journal. The existing form service collects accounts.
All story-submission links open the configured Google Form directly in the same tab.
The old Share page remains available at `/share/` for existing bookmarks.
Submissions do not automatically publish. You review them and add approved
accounts as Markdown files.

When `submission_url` is empty, the Share page says the form is coming soon and
does not show a nonworking submit button. This package does not invent a form
destination or copy contact information into public files.

## Local preview (optional)

You do **not** need Ruby or Jekyll installed to use the GitHub upload steps above.
For local development with a compatible Ruby/Bundler installation:

```sh
bundle install
bundle exec jekyll serve
```

Open the address Jekyll prints, including `/what-a-world/`.

## Files

- `_config.yml`: site address and form URL.
- `_stories/`: approved public stories (currently fictional samples).
- `_layouts/`: shared page structure and story layout.
- `assets/site.css`: the field-journal design.
- `assets/site.js`: random-story navigation.
- `assets/scenes.css`, `assets/scenes.js`: habitat layout and animation controls.
- `assets/underwater/`: water artwork, transparent sprite sheets, and frame timings.
- `index.html`, `about.html`, `share.html`: the main pages.
- `examples/story-template.md`: a copyable story template, excluded from the site.

## Validation status

The underwater addition builds with Jekyll 3.10.0. Scene selection, frame playback,
pause/resume, reduced motion, tab visibility, unavailable storage, and a failed
animation-metadata request were checked in an isolated JavaScript harness.
The new layout still needs a visual check in a browser; the earlier screenshot
checks below apply to the previous journal layout.

Validated on November 3, 2026 with Jekyll 3.10.0: the site builds successfully,
and all generated local links and assets resolve. Desktop (1440 px) and mobile
(390 px) screenshots of the collection, story, and submission pages were reviewed.
The collection, story, About, and submission pages also passed horizontal-overflow
checks at 320 px. Random-story navigation was checked in the browser.

Story-submission links were checked in the generated collection, About, and story
pages: they point directly to Google Forms in the same tab.


## Choosing a habitat

Use **Your surroundings** in the footer to switch between **Forest floor**
and **Underwater**. The selector and movement control sit at the bottom of the
journal in the footer. On a fresh tab visit, either habitat is selected with
equal probability before the styles load. Session storage keeps it through
story navigation and refreshes; a manual selection replaces it for that visit.
Closing the tab ends the visit (a browser restoring a saved session may restore
its choice). Previous permanent habitat preferences are no longer used; the
pause preference remains saved. When session storage is disabled, a random
choice still works on each page and the selector remains available.

For a direct underwater preview, append `?scene=underwater` to any page URL,
for example `http://localhost:4000/?scene=underwater` when previewing at the root.
An explicit habitat URL overrides the random choice and becomes the choice for
that tab visit. Use the plain site URL to try randomized selection.
The underwater animals follow the drawn routes across the full background,
passing behind the journal. The vent appears below the journal
at the end of the page. On narrow screens, the margins shrink to preserve reading
space. **Pause movement** freezes travel, sprite frames, and bubbles. Reduced-motion preferences
start the scene paused, and hidden tabs stop animation work.

Starting times are staggered so the margins have fewer empty stretches and fewer
simultaneous arrivals, at the same swimming speeds. Three jellyfish of different
sizes follow separate upward paths: the original diagonal to the right, a
leftward ascent in the right margin, and a nearly vertical ascent in the left
margin. Their travel and tentacle cycles are staggered.
Four faint pixel bubbles rise
slowly in the margins; they share the creatures' pause and reduced-motion behavior.

The underwater journal is at most 820 pixels wide on desktop, leaving wider
water margins. Compared with the first trajectory preview, the moray and blue
fish have roughly 35% larger target sizes and the jellyfish 25%.
The school now has a target width of 176 scene units, up from 107, and uses its
original 176:105 frame proportions so the individual fish are not stretched.
Sizes still adapt to the available margin; the yellow fish keep their smaller scale.

The supplied 360 × 640 water image is `assets/underwater/water.png`. Animal
animations use PNG frame grids with timings in `sprites.json`. The school uses
the original Aseprite animation layer's transparency, including the gaps between
fish, instead of the GIF's dark background. The remaining near-black matte color
is also transparent in all four frames; the fish's gray and silver colors and
flashing highlights are preserved. The school image has a versioned URL, and
the scene stylesheet's build timestamp ensures updates bypass cached styles.
The school and jellyfish keep their
body-animation cycles. The moray and blue fish use complete
poses with body waves that travel from head to tail; their heads stay steady and
their tails flex most. The blue fish redraws its broader wave 25 times per second
instead of switching between four poses. Both canvases have extra space above
and below so the motion stays unclipped. The upper yellow fish uses a complete
pose. The bottom orange fish alternates the original GIF's two fin poses at
150 ms per frame, with its body aligned in a padded transparent frame. The
matching poses in the supplied `1fish.png` strip recover a complete nose and
tail without carrying over the GIF's movement out of the frame. Fin animation
and swimming both stop with Pause movement or reduced-motion preferences.
Their original GIF exit sequences do not clip them inside an
invisible box. Travel paths in
`assets/scenes.js` move each whole creature across the scene and adapt to its size.
The moray, school, and blue fish travel left in horizontal lanes. The upper yellow
fish travels right. The jellyfish follow their separate upward paths. The lower
yellow fish travels left across the full-width seafloor section. Each loop resets
only after the complete animal has left a scene edge; the vent stays fixed.
The journal placeholder is replaced by the site's real HTML content. Creature
positions live in `assets/scenes.css`; the seafloor is a separate section so a
long story does not permanently cover the vent.

## Documentation

- [GitHub Pages publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Jekyll collections](https://jekyllrb.com/docs/collections/)

