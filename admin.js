// Admin panel uses localStorage to persist anime for now
const loginForm = document.getElementById('login-form');
const adminArea = document.getElementById('admin-area');
const STORAGE_KEY = 'animeverse_data';

// Load initial data from data/anime.json into localStorage once
if(!localStorage.getItem(STORAGE_KEY+'__initialized')){
  fetch('data/anime.json').then(r=>r.text()).then(txt=>{
    try{ localStorage.setItem(STORAGE_KEY, txt); localStorage.setItem(STORAGE_KEY+'__initialized','1'); }catch(e){ console.warn(e); }
    loadList();
  });
} else loadList();

loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const user=document.getElementById('username').value;
  const pass=document.getElementById('password').value;
  if(user==='admin' && pass==='1234'){ loginForm.style.display='none'; adminArea.style.display='block'; buildForm(); }
  else alert('Wrong credentials');
});

function buildForm(){
  document.getElementById('add-ep-btn').addEventListener('click', addEpisodeRow);
  document.getElementById('add-form').addEventListener('submit', e=>{ e.preventDefault(); saveAnime(); });
  loadList();
}

function getStore(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); }catch(e){ return []; } }
function setStore(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); loadList(); }

function addEpisodeRow(vals){ const wrap=document.createElement('div'); wrap.style.border='1px solid #333'; wrap.style.padding='8px'; wrap.style.margin='6px 0';
  wrap.innerHTML = `<input placeholder="Episode number" class="ep-num"><input placeholder="Episode title" class="ep-title"><input placeholder="Episode watch (embed url)" class="ep-watch"><input placeholder="480p (url|size)" class="ep-d480"><input placeholder="720p (url|size)" class="ep-d720"><input placeholder="1080p (url|size)" class="ep-d1080"><button class="remove-ep">Remove</button>`;
  if(vals){ wrap.querySelector('.ep-num').value=vals.ep; wrap.querySelector('.ep-title').value=vals.title || ''; wrap.querySelector('.ep-watch').value=vals.watch || ''; wrap.querySelector('.ep-d480').value=vals.d480 || ''; wrap.querySelector('.ep-d720').value=vals.d720 || ''; wrap.querySelector('.ep-d1080').value=vals.d1080 || ''; }
  wrap.querySelector('.remove-ep').addEventListener('click', ()=>wrap.remove());
  document.getElementById('episodes-builder').appendChild(wrap);
}

function saveAnime(){
  const title=document.getElementById('title').value.trim();
  if(!title){ alert('Title required'); return; }
  const img=document.getElementById('image').value.trim()||'assets/images/placeholder.png';
  const year=document.getElementById('year').value.trim()||'';
  const status=document.getElementById('status').value.trim()||'';
  const badge=document.getElementById('badge').value.trim()||'';
  const genres=document.getElementById('genres').value.split(',').map(s=>s.trim()).filter(Boolean);
  const desc=document.getElementById('description').value.trim();
  const watch1=document.getElementById('watch1').value.trim();
  const watch2=document.getElementById('watch2').value.trim();
  const d480=document.getElementById('d480').value.trim();
  const d720=document.getElementById('d720').value.trim();
  const d1080=document.getElementById('d1080').value.trim();
  const trailer=document.getElementById('trailer').value.trim();
  // episodes
  const epNodes = document.querySelectorAll('#episodes-builder > div');
  const episodes=[];
  epNodes.forEach(n=>{
    const ep = n.querySelector('.ep-num').value;
    if(!ep) return;
    const title = n.querySelector('.ep-title').value;
    const watch = n.querySelector('.ep-watch').value;
    const d480 = n.querySelector('.ep-d480').value;
    const d720 = n.querySelector('.ep-d720').value;
    const d1080 = n.querySelector('.ep-d1080').value;
    const downloads={};
    if(d480){ const [u,s]=d480.split('|').map(s=>s.trim()); downloads['480p']={url:u,size:s}; }
    if(d720){ const [u,s]=d720.split('|').map(s=>s.trim()); downloads['720p']={url:u,size:s}; }
    if(d1080){ const [u,s]=d1080.split('|').map(s=>s.trim()); downloads['1080p']={url:u,size:s}; }
    episodes.push({ep:Number(ep), title, watch, downloads});
  });
  const store = getStore();
  const nextId = store.length ? Math.max(...store.map(x=>x.id))+1 : 1;
  const payload = {
    id: nextId,
    title, image: img, genres, year, status, badge, description: desc,
    watch: [watch1,watch2], downloads: {}, trailer, episodes, added: Date.now()
  };
  if(d480){ const [u,s]=d480.split('|').map(s=>s.trim()); payload.downloads['480p']={url:u,size:s}; }
  if(d720){ const [u,s]=d720.split('|').map(s=>s.trim()); payload.downloads['720p']={url:u,size:s}; }
  if(d1080){ const [u,s]=d1080.split('|').map(s=>s.trim()); payload.downloads['1080p']={url:u,size:s}; }
  store.push(payload);
  setStore(store);
  alert('Anime added to local storage. Use site pages to view.');
  document.getElementById('add-form').reset();
  document.getElementById('episodes-builder').innerHTML='';
}

function loadList(){
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const root = document.getElementById('anime-list');
  if(!root) return;
  root.innerHTML = list.map(a=>`<div style="border:1px solid #333;padding:8px;margin:6px 0"><img src="${a.image}" style="width:80px;height:80px;object-fit:cover;vertical-align:middle;margin-right:8px"><strong>${a.title}</strong> (${a.year}) <button onclick="deleteEntry(${a.id})">Delete</button></div>`).join('');
}

function deleteEntry(id){
  if(!confirm('Delete this anime?')) return;
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter(x=>x.id!==id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  loadList();
}