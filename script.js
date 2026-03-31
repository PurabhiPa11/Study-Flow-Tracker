/* ── STATE ── */
let tasks=[], selType='Study', userName='', userStd='', streak=0, lastDate=null;
const CATS=['Study','Coding','Assignment','Homework','Presentation'];
const ICONS={Study:'📘',Coding:'💻',Assignment:'📝',Homework:'📖',Presentation:'📊'};
const MSGS=[
  [0,   'Start your day ✨',       'Add tasks and log your hours below'],
  [1,   'Getting going 🚀',         'Great start — keep the momentum!'],
  [21,  'Building momentum 💡',     'You\'re finding your rhythm!'],
  [51,  'Crushing it 🔥',           'More than halfway there — amazing!'],
  [81,  'Almost there 💪',          'Finish strong — you\'re so close!'],
  [100, 'Perfect day! 🎉',          'You completed everything. Incredible!'],
];

/* ── LOGIN ── */
function startApp(){
  const n=document.getElementById('inp-name').value.trim();
  const s=document.getElementById('inp-std').value.trim();
  if(!n){shake(document.getElementById('inp-name'));return;}
  userName=n; userStd=s;
  const ls=document.getElementById('loginScreen');
  ls.style.transition='opacity .35s, transform .35s';
  ls.style.opacity='0'; ls.style.transform='translateY(-20px) scale(.97)';
  setTimeout(()=>{
    ls.style.display='none';
    const app=document.getElementById('app');
    app.style.display='flex'; app.style.animation='fadeIn .4s ease';
    bootApp();
  },330);
}

function bootApp(){
  const h=new Date().getHours();
  const g=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
  document.getElementById('greeting-text').textContent=`${g}, ${userName} 👋`;
  document.getElementById('sb-uname').textContent=userName;
  document.getElementById('sb-ustd').textContent=userStd||'Student';
  document.getElementById('sb-avatar').textContent=userName[0].toUpperCase();
  tickStreak();
  renderAll();
  renderBoard();
  renderCal();
}

function logout(){
  tasks=[];streak=0;lastDate=null;
  const app=document.getElementById('app');
  app.style.transition='opacity .3s'; app.style.opacity='0';
  setTimeout(()=>{
    app.style.display='none'; app.style.opacity='1'; app.style.transition='';
    const ls=document.getElementById('loginScreen');
    ls.style.display='flex'; ls.style.opacity='0'; ls.style.transform='';
    ls.style.transition='opacity .4s'; requestAnimationFrame(()=>{ls.style.opacity='1';});
    document.getElementById('inp-name').value='';
    document.getElementById('inp-std').value='';
  },280);
}

/* ── NAV ── */
const SEC_TITLES={dashboard:'Dashboard',board:'Task Board',streak:'Streak'};
function nav(btn){
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const id=btn.dataset.sec;
  document.getElementById('topbar-title').textContent=SEC_TITLES[id]||id;
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  if(id==='board') renderBoard();
  if(id==='streak'){tickStreak();renderCal();}
}

/* ── TYPE PICK ── */
function pickType(btn){
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  selType=btn.dataset.type;
}

/* ── ADD TASK ── */
function addTask(){
  const n=document.getElementById('inp-task').value.trim();
  const h=parseFloat(document.getElementById('inp-hrs').value);
  if(!n){shake(document.getElementById('inp-task'));return;}
  if(!h||h<=0){shake(document.getElementById('inp-hrs'));return;}
  tasks.push({id:Date.now(),name:n,hours:h,type:selType,done:false});
  document.getElementById('inp-task').value='';
  document.getElementById('inp-hrs').value='';
  renderAll();
  renderBoard();
}

/* ── TOGGLE / DELETE ── */
function toggleTask(id){
  const t=tasks.find(x=>x.id===id);
  if(!t)return;
  t.done=!t.done;
  if(t.done&&tasks.every(x=>x.done)&&tasks.length>0)confetti();
  renderAll();
  renderBoard();
}
function delTask(id){
  const el=document.getElementById('t'+id);
  if(el){el.style.transition='opacity .22s,transform .22s';el.style.opacity='0';el.style.transform='translateX(16px)';}
  setTimeout(()=>{tasks=tasks.filter(x=>x.id!==id);renderAll();renderBoard();},220);
}

/* ── RENDER ── */
function renderAll(){renderTasks();updateRing();}

function renderTasks(){
  const list=document.getElementById('taskList');
  const empty=document.getElementById('emptyMsg');
  list.querySelectorAll('.task-row').forEach(e=>e.remove());
  if(!tasks.length){empty.style.display='block';return;}
  empty.style.display='none';
  tasks.forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='task-row'+(t.done?' done':'');
    d.id='t'+t.id;
    d.style.animationDelay=i*0.04+'s';
    d.innerHTML=`
      <button class="check${t.done?' on':''}" onclick="toggleTask(${t.id})"></button>
      <span class="task-name">${esc(t.name)}</span>
      <span class="task-tag tag-${t.type}">${ICONS[t.type]} ${t.type}</span>
      <span class="task-hrs">${t.hours}h</span>
      <button class="del" onclick="delTask(${t.id})" title="Remove">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    list.appendChild(d);
  });
}

function updateRing(){
  const total=tasks.reduce((s,t)=>s+t.hours,0);
  const done=tasks.filter(t=>t.done).reduce((s,t)=>s+t.hours,0);
  const pct=total?(done/total)*100:0;
  const C=408, off=C-(C*pct/100);
  document.getElementById('ringProgress').style.strokeDashoffset=off;
  document.getElementById('ringPct').textContent=Math.floor(pct)+'%';
  const row=MSGS.filter(m=>pct>=m[0]).at(-1)||MSGS[0];
  document.getElementById('progMsg').textContent=row[1];
  document.getElementById('progSub').textContent=row[2];
  const doneTasks=tasks.filter(t=>t.done);
  document.getElementById('st-done').textContent=doneTasks.length;
  document.getElementById('st-hrs').textContent=doneTasks.reduce((s,t)=>s+t.hours,0)+'h';
  document.getElementById('st-streak').textContent=streak;
  document.getElementById('big-streak').textContent=streak;
}

/* ── BOARD ── */
function renderBoard(){
  const g=document.getElementById('boardGrid');
  g.innerHTML='';
  CATS.forEach((cat,ci)=>{
    const ct=tasks.filter(t=>t.type===cat);
    const col=document.createElement('div');
    col.className='board-col';
    col.style.animationDelay=(ci*0.07)+'s';
    col.innerHTML=`
      <div class="bcol-head">
        <span class="bcol-title">${ICONS[cat]} ${cat}</span>
        <span class="bcol-cnt">${ct.length}</span>
      </div>
      <div class="bcol-tasks">
        ${ct.length?ct.map(t=>`
          <div class="board-task${t.done?' done':''}" onclick="toggleTask(${t.id})">
            <div class="bt-name">${esc(t.name)}</div>
            <div class="bt-hrs">${t.hours}h${t.done?' · ✓ Done':''}</div>
          </div>`).join(''):'<div class="bcol-empty">No tasks yet</div>'}
      </div>`;
    g.appendChild(col);
  });
}

/* ── STREAK ── */
function tickStreak(){
  const today=new Date().toDateString();
  if(lastDate!==today){
    const yesterday=new Date(Date.now()-86400000).toDateString();
    streak=lastDate===yesterday?streak+1:1;
    lastDate=today;
  }
  document.getElementById('st-streak').textContent=streak;
  document.getElementById('big-streak').textContent=streak;
}

function renderCal(){
  const g=document.getElementById('calGrid');
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now=new Date();
  let html=days.map(d=>`<div class="cal-day-hdr">${d}</div>`).join('');
  for(let i=6;i>=0;i--){
    const d=new Date(now); d.setDate(now.getDate()-i);
    const isToday=i===0;
    const hasDone=isToday&&tasks.some(t=>t.done);
    const cls=hasDone?'cal-day active':isToday?'cal-day today':'cal-day past';
    html+=`<div class="${cls}">${d.getDate()}</div>`;
  }
  g.innerHTML=html;
}

/* ── CONFETTI ── */
function confetti(){
  const cv=document.getElementById('confetti');
  const ctx=cv.getContext('2d');
  cv.width=innerWidth; cv.height=innerHeight;
  const colors=['#5b9fff','#818cf8','#34d399','#fb923c','#f472b6','#facc15'];
  const pieces=Array.from({length:130},()=>({
    x:Math.random()*cv.width, y:-20-Math.random()*100,
    r:3+Math.random()*6, d:1.5+Math.random()*2.5,
    col:colors[Math.floor(Math.random()*colors.length)],
    a:Math.random()*360, spin:(Math.random()-.5)*7,
    drift:(Math.random()-.5)*1.8
  }));
  let raf;
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    pieces.forEach(p=>{
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a*Math.PI/180);
      ctx.fillStyle=p.col;ctx.fillRect(-p.r/2,-p.r*.25,p.r,p.r*.5);
      ctx.restore();
      p.y+=p.d; p.x+=p.drift; p.a+=p.spin;
    });
    if(pieces.some(p=>p.y<cv.height)) raf=requestAnimationFrame(draw);
    else ctx.clearRect(0,0,cv.width,cv.height);
  }
  draw();
  setTimeout(()=>{cancelAnimationFrame(raf);ctx.clearRect(0,0,cv.width,cv.height);},4000);
}

/* ── UTILS ── */
function shake(el){
  el.style.animation='none'; el.offsetHeight;
  el.style.animation='shakeX .4s ease';
  el.addEventListener('animationend',()=>el.style.animation='',{once:true});
}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* ── KEYBOARD ── */
['inp-name','inp-std'].forEach(id=>{
  document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')startApp();});
});
document.getElementById('inp-task')?.addEventListener('keydown',e=>{if(e.key==='Enter')addTask();});
