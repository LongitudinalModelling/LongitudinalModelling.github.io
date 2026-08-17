---
title: "Seminar Series"
background: /assets/images/backgrounds/seminars_page.jpg
permalink: /seminars/
search_text: "Our online seminar series on longitudinal modelling, with speakers from methodological and applied research. Open to all. Sessions run on Teams, usually on a Thursday at 1 PM UK time. Includes details of the next talk, a list of past talks, and recordings."
---

<div class="container mb-4">
  <p>We host online seminars on longitudinal modelling with speakers from both methodological and applied research. The seminars are open to all, including external researchers, and we welcome proposals from researchers and students to present: an excellent chance to gain feedback on ongoing work.</p>
  
  Seminar sessions are held on Teams, usually on a Thursday at 1 PM (UK), and run for up to one hour, with ~30 minutes of presentation followed by discussion.
</div>

<div class="container mb-2">
  <div class="row">
    <div class="col-md-6 mb-4">
      <div class="card p-4 text-center bg-purple">
        <h2 class="h4 text-white">Be notified about upcoming talks</h2>
        <a href="mailto:grp-lmod@groups.bristol.ac.uk?subject=Longitudinal%20Modelling%20Seminars%20Mailing%20List" class="btn btn-light btn-lg mt-2">Join the mailing list</a>
      </div>
    </div>
    
    <div class="col-md-6 mb-4">
      <div class="card p-4 text-center bg-purple">
        <h2 class="h4 text-white">Present your work to the group</h2>
        <a href="mailto:grp-lmod@groups.bristol.ac.uk?subject=Seminar%20Presentation%20Proposal" class="btn btn-light btn-lg mt-2">Propose a talk</a>
      </div>
    </div>
  </div>
</div>

<hr class="purple-line-small">

{% assign today = 'now' | date: '%Y%m%d' | plus: 0 %}
{% assign by_date = site.data.seminars | group_by: 'date' %}

<div class="container my-5">
  <div class="row justify-content-center">
    <div class="col-md-12">
      <div class="card border-purple">
        <div class="card-header bg-purple text-white">
          <h2 class="h4 mb-0 text-center">Next Talk</h2>
        </div>
        <div class="card-body">
          {% assign shown = false %}
          {% for group in by_date reversed %}
            {% assign group_day = group.name | date: '%Y%m%d' | plus: 0 %}
            {% if group_day >= today and shown == false %}
              {% assign shown = true %}
              {% for talk in group.items %}
                <h3 class="h5 text-purple">
                {{ group.name | date: '%d %B %Y' }}
                {% if talk.calendar %}<small style="font-weight: normal;">(<a href="{{ site.baseurl }}/assets/calendar/{{ talk.calendar }}">Add to calendar</a>)</small>{% endif %}
                </h3>
                <dl class="row mb-0">
                  <dt class="col-sm-3"><strong>Title:</strong></dt>
                  <dd class="col-sm-9">{{ talk.title }}</dd>
                  <dt class="col-sm-3"><strong>Speaker:</strong></dt>
                  <dd class="col-sm-9"><em>{{ talk.speaker }}{% if talk.affiliation %} ({{ talk.affiliation }}){% endif %}</em></dd>
                  <dt class="col-sm-3"><strong>Summary:</strong></dt>
                  <dd class="col-sm-9">{{ talk.summary }}</dd>
                </dl>
              {% endfor %}
            {% endif %}
          {% endfor %}
          {% if shown == false %}
            <p class="mb-0">No seminar is scheduled at the moment. Join the mailing list above to hear about the next talk.</p>
          {% endif %}
        </div>
      </div>
    </div>
  </div>
</div>


<hr class="purple-line-small">

<h2 class="h3">Past Seminars</h2>

<p class="mt-4 text-center">You can find the recordings of some of our past seminars <a href="https://www.youtube.com/@LongModel" target="_blank" rel="noopener noreferrer">here</a>.</p>

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/videoseries?list=PLSs04oY8Hg3Qq85SMwtAuxVIqz83CDCzm" 
    title="Longitudinal Modelling Group Seminar Recordings Playlist" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>

{% for group in by_date %}
  {% assign group_day = group.name | date: '%Y%m%d' | plus: 0 %}
  {% if group_day < today %}

**{{ group.name | date: '%d %B %Y' }}**

{% for talk in group.items %}
**Title:** **{{ talk.title }}**

**Speaker:** *{{ talk.speaker }}{% if talk.affiliation %} ({{ talk.affiliation }}){% endif %}*

**Summary:** {{ talk.summary }}

{% endfor %}
---
  {% endif %}
{% endfor %}
