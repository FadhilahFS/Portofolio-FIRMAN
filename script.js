document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const projectsContainer = document.getElementById('projects');

  fetch('projects.json')
    .then(res => {
      if (!res.ok) throw new Error('projects.json tidak ditemukan');
      return res.json();
    })
    .then(list => {
      if (!Array.isArray(list) || list.length === 0) {
        projectsContainer.innerHTML = '<p class="muted">Belum ada project. Edit file projects.json untuk menambahkan.</p>';
        return;
      }
      projectsContainer.innerHTML = list.map(p => {
        const image = p.image || placeholderSVG(p.name);
        const tech = (p.tech || []).map(t => `<span class="tech-item">${t}</span>`).join(' ');
        const links = [
          p.repo ? `<a href="${p.repo}" target="_blank" rel="noreferrer">Repo</a>` : '',
          p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer">Live</a>` : ''
        ].filter(Boolean).join(' • ');
        return `
          <article class="project">
            <div class="thumb"><img src="${image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"></div>
            <div class="content">
              <h3>${p.name}</h3>
              <p>${p.description || ''}</p>
              <div class="meta">
                <div class="muted">${p.date || ''} ${tech ? ' • ' + tech : ''}</div>
                <div>${links}</div>
              </div>
            </div>
          </article>
        `;
      }).join('');
    })
    .catch(err => {
      projectsContainer.innerHTML = '<p class="muted">Gagal memuat project. Periksa projects.json di repo Anda.</p>';
      console.warn(err);
    });

  document.getElementById('copyEmail')?.addEventListener('click', () => {
    const email = document.getElementById('email').textContent.trim();
    navigator.clipboard?.writeText(email).then(() => {
      const btn = document.getElementById('copyEmail');
      btn.textContent = 'Tersalin ✓';
      setTimeout(() => btn.textContent = 'Salin email', 1500);
    }).catch(() => alert('Gagal menyalin email. Silakan salin manual.'));
  });

  function placeholderSVG(title){
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
      <rect width="1200" height="600" fill="#082032"/>
      <rect x="40" y="40" width="1120" height="520" rx="14" fill="#0ea5a4" fill-opacity="0.08"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#cfe9f2" font-family="Arial" font-size="42">${title}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
});
