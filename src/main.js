import './style.css'

const dialog = document.querySelector('#gameDialog')
const arcade = document.querySelector('#arcade')
const field = document.querySelector('#gameField')
const ship = document.querySelector('#ship')
const scoreEl = document.querySelector('#score')
const bestEl = document.querySelector('#best')
const gameOver = document.querySelector('#gameOver')
const finalScore = document.querySelector('#finalScore')
let active = false, position = 50, score = 0, lastTime = 0, spawnClock = 0, cubes = []
let best = Number(localStorage.getItem('cube-survivor-best') || 0)
bestEl.textContent = String(best).padStart(4, '0')

document.querySelector('#playButton').addEventListener('click', () => dialog.showModal())
document.querySelector('#closeDialog').addEventListener('click', () => dialog.close())
document.querySelector('#startButton').addEventListener('click', startGame)
document.querySelector('#restartButton').addEventListener('click', startGame)
document.querySelector('#quitButton').addEventListener('click', stopGame)
document.querySelector('#howButton').addEventListener('click', () => document.querySelector('#how').scrollIntoView({ behavior: 'smooth' }))
document.querySelector('#soundToggle').addEventListener('click', e => e.currentTarget.classList.toggle('muted'))

function startGame() {
  dialog.close(); gameOver.classList.remove('show'); arcade.classList.add('show'); arcade.setAttribute('aria-hidden', 'false')
  cubes.forEach(c => c.el.remove()); cubes = []; position = 50; score = 0; spawnClock = 0; lastTime = 0; active = true
  ship.style.left = `${position}%`; scoreEl.textContent = '0000'; requestAnimationFrame(tick)
}
function stopGame() { active = false; arcade.classList.remove('show'); arcade.setAttribute('aria-hidden', 'true') }
function move(direction) { if (active) { position = Math.max(7, Math.min(93, position + direction * 7)); ship.style.left = `${position}%` } }
function tick(time) {
  if (!active) return
  const delta = Math.min(32, time - lastTime || 16); lastTime = time; score += delta / 14
  scoreEl.textContent = String(Math.floor(score)).padStart(4, '0'); spawnClock += delta
  if (spawnClock > Math.max(240, 700 - score * 2.2)) { spawnClock = 0; spawnCube() }
  const shipBox = ship.getBoundingClientRect()
  cubes = cubes.filter(c => {
    c.y += delta * (.14 + score / 8200); c.el.style.transform = `translate(-50%, ${c.y}px) rotate(${c.y / 5}deg)`
    const box = c.el.getBoundingClientRect()
    if (box.bottom > shipBox.top + 10 && box.top < shipBox.bottom && box.right > shipBox.left + 8 && box.left < shipBox.right - 8) { endGame(); return false }
    if (c.y > field.clientHeight + 70) { c.el.remove(); return false } return true
  })
  requestAnimationFrame(tick)
}
function spawnCube() { const el = document.createElement('div'); el.className = `enemy enemy-${Math.floor(Math.random() * 4)}`; el.style.left = `${6 + Math.random() * 88}%`; field.appendChild(el); cubes.push({ el, y: -70 }) }
function endGame() { active = false; const final = Math.floor(score); if (final > best) { best = final; localStorage.setItem('cube-survivor-best', best) }; bestEl.textContent = String(best).padStart(4, '0'); finalScore.textContent = String(final).padStart(4, '0'); gameOver.classList.add('show') }
document.addEventListener('keydown', e => { if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); move(-1) }; if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); move(1) } })
document.querySelectorAll('[data-move]').forEach(button => button.addEventListener('pointerdown', () => move(button.dataset.move === 'left' ? -1 : 1)))
