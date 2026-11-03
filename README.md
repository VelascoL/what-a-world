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
- `index.html`, `about.html`, `share.html`: the main pages.
- `examples/story-template.md`: a copyable story template, excluded from the site.

## Validation status

Validated on November 3, 2026 with Jekyll 3.10.0: the site builds successfully,
and all generated local links and assets resolve. Desktop (1440 px) and mobile
(390 px) screenshots of the collection, story, and submission pages were reviewed.
The collection, story, About, and submission pages also passed horizontal-overflow
checks at 320 px. Random-story navigation was checked in the browser.

Story-submission links were checked in the generated collection, About, and story
pages: they point directly to Google Forms in the same tab.


## Documentation

- [GitHub Pages publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Jekyll collections](https://jekyllrb.com/docs/collections/)

