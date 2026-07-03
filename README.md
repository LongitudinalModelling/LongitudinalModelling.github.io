# Longitudinal Modelling Group Website

This is the website for the Longitudinal Modelling Group, a research group based at the University of Bristol. The Longitudinal Modelling Group develops, uses, and teaches innovative statistical methods for the analysis of repeated measures data to better understand health trajectories across the life course.

The site is built with [Jekyll](https://jekyllrb.com/) (using a customised Petridish theme) and hosted on GitHub Pages.

## Contents

*   [Website Structure](#website-structure)
*   [Running the Site Locally](#running-the-site-locally)
*   [How the Site is Deployed](#how-the-site-is-deployed)
*   [Repository Structure](#repository-structure)
*   [Contributing to the Website](#contributing-to-the-website)
*   [Adding Content](#adding-content)
*   [Editing Existing Pages](#editing-existing-pages)
*   [License](#license)

## Website Structure

The site contains the following sections (see `_data/navigation.yml` for the navbar):

*   **Home:** Welcome page with an overview of the group's activities.
*   **Research:** Detailed information about the group's research themes and methods.
*   **Publications:** Featured Methods and Applied papers shown as cards, plus a full "All Publications" list grouped by year.
*   **Software:** Information and links to software tools developed by the group.
*   **Seminars:** Announcements and details about the group's Seminar Series.
*   **Learn:** Details on courses, and training materials and resources for researchers.
*   **People:** Profiles of the research group members.
*   **News:** News and updates from the group.
*   **Join:** Contact and collaboration details.

## Running the Site Locally

Preview your changes locally before opening a pull request.

**Prerequisites:** [Ruby](https://www.ruby-lang.org/) and [Bundler](https://bundler.io/) (`gem install bundler`).

1.  Install the dependencies (first time only):

    ```sh
    bundle install
    ```

2.  Start the local server:

    ```sh
    bundle exec jekyll serve
    ```

3.  Open the site in your browser at [http://localhost:4000](http://localhost:4000). The server rebuilds automatically as you edit files — just refresh the page.

> The Windows-specific dependencies (`wdm`, `webrick`) are already listed in the `Gemfile`, so no extra setup is needed on Windows.

## How the Site is Deployed

The live site is built and hosted automatically by **GitHub Pages**. When changes are merged into the `master` branch, GitHub Pages rebuilds and publishes the site — no manual deployment step is required. This means a merged pull request is all it takes to update the live website (allow a minute or two for the rebuild).

## Repository Structure

Key directories a contributor is likely to touch:

| Path | What it holds |
| --- | --- |
| `_data/` | Site content in YAML: `publications.yml`, `people.yml`, `software.yml`, `collaborators.yml`, `navigation.yml`, `footer.yml`. |
| `pages/` | The main pages (Research, Software, Seminars, Contact, etc.) as Markdown. |
| `_posts/` | News / blog posts, one Markdown file per post. |
| `_layouts/` + `_includes/` | Page templates and reusable HTML snippets. |
| `_sass/` + `assets/` | Styling (SCSS) and media (images, CSS, JS). |
| `training/` | Training guides and resources. |

> `search.json` is generated automatically from the pages and `_data/publications.yml` — do not edit it by hand.

## Contributing to the Website

We welcome contributions to our website from all group members. This guide provides instructions on how to add and update content.

### General Workflow

For any changes, please follow this general workflow:

1.  **Fork the repository** on GitHub.
2.  **Create a new branch** for your changes.
3.  **Make your changes** in your branch.
4.  **Commit your changes** with a clear and descriptive message.
5.  **Push your branch** to your forked repository.
6.  **Create a pull request** to merge your changes into the main repository.

If you have any questions, please contact us at [grp-lmod@groups.bristol.ac.uk](mailto:grp-lmod@groups.bristol.ac.uk).

### Adding Content

#### Publications

All publications live in a single file, `_data/publications.yml`. Each entry appears in the full "All Publications" list on the publications page (and in site search). To add one:

1.  Open the `_data/publications.yml` file.
2.  Add a new entry at the top of the list (newest first). Follow the existing format:

    ```yaml
    - authors: "Author A, Author B, Author C, et al."
      title: "Title of the Publication"
      journal: "Journal Name"
      link: https://doi.org/link-to-publication
      date: 2026-01-31        # YYYY-MM-DD, NO quotes (must be a real YAML date)
    ```

3.  The `date` **must be unquoted** and in `YYYY-MM-DD` form — it is used for sorting and year grouping. Mixing quoted and unquoted dates breaks the page build.

To promote a paper to a **featured card** on the publications page, add these extra fields to its entry:

    ```yaml
      featured: true
      category: methods        # methods | applied (which section the card appears in)
      image: surname_26.jpg    # required for featured; add the file to assets/images/papers/
      description: "One or two sentence plain-language summary."
      editorial: https://...   # optional extra link
      news: https://...        # optional extra link
    ```

#### Software

To add a new tool to the "Software" page:

1.  Add the tool's image to the `assets/images/software/` directory.
2.  Open the `_data/software.yml` file.
3.  Add a new entry. Follow the existing format (the `name` may contain HTML such as `<strong>`):

    ```yaml
    - name: "<strong>toolname</strong>: A short description of the tool"
      image: toolname.jpg
      manual_link: https://link-to-manual
      method_link: https://link-to-methods-paper
      tutorial_link: https://link-to-tutorial
    ```

#### People

To add a new person to the "People" page:

1.  Add the person's profile picture to the `assets/images/people/` directory.
2.  Open the `_data/people.yml` file.
3.  Add a new entry to either the `current_members` or `visitors` list. Follow the existing format:

    ```yaml
    - name: "Full Name"
      image: "assets/images/people/your-image-filename.jpg"
      profile_link: "https://link-to-your-profile-page"
    ```

#### Blog Posts (News)

To add a new blog post to the "News" section:

1.  Create a new markdown file in the `_posts` directory.
2.  The filename must follow the format `YYYY-MM-DD-your-post-title.md`. For example, `2025-09-03-new-research-grant.md`.
3.  Add the following frontmatter to the top of your file, filling in the details:

    ```yaml
    ---
    title: "Your Post Title"
    description: "A short description of the post."
    background:
      img: "/assets/images/blog/your-post-image.jpg"
      by: "Image credit"
      href: "https://link-to-image-source"
    author:
      - "Author Name"
    tags:
      - "relevant-tag"
      - "another-tag"
    ---
    ```
4.  Write the content of your blog post in Markdown below the frontmatter.
5.  Add any images for your post to the `assets/images/blog/` directory.

#### Training Materials

To add a new training guide:

1.  Create a new markdown file in the `training/expl_guides/` directory.
2.  The filename should be descriptive, e.g., `my-new-guide.md`.
3.  Add a title and other relevant frontmatter to your file. You can use other guides as a template.
4.  Write your guide in Markdown.

### Editing Existing Pages

Most of the main pages — including **Research**, **Seminars**, **Software**, and **Contact** — are located in the `pages` directory as Markdown files. You can edit these directly to update their content. The "Edit this page" link at the bottom of each page provides a convenient shortcut to the correct file on GitHub.

## License

The **content** of this website (text, images, and data) is licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) — you are free to share and adapt it, provided you give appropriate credit.

The **source code** (Jekyll templates, styles, and scripts) is licensed under the [MIT License](LICENSE).

Bundled third-party libraries (Bootstrap, jQuery, Popper, Font Awesome, etc.) retain their own licenses.
