# Longitudinal Modelling Group Website

This is the website for the Longitudinal Modelling Group, a research group based at the University of Bristol. The Longitudinal Modelling Group develops, uses, and teaches innovative statistical methods for the analysis of repeated measures data to better understand health trajectories across the life course.

## Website Structure

This website is built using Jekyll and the Petridish theme. It contains the following sections:

*   **Home:** Welcome page with an overview of the group's activities.
*   **Research:** Detailed information about the group's research themes and methods.
*   **Publications:** A selection of featured research papers and latest publications.
*   **Software:** Information and links to software tools developed by the group.
*   **Seminars:** Announcements and details about the group's Seminar Series.
*   **Learn:** Details on courses, and training materials and resources for researchers.
*   **People:** Profiles of the research group members.
*   **News:** News and updates from the group.
*   **Join:** Contact and collaboration details.

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

To add a new publication to the "Latest Publications" list on the homepage:

1.  Open the `_data/publications_latest.yml` file.
2.  Add a new entry for your publication at the top of the list. Follow the existing format:

    ```yaml
    - authors: "Author A, Author B, Author C"
      title: "Title of the Publication"
      journal: "Journal Name"
      link: "https://doi.org/link-to-publication"
      date: "YYYY-MM-DD" # Used for sorting
    ```

3.  Ensure the `date` is in `YYYY-MM-DD` format.

There is also a `_data/publications_featured.yml` file for the publications page. The process is similar.

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

Most of the main pages (e.g., Contact, Research) are located in the `pages` directory. You can edit these markdown files directly to update their content. The "Edit this page" link at the bottom of each page provides a convenient shortcut to the correct file on GitHub.
