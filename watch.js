const params=new URLSearchParams(window.location.search);
const animeId=params.get('anime');
const epNum= params.get('ep') ? Number(params.get('ep')) : 0;
fetch('data/anime.json').then(r=>r.json()).then(data=>{
  const a=data.find(x=>String(x.id)===String(animeId));
  if(!a){ document.getElementById('watch-title').textContent='Not found'; return; }
  document.getElementById('watch-title').textContent = a.title;
  const servers = a.watch.filter(Boolean);
  const serverSel = document.getElementById('serverSelect');
  serverSel.innerHTML = servers.map((s,i)=>`<option value="${i}">Server ${i+1}</option>`).join('');
  const eps = a.episodes && a.episodes.length ? a.episodes.slice().sort((x,y)=>x.ep-y.ep) : [{ep:0, title:'Main', watch:servers[0]||''}];
  const epSel = document.getElementById('episodeSelect');
  epSel.innerHTML = eps.map(e=>`<option value="${e.ep}">Ep ${e.ep} ${e.title?'- '+e.title:''}</option>`).join('');
  // set selection
  serverSel.value = 0;
  epSel.value = epNum || (eps[0].ep);
  function setSrc(){
    const sIndex = Number(serverSel.value);
    const ep = eps.find(e=>String(e.ep)===String(epSel.value));
    let src = servers[sIndex] || '';
    if(ep && ep.watch) src = ep.watch;
    document.getElementById('player').src = src;
  }
  serverSel.addEventListener('change', setSrc);
  epSel.addEventListener('change', setSrc);
  setSrc();
});