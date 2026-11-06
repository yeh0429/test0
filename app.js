const people={林以安:{initial:'林',cls:'av1'},陳思妤:{initial:'陳',cls:'av2'},王子維:{initial:'王',cls:'av3'},許家豪:{initial:'許',cls:'av4'}};
let tasks=[
{id:1,title:'完成首頁視覺設計稿',project:'網站改版',assignee:'陳思妤',priority:'high',due:'2026-10-30',status:'todo',comments:['以安：今天先確認主視覺方向。','思妤：收到，我會先提供兩版草稿。']},
{id:2,title:'整理使用者訪談重點',project:'產品研究',assignee:'林以安',priority:'medium',due:'2026-10-31',status:'todo',comments:['已整理 6 位使用者訪談，待補上洞察。']},
{id:3,title:'確認第三季預算與資源',project:'營運規劃',assignee:'王子維',priority:'low',due:'2026-11-03',status:'todo',comments:[]},
{id:4,title:'更新產品需求文件',project:'行動應用程式',assignee:'林以安',priority:'medium',due:'2026-10-30',status:'doing',comments:['產品範圍已更新，請協助確認 API 規格。']},
{id:5,title:'準備客戶提案簡報',project:'客戶 A 專案',assignee:'許家豪',priority:'high',due:'2026-10-31',status:'doing',comments:['家豪：大綱完成，明天下午提供初稿。']},
{id:6,title:'測試登入流程與錯誤提示',project:'品質測試',assignee:'陳思妤',priority:'medium',due:'2026-11-02',status:'doing',comments:[]},
{id:7,title:'完成品牌色票整理',project:'品牌識別',assignee:'王子維',priority:'low',due:'2026-10-28',status:'done',comments:['已放入共用資料夾。']},
{id:8,title:'寄送週會會議紀錄',project:'團隊協作',assignee:'林以安',priority:'low',due:'2026-10-27',status:'done',comments:[]}
];
let events=[{title:'產品週會',date:'2026-10-30',time:'10:00',owner:'林以安',type:'team'},{title:'設計評審',date:'2026-10-30',time:'14:30',owner:'陳思妤',type:'team'},{title:'客戶 A 提案討論',date:'2026-10-31',time:'11:00',owner:'許家豪',type:'team'},{title:'團隊回顧',date:'2026-11-02',time:'16:00',owner:'王子維',type:'team'},{title:'完成首頁設計稿',date:'2026-11-04',time:'17:00',owner:'陳思妤',type:'deadline'},{title:'專注工作時段',date:'2026-11-05',time:'09:00',owner:'林以安',type:'focus'}];
let activities=[{person:'陳思妤',text:'將 <b>完成首頁視覺設計稿</b> 移至待辦',time:'10 分鐘前'},{person:'王子維',text:'完成了 <b>品牌色票整理</b>',time:'35 分鐘前'},{person:'許家豪',text:'在 <b>客戶提案簡報</b> 留下留言',time:'1 小時前'},{person:'林以安',text:'建立了 <b>產品週會</b> 行程',time:'昨天'}];
let filterMode='all',searchTerm='',calendarDate=new Date(2026,9,30),activeCommentId=null;
const fmtDate=s=>{if(!s)return'未設定';let d=new Date(s+'T00:00:00');return`${d.getMonth()+1}/${d.getDate()}`};
function personAvatar(name,mini=false){let p=people[name]||{initial:name?.[0]||'我',cls:'av3'};return`<span class="${mini?'mini-avatar':'avatar'} ${p.cls}">${p.initial}</span>`}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderTasks(){let cols={todo:[],doing:[],done:[]};tasks.forEach(t=>{let ok=true;if(filterMode==='mine')ok=t.assignee==='林以安';if(filterMode==='due')ok=t.due&&t.due<='2026-11-02'&&t.status!=='done';if(searchTerm)ok=ok&&(t.title+' '+t.project+' '+t.assignee).toLowerCase().includes(searchTerm.toLowerCase());if(ok)cols[t.status].push(t)});document.querySelectorAll('.board-col').forEach(c=>{let list=cols[c.dataset.status];c.querySelector('.col-count').textContent=list.length;c.querySelector('.cards').innerHTML=list.map(t=>`<article class="task-card" draggable="true" data-id="${t.id}"><div class="task-title">${escapeHtml(t.title)}</div><div class="task-project">${escapeHtml(t.project)}</div><div class="task-footer"><span class="priority p-${t.priority}">${{high:'高優先',medium:'中優先',low:'低優先'}[t.priority]}</span><span class="task-meta"><span>◷ ${fmtDate(t.due)}</span><span class="comment-link" data-comment="${t.id}" title="留言" style="cursor:pointer">▤ ${t.comments.length}</span></span>${personAvatar(t.assignee,true)}</div></article>`).join('')||'<div class="empty">目前沒有任務</div>'});let open=tasks.filter(t=>t.status!=='done').length;document.getElementById('statOpen').textContent=String(open).padStart(2,'0');document.getElementById('taskTotal').textContent=open;document.getElementById('statDone').textContent=String(tasks.filter(t=>t.status==='done').length).padStart(2,'0');document.getElementById('statDue').textContent=String(tasks.filter(t=>t.status!=='done'&&t.due&&t.due>='2026-10-30'&&t.due<='2026-11-02').length).padStart(2,'0');document.getElementById('todayTaskCount').textContent=tasks.filter(t=>t.status!=='done'&&t.due==='2026-10-30').length;wireCards()}
function wireCards(){document.querySelectorAll('.task-card').forEach(card=>{card.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',card.dataset.id);card.style.opacity='.45'});card.addEventListener('dragend',()=>card.style.opacity='1');card.addEventListener('click',e=>{if(e.target.closest('.comment-link'))openComments(+e.target.closest('.comment-link').dataset.comment)})});document.querySelectorAll('.board-col').forEach(col=>{col.ondragover=e=>{e.preventDefault();col.style.background='#f0edff'};col.ondragleave=()=>col.style.background='';col.ondrop=e=>{e.preventDefault();col.style.background='';let t=tasks.find(x=>x.id===+e.dataTransfer.getData('text/plain'));if(t&&t.status!==col.dataset.status){t.status=col.dataset.status;renderTasks();toast('任務狀態已更新')}}})}
function eventHTML(e){return`<div class="event"><div class="event-time">${e.time}</div><div class="event-mark ${e.type==='deadline'?'orange':''}"></div><div><div class="event-name">${escapeHtml(e.title)}</div><div class="event-note">${escapeHtml(e.owner)} · ${e.type==='deadline'?'重要期限':e.type==='focus'?'專注時段':'團隊會議'}</div></div></div>`}
function renderUpcoming(){let next=events.filter(e=>e.date>='2026-10-30').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,3);document.getElementById('upcomingEvents').innerHTML=next.map(eventHTML).join('')||'<div class="empty">目前沒有行程</div>'}
function renderCalendar(){let y=calendarDate.getFullYear(),m=calendarDate.getMonth(),first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();document.getElementById('calMonth').textContent=`${y} 年 ${m+1} 月`;document.getElementById('calSubtitle').textContent=`${y} 年 ${m+1} 月團隊安排`;let out=['一','二','三','四','五','六','日'].map(x=>`<div class="weekday">${x}</div>`).join('');for(let i=0;i<42;i++){let day,month=m,year=y,muted='';if(i<start){day=prevDays-start+i+1;muted='muted';if(m===0){month=11;year--}else month--}else if(i>=start+days){day=i-start-days+1;muted='muted';if(m===11){month=0;year++}else month++}else day=i-start+1;let key=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,today=key==='2026-10-30',has=events.some(e=>e.date===key);out+=`<div class="date ${muted} ${today?'today':''} ${has?'has-event':''}" data-date="${key}">${day}</div>`}document.getElementById('calendarGrid').innerHTML=out;document.querySelectorAll('.date').forEach(el=>el.onclick=()=>{document.querySelector('.upcoming-title').textContent=`${fmtDate(el.dataset.date)} 行程`;let list=events.filter(e=>e.date===el.dataset.date);document.getElementById('upcomingEvents').innerHTML=list.map(eventHTML).join('')||'<div class="empty">當天沒有安排</div>'});renderUpcoming()}
function renderAgenda(){let start=new Date(2026,9,26),end=new Date(2026,10,2),list=events.filter(e=>{let d=new Date(e.date+'T00:00:00');return d>=start&&d<end}).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));document.getElementById('agendaList').innerHTML=list.map(e=>`<div class="agenda-row"><div class="agenda-time">${fmtDate(e.date)}　${e.time}</div><div class="agenda-body ${e.type==='deadline'?'orange':''}"><div class="agenda-name">${escapeHtml(e.title)}<span class="agenda-tag ${e.type==='deadline'?'orange':''}">${e.type==='deadline'?'期限':e.type==='focus'?'專注':'團隊'}</span></div><div class="agenda-sub">${escapeHtml(e.owner)} · Northstar Studio</div></div></div>`).join('')||'<div class="empty">本週尚無行程</div>';document.getElementById('statEvents').textContent=String(list.length).padStart(2,'0')}
function renderActivity(){document.getElementById('activityList').innerHTML=activities.slice(0,4).map(a=>`<div class="activity-item">${personAvatar(a.person,true)}<div><div class="activity-text"><b>${a.person}</b> ${a.text}</div><div class="activity-time">${a.time}</div></div></div>`).join('')}
function toast(msg){let el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}
function openComments(id){activeCommentId=id;let t=tasks.find(x=>x.id===id);document.getElementById('commentTitle').textContent=t.title+'｜留言';document.getElementById('commentBody').innerHTML=t.comments.length?t.comments.map(x=>`<div style="padding:5px 0;border-bottom:1px solid #e9eaf0">${escapeHtml(x)}</div>`).join(''):'尚無留言，開始討論吧。';document.getElementById('commentModal').classList.add('show')}
document.getElementById('newTaskBtn').onclick=()=>document.getElementById('taskModal').classList.add('show');document.getElementById('addEventBtn').onclick=()=>document.getElementById('eventModal').classList.add('show');document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).classList.remove('show'));document.querySelectorAll('.modal-backdrop').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('show')}));
document.getElementById('taskForm').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);tasks.unshift({id:Math.max(...tasks.map(t=>t.id))+1,title:f.get('title'),project:'團隊任務',assignee:f.get('assignee'),priority:f.get('priority'),due:f.get('due'),status:f.get('status'),comments:[]});renderTasks();e.target.reset();document.getElementById('taskModal').classList.remove('show');toast('任務已建立並加入看板')};
document.getElementById('eventForm').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);events.push({title:f.get('title'),date:f.get('date'),time:f.get('time'),owner:f.get('owner'),type:f.get('type')});renderCalendar();renderAgenda();e.target.reset();document.getElementById('eventModal').classList.remove('show');toast('團隊行程已新增')};
document.getElementById('commentForm').onsubmit=e=>{e.preventDefault();let text=new FormData(e.target).get('comment'),t=tasks.find(x=>x.id===activeCommentId);t.comments.push('以安：'+text);activities.unshift({person:'林以安',text:`在 <b>${escapeHtml(t.title)}</b> 留下留言`,time:'剛剛'});renderTasks();renderActivity();e.target.reset();openComments(t.id);toast('留言已送出')};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');filterMode=b.dataset.filter;renderTasks()});document.getElementById('searchInput').oninput=e=>{searchTerm=e.target.value;renderTasks()};document.getElementById('prevMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()};document.getElementById('nextMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()};document.getElementById('todayBtn').onclick=()=>{calendarDate=new Date(2026,9,30);renderCalendar()};document.getElementById('weekViewBtn').onclick=()=>toast('目前顯示本週行程；可透過新增行程安排團隊時間');document.getElementById('notifyBtn').onclick=()=>toast('目前沒有未讀通知');document.getElementById('activityMore').onclick=()=>toast('已顯示最近的團隊動態');document.querySelectorAll('.nav-item').forEach(a=>a.onclick=()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));a.classList.add('active')});
const days=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];document.getElementById('todayLabel').textContent=`${days[new Date(2026,9,30).getDay()]}，2026 年 10 月 30 日`;renderTasks();renderCalendar();renderAgenda();renderActivity();

// Firebase Authentication: set Firebase web app values in firebase-config.js (never commit private credentials).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
let firebaseConfig;
try {
  ({ firebaseConfig } = await import('./firebase-config.public.js'));
} catch (error) {
  console.error('Firebase configuration is missing:', error);
}

if (!firebaseConfig || Object.values(firebaseConfig).some(value => String(value).startsWith('YOUR_'))) {
  const button = document.getElementById('googleSignInBtn');
  button.disabled = true;
  button.title = '請先依 FIREBASE_SETUP.md 建立 firebase-config.js';
  button.textContent = '尚未設定 Firebase';
  document.getElementById('profileRole').textContent = '請設定 Firebase';
  const profileName = document.getElementById('profileName');
  profileName.textContent = 'Firebase 尚未設定';
} else {

const auth = getAuth(initializeApp(firebaseConfig));
const googleProvider = new GoogleAuthProvider();
const signInButton = document.getElementById('googleSignInBtn');
const signOutButton = document.getElementById('signOutBtn');
const userPhoto = document.getElementById('userPhoto');
const guestAvatar = document.getElementById('guestAvatar');
const profileName = document.getElementById('profileName');

signInButton.addEventListener('click', async () => {
  signInButton.disabled = true;
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Google sign-in failed:', error);
    toast(error.code === 'auth/unauthorized-domain'
      ? '此網域尚未加入 Firebase 授權網域，請至 Firebase Authentication 設定。'
      : 'Google 登入失敗，請稍後再試。');
  } finally {
    signInButton.disabled = false;
  }
});

signOutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out failed:', error);
    toast('登出失敗，請稍後再試。');
  }
});

onAuthStateChanged(auth, user => {
  signInButton.hidden = Boolean(user);
  signOutButton.hidden = !user;
  userPhoto.hidden = !user?.photoURL;
  guestAvatar.hidden = Boolean(user?.photoURL);
  if (user?.photoURL) userPhoto.src = user.photoURL;
  const displayName = user?.displayName || user?.email || '使用者';
  profileName.textContent = user ? displayName : '林以安';
  document.getElementById('profileRole').textContent = user ? 'Google 帳戶' : '示範帳戶';
  document.getElementById('welcomeGreeting').textContent = user ? `早安，${displayName}` : '早安，以安';
  if (user && !user?.photoURL) guestAvatar.textContent = displayName.slice(0, 1).toUpperCase();
  if (!user) guestAvatar.textContent = '林';
});
}