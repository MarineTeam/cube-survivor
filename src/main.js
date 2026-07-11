import './style.css'

const $ = s => document.querySelector(s)
const canvas = $('#stars'), ctx = canvas.getContext('2d')
let chosen = 'VANGUARD', active = false, x = 50, score = 0, start = 0, last = 0, spawn = 0, enemies = [], best = Number(localStorage.getItem('cube-best') || 0)
$('#best').textContent = String(best).padStart(4, '0')
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);drawStars()}
function drawStars(){ctx.clearRect(0,0,innerWidth,innerHeight);for(let i=0;i<110;i++){let x=Math.random()*innerWidth,y=Math.random()*innerHeight;ctx.fillStyle=i%8?'#7b8bb633':'#3ef0ff';ctx.fillRect(x,y,1,1)}}
resize(); addEventListener('resize',resize)
$('#ackBtn').onclick=()=>{$('#warning').classList.add('hidden');$('#menu').classList.remove('hidden')}
document.querySelectorAll('.mode').forEach((b,i)=>b.onclick=()=>{document.querySelector('.mode.selected').classList.remove('selected');b.classList.add('selected');$('#modeInfo').textContent=['A balanced 10-minute arena run. Elites appear every two minutes.','One life. Tougher packs. No second chances.','No finish line. Survive for as long as you can.'][i]})
document.querySelectorAll('.card').forEach(c=>c.onclick=()=>{document.querySelector('.card.selected').classList.remove('selected');c.classList.add('selected');chosen=c.dataset.name})
$('#deployBtn').onclick=startGame; $('#again').onclick=startGame; $('#quit').onclick=()=>{active=false;$('#game').classList.add('hidden');$('#menu').classList.remove('hidden')}
function startGame(){ $('#menu').classList.add('hidden');$('#gameover').classList.add('hidden');$('#game').classList.remove('hidden');enemies.forEach(e=>e.el.remove());enemies=[];x=50;score=0;start=performance.now();last=0;spawn=0;active=true;$('#player').style.left='50%';$('#player').style.top='75%';requestAnimationFrame(loop) }
function move(d){if(active){x=Math.max(5,Math.min(95,x+d*7));$('#player').style.left=x+'%'}}
function loop(now){if(!active)return;let dt=Math.min(35,now-last||16);last=now;score=Math.floor((now-start)/100);let seconds=Math.floor((now-start)/1000);$('#time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;$('#level').textContent=String(Math.floor(score/12)+1).padStart(2,'0');$('#xp').textContent=`${score%10} / 10`;spawn+=dt;if(spawn>Math.max(260,690-score*2)){spawn=0;addEnemy()}let p=$('#player').getBoundingClientRect();enemies=enemies.filter(e=>{e.y+=dt*(.11+score/7000);e.el.style.top=e.y+'px';let r=e.el.getBoundingClientRect();if(r.bottom>p.top+5&&r.top<p.bottom&&r.right>p.left+5&&r.left<p.right-5){endGame();return false}if(e.y>innerHeight+50){e.el.remove();return false}return true});requestAnimationFrame(loop)}
function addEnemy(){let el=document.createElement('i');el.className='enemy'+(Math.random()>.62?' alt':'');el.style.left=(4+Math.random()*92)+'%';el.style.top='-40px';$('#arena').appendChild(el);enemies.push({el,y:-40})}
function endGame(){active=false;if(score>best){best=score;localStorage.setItem('cube-best',best)}$('#best').textContent=String(best).padStart(4,'0');$('#finalScore').textContent=String(score).padStart(4,'0');$('#finalTime').textContent=$('#time').textContent;$('#game').classList.add('hidden');$('#gameover').classList.remove('hidden')}
addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key)){e.preventDefault();move(-1)}if(['ArrowRight','d','D'].includes(e.key)){e.preventDefault();move(1)}});document.querySelectorAll('[data-move]').forEach(b=>b.onpointerdown=()=>move(b.dataset.move==='left'?-1:1))
