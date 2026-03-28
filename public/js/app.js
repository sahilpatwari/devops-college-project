/* ===================================================
   Visual Resume Editor — Application Logic
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM references ----
  const $ = (sel) => document.querySelector(sel);
  const fields = {
    name:     $('#inp-name'),
    email:    $('#inp-email'),
    phone:    $('#inp-phone'),
    location: $('#inp-location'),
    linkedin: $('#inp-linkedin'),
    summary:  $('#inp-summary'),
    skills:   $('#inp-skills'),
  };

  const preview = {
    name:       $('#prev-name'),
    contact:    $('#prev-contact'),
    summary:    $('#prev-summary'),
    summaryBox: $('#prev-summary-section'),
    skills:     $('#prev-skills'),
    skillsBox:  $('#prev-skills-section'),
    experience:    $('#prev-experience'),
    experienceBox: $('#prev-experience-section'),
    education:     $('#prev-education'),
    educationBox:  $('#prev-education-section'),
  };

  // ---- Live update on every keystroke ----
  Object.values(fields).forEach((input) => {
    input.addEventListener('input', renderPreview);
  });

  // ---- Print button ----
  $('#btn-print').addEventListener('click', () => window.print());

  // ---- Experience entries ----
  let experienceEntries = [];
  $('#btn-add-exp').addEventListener('click', () => {
    experienceEntries.push({ title: '', company: '', dates: '', description: '' });
    renderExperienceEditor();
    renderPreview();
  });

  // ---- Education entries ----
  let educationEntries = [];
  $('#btn-add-edu').addEventListener('click', () => {
    educationEntries.push({ degree: '', school: '', dates: '', details: '' });
    renderEducationEditor();
    renderPreview();
  });

  // ---- Render helpers ----

  function renderExperienceEditor() {
    const container = $('#experience-list');
    container.innerHTML = '';
    experienceEntries.forEach((entry, i) => {
      const block = document.createElement('div');
      block.className = 'entry-block';
      block.innerHTML = `
        <button class="btn-remove" data-index="${i}" data-type="exp" title="Remove">✕</button>
        <div class="field">
          <label>Job Title</label>
          <input type="text" data-index="${i}" data-field="title" value="${esc(entry.title)}" placeholder="Software Engineer" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Company</label>
            <input type="text" data-index="${i}" data-field="company" value="${esc(entry.company)}" placeholder="Acme Inc." />
          </div>
          <div class="field">
            <label>Dates</label>
            <input type="text" data-index="${i}" data-field="dates" value="${esc(entry.dates)}" placeholder="Jan 2023 – Present" />
          </div>
        </div>
        <div class="field">
          <label>Description</label>
          <textarea rows="2" data-index="${i}" data-field="description" placeholder="Key responsibilities and achievements…">${esc(entry.description)}</textarea>
        </div>
      `;
      container.appendChild(block);
    });

    // Wire up inputs
    container.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const field = e.target.dataset.field;
        experienceEntries[idx][field] = e.target.value;
        renderPreview();
      });
    });
    container.querySelectorAll('.btn-remove[data-type="exp"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        experienceEntries.splice(idx, 1);
        renderExperienceEditor();
        renderPreview();
      });
    });
  }

  function renderEducationEditor() {
    const container = $('#education-list');
    container.innerHTML = '';
    educationEntries.forEach((entry, i) => {
      const block = document.createElement('div');
      block.className = 'entry-block';
      block.innerHTML = `
        <button class="btn-remove" data-index="${i}" data-type="edu" title="Remove">✕</button>
        <div class="field">
          <label>Degree / Certificate</label>
          <input type="text" data-index="${i}" data-field="degree" value="${esc(entry.degree)}" placeholder="B.Tech Computer Science" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>School / University</label>
            <input type="text" data-index="${i}" data-field="school" value="${esc(entry.school)}" placeholder="MIT" />
          </div>
          <div class="field">
            <label>Dates</label>
            <input type="text" data-index="${i}" data-field="dates" value="${esc(entry.dates)}" placeholder="2019 – 2023" />
          </div>
        </div>
        <div class="field">
          <label>Details</label>
          <textarea rows="2" data-index="${i}" data-field="details" placeholder="Relevant courses, GPA, honors…">${esc(entry.details)}</textarea>
        </div>
      `;
      container.appendChild(block);
    });

    container.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const field = e.target.dataset.field;
        educationEntries[idx][field] = e.target.value;
        renderPreview();
      });
    });
    container.querySelectorAll('.btn-remove[data-type="edu"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        educationEntries.splice(idx, 1);
        renderEducationEditor();
        renderPreview();
      });
    });
  }

  function renderPreview() {
    // Name
    const name = fields.name.value.trim();
    preview.name.textContent = name || 'Your Name';

    // Contact line
    const parts = [];
    if (fields.email.value.trim())    parts.push(fields.email.value.trim());
    if (fields.phone.value.trim())    parts.push(fields.phone.value.trim());
    if (fields.location.value.trim()) parts.push(fields.location.value.trim());
    if (fields.linkedin.value.trim()) parts.push(fields.linkedin.value.trim());
    preview.contact.textContent = parts.join('  •  ');

    // Summary
    const summary = fields.summary.value.trim();
    preview.summaryBox.style.display = summary ? '' : 'none';
    preview.summary.textContent = summary;

    // Skills
    const skillsRaw = fields.skills.value.trim();
    if (skillsRaw) {
      preview.skillsBox.style.display = '';
      const skillArr = skillsRaw.split(',').map((s) => s.trim()).filter(Boolean);
      preview.skills.innerHTML = skillArr
        .map((s) => `<span class="skill-tag">${esc(s)}</span>`)
        .join('');
    } else {
      preview.skillsBox.style.display = 'none';
    }

    // Experience
    if (experienceEntries.length > 0) {
      preview.experienceBox.style.display = '';
      preview.experience.innerHTML = experienceEntries.map((e) => `
        <div class="prev-entry">
          <div class="prev-entry-title">${esc(e.title) || 'Job Title'}</div>
          <div class="prev-entry-sub">${esc(e.company)}${e.dates ? ' • ' + esc(e.dates) : ''}</div>
          ${e.description ? `<div class="prev-entry-desc">${esc(e.description)}</div>` : ''}
        </div>
      `).join('');
    } else {
      preview.experienceBox.style.display = 'none';
    }

    // Education
    if (educationEntries.length > 0) {
      preview.educationBox.style.display = '';
      preview.education.innerHTML = educationEntries.map((e) => `
        <div class="prev-entry">
          <div class="prev-entry-title">${esc(e.degree) || 'Degree'}</div>
          <div class="prev-entry-sub">${esc(e.school)}${e.dates ? ' • ' + esc(e.dates) : ''}</div>
          ${e.details ? `<div class="prev-entry-desc">${esc(e.details)}</div>` : ''}
        </div>
      `).join('');
    } else {
      preview.educationBox.style.display = 'none';
    }
  }

  /** Escape HTML to prevent XSS */
  function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial render
  renderPreview();
});
