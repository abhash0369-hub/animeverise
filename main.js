// Load anime data and render grids + categories
fetch('data/anime.json').then(r=>r.json()).then(data=>{
  const trending = document.getElementById('trending');
  const recent = document.getElementById('recent');
  const categories = document.getElementById('categories');
  data.sort((a,b)=> (b.added||0)-(a.added||0));
  // build category counts
  const counts = {};
  data.forEach(a=>{ (a.genres||[]).forEach(g=>{ counts[g] = (counts[g]||0)+1 }) });
  // render category pills (custom)
  const allPill = document.createElement('div');
  allPill.className='category-pill';
  allPill.textContent = 'All ('+data.length+')';
  allPill.onclick = ()=>{ renderGrids(data); };
  categories.appendChild(allPill);
  Object.keys(counts).sort().forEach(g=>{
    const el = document.createElement('div');
    el.className='category-pill';
    el.textContent = `${g} (${counts[g]})`;
    el.onclick = ()=>{ renderGrids(data.filter(a=> (a.genres||[]).map(x=>x.toLowerCase()).includes(g.toLowerCase()) )); };
    categories.appendChild(el);
  });

  // initial render
  renderGrids(data);

  function renderGrids(list){
    trending.innerHTML=''; recent.innerHTML='';
    list.slice(0,6).forEach(anime=>{
      const div=document.createElement('div');
      div.innerHTML=`<a href="anime.html?id=${anime.id}"><img src="${anime.image}" style="width:100%;height:220px;object-fit:cover"><h3>${anime.title}</h3></a>`;
      trending.appendChild(div);
    });
    list.slice(0,8).forEach(anime=>{
      const div=document.createElement('div');
      div.innerHTML=`<a href="anime.html?id=${anime.id}"><img src="${anime.image}" style="width:100%;height:220px;object-fit:cover"><h3>${anime.title}</h3></a>`;
      recent.appendChild(div);
    });
  }
});