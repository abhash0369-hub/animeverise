const params = new URLSearchParams(window.location.search);
const id = params.get('id');
function parseQuality(val){ if(!val) return null; const [url,size]=''+val.split('|').map(s=>s.trim()); return {url,size}; }
fetch('data/anime.json').then(r=>r.json()).then(data=>{
  const a = data.find(x=>String(x.id)===String(id));
  if(!a){ document.getElementById('anime-details').innerHTML='<p>Not found</p>'; return; }
  const container = document.getElementById('anime-details');
  const downloads = (d)=>{
    if(!d) return '<div>No downloads</div>';
    let html='';
    ['480p','720p','1080p'].forEach(k=>{ if(d[k]) html+=`<a href="${d[k].url}" target="_blank" class="dlbtn">${k} • ${d[k].size||'—'}</a> `});
    return `<div style="margin:8px 0">${html}</div>`;
  };
  container.innerHTML = `
    <div style="display:flex;gap:18px;align-items:flex-start">
      <img src="${a.image}" style="width:200px;height:300px;object-fit:cover;border-radius:8px">
      <div style="flex:1">
        <h1>${a.title}</h1>
        <div>${a.genres.join(', ')} • ${a.year} • ${a.status}</div>
        <p style="margin-top:10px">${a.description||''}</p>
        <div style="margin-top:12px">
          <a class="btn" href="watch.html?anime=${a.id}&ep=1" target="_blank">Watch (Player)</a>
        </div>
        <h3 style="margin-top:14px">Downloads</h3>
        ${downloads(a.downloads)}
        ${a.trailer ? `<h3>Trailer</h3><iframe width="420" height="236" src="${a.trailer}" frameborder="0" allowfullscreen></iframe>` : ''}
      </div>
    </div>
    <hr>
    <h3>Episodes</h3>
    <div id="ep-list"></div>
  `;
  const epList = document.getElementById('ep-list');
  if(a.episodes && a.episodes.length){
    a.episodes.sort((x,y)=>x.ep-y.ep).forEach(ep=>{
      const div=document.createElement('div');
      div.className='eprow';
      div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #333;margin:6px 0;border-radius:6px">
        <div>Ep ${ep.ep} — ${ep.title||''}</div>
        <div><a class="btn" href="watch.html?anime=${a.id}&ep=${ep.ep}" target="_blank">Watch</a> ${ep.downloads?Object.keys(ep.downloads).map(k=>`<a class="dlbtn" href="${ep.downloads[k].url}" target="_blank">${k} • ${ep.downloads[k].size||'—'}</a>`).join(' '):''}</div>
      </div>`;
      epList.appendChild(div);
    });
  } else {
    epList.innerHTML = '<div class="muted">No episodes added.</div>';
  }
});