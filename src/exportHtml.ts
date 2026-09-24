export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meowdoku - Cozy Cat Queens Puzzle</title>
  <style>
    :root {
      --bg: #FDFBF7;
      --card-bg: #FFFFFF;
      --text: #2D2522;
      --text-muted: #786C65;
      --accent: #E06D53;
      --accent-hover: #C85940;
      --border-dark: #3E312B;
      --border-light: rgba(62, 49, 43, 0.15);
      --font: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      user-select: none;
    }
    header {
      width: 100%;
      max-width: 580px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0 16px;
      border-bottom: 1px solid var(--border-light);
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand span { color: var(--accent); }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    button {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    button:hover { background: #F8F5F0; border-color: var(--border-dark); }
    button.primary { background: var(--accent); color: white; border: none; }
    button.primary:hover { background: var(--accent-hover); }
    .segmented {
      display: flex;
      background: #EFECE6;
      padding: 3px;
      border-radius: 8px;
      gap: 2px;
    }
    .segmented button {
      border: none;
      background: transparent;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .segmented button.active {
      background: white;
      color: var(--text);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .game-container {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 14px;
    }
    .status-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 4px;
      font-size: 14px;
      font-weight: 600;
    }
    .timer {
      font-family: monospace;
      font-size: 16px;
      background: #EFECE6;
      padding: 4px 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .board-wrapper {
      position: relative;
      background: white;
      padding: 8px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(62, 49, 43, 0.08);
      border: 3px solid var(--border-dark);
      width: 100%;
      aspect-ratio: 1 / 1;
      max-width: 440px;
    }
    .grid {
      display: grid;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
    .cell {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 26px;
      transition: background 0.15s ease, transform 0.1s ease;
      touch-action: manipulation;
    }
    .cell:active { transform: scale(0.94); }
    .cell .cross {
      font-size: 20px;
      font-weight: 800;
      color: rgba(62, 49, 43, 0.45);
      user-select: none;
      line-height: 1;
    }
    .cell .cat-icon {
      font-size: 28px;
      line-height: 1;
      animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .cell.conflict {
      background-color: #FECDD3 !important;
      animation: shake 0.3s ease;
    }
    .cell.conflict .cat-icon {
      filter: drop-shadow(0 0 4px #E11D48);
    }
    .cell.conflict-badge::after {
      content: '❌';
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 12px;
    }
    @keyframes popIn {
      0% { transform: scale(0.4); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }
    .b-top { border-top: 3px solid var(--border-dark); }
    .b-bottom { border-bottom: 3px solid var(--border-dark); }
    .b-left { border-left: 3px solid var(--border-dark); }
    .b-right { border-right: 3px solid var(--border-dark); }
    .in-top { border-top: 1px dotted var(--border-light); }
    .in-bottom { border-bottom: 1px dotted var(--border-light); }
    .in-left { border-left: 1px dotted var(--border-light); }
    .in-right { border-right: 1px dotted var(--border-light); }

    .tool-bar {
      margin-top: 14px;
      display: flex;
      justify-content: center;
      gap: 8px;
      width: 100%;
    }
    .mode-toggle {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(45, 37, 34, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .modal-overlay.open { opacity: 1; pointer-events: auto; }
    .modal-card {
      background: white;
      border-radius: 16px;
      border: 2px solid var(--border-dark);
      padding: 24px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .modal-title { font-size: 20px; font-weight: 800; color: var(--text); }
    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.4;
      color: var(--text);
    }
    .rule-item .icon { font-size: 22px; flex-shrink: 0; }
  </style>
</head>
<body>
  <header>
    <div class="brand">Meowdoku <span>🐱</span></div>
    <div class="header-actions">
      <button id="btn-how-to-play">❓ Rules</button>
      <button id="btn-sound">🔊 Sound</button>
    </div>
  </header>

  <div class="game-container">
    <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:12px; align-items:center;">
      <div class="segmented" id="diff-selector">
        <button data-size="5" class="active">5x5 Warmup</button>
        <button data-size="6">6x6 Easy</button>
        <button data-size="7">7x7 Med</button>
        <button data-size="8">8x8 Hard</button>
      </div>
      <div class="timer" id="timer-display">⏱️ 00:00</div>
    </div>

    <div class="status-bar">
      <div id="cats-status">Cats: 0/5</div>
      <div id="puzzle-title" style="color:var(--text-muted); font-size:13px;">First Paws (Warmup) 🐾</div>
    </div>

    <!-- Starter Clue Banner -->
    <div id="starter-clue-banner" style="width:100%; background:#FEF3C7; border:1px solid #FCD34D; border-radius:10px; padding:8px 12px; font-size:12px; color:#78350F; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
      <span>💡 <strong>Starter Clue:</strong> Look for the <strong>single-box color territory</strong>! Since each color territory needs 1 cat, you can place a cat there immediately! 🐱</span>
      <button onclick="document.getElementById('starter-clue-banner').style.display='none'" style="border:none; background:transparent; font-size:14px; padding:0 4px; cursor:pointer; color:#78350F;">✕</button>
    </div>

    <div class="board-wrapper">
      <div class="grid" id="grid"></div>
    </div>

    <div class="mode-toggle">
      <span>💡 Controls: Click for ✖, Double-Click for 🐱. Right-Click also places 🐱!</span>
    </div>

    <div class="tool-bar">
      <button id="btn-undo">↩️ Undo</button>
      <button id="btn-reset">🔄 Reset</button>
      <button id="btn-hint">💡 Hint</button>
      <button id="btn-new-puzzle" class="primary">✨ New Puzzle</button>
    </div>
  </div>

  <!-- How to Play Modal -->
  <div class="modal-overlay" id="rules-modal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">How to Play Meowdoku</div>
        <button id="close-rules" style="padding:4px 8px; border:none; font-size:18px;">✕</button>
      </div>
      <div class="rule-item">
        <div class="icon">🐱</div>
        <div><strong>1 Cat per Row & Column:</strong> Exactly one cat must sit in every horizontal row and every vertical column.</div>
      </div>
      <div class="rule-item">
        <div class="icon">🎨</div>
        <div><strong>1 Cat per Color Territory:</strong> Each colored region must contain exactly one cat.</div>
      </div>
      <div class="rule-item">
        <div class="icon">🚫</div>
        <div><strong>No-Touching Rule:</strong> Cats are solitary! No two cats can touch each other, even diagonally (8 adjacent squares).</div>
      </div>
      <div class="rule-item">
        <div class="icon">👆</div>
        <div><strong>Controls:</strong> Single click to mark safe <strong>✖</strong>. Double click (or right-click) to place a <strong>🐱 Cat</strong>. Conflicting cats turn into red <strong>❌</strong> errors instantly!</div>
      </div>
      <button class="primary" style="width:100%; justify-content:center; margin-top:8px;" id="got-it-btn">Let's Play! 🐾</button>
    </div>
  </div>

  <!-- Victory Modal -->
  <div class="modal-overlay" id="victory-modal">
    <div class="modal-card" style="text-align:center;">
      <div style="font-size:48px; margin-bottom:8px;">🏆🐱🎉</div>
      <div class="modal-title" style="margin-bottom:8px;">Purr-fect Victory!</div>
      <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">All cats are happily cozy and resting without any arguments!</p>
      <div style="background:#F7F4EE; padding:12px; border-radius:10px; margin-bottom:16px; font-weight:600;">
        Time: <span id="win-time">00:00</span> · Difficulty: <span id="win-diff">6x6</span>
      </div>
      <button class="primary" style="width:100%; justify-content:center;" id="next-level-btn">Next Puzzle 🐾</button>
    </div>
  </div>

  <script>
    // Region Pastel Color Palette
    const PALETTE = [
      '#EBDDF7', '#FEF3C7', '#D1FAE5', '#FFE4E6', 
      '#E0F2FE', '#FFEDD5', '#FCE7F3', '#F3E8FF'
    ];

    const PUZZLES = {
      5: [
        {
          name: 'First Paws (Warmup) 🐾',
          hint: 'Spot the single-box color region at Row 1, Col 2! That is a guaranteed cat 🐱.',
          regions: [
            [1, 0, 1, 2, 2],
            [3, 3, 1, 2, 2],
            [3, 3, 1, 2, 2],
            [3, 3, 1, 4, 4],
            [3, 3, 4, 4, 4]
          ],
          solution: [{r:0,c:1},{r:1,c:3},{r:2,c:0},{r:3,c:2},{r:4,c:4}]
        },
        {
          name: 'Sunny Rug 🧶',
          hint: 'The single-box territory is at Row 3, Col 1!',
          regions: [
            [0, 0, 0, 1, 1],
            [3, 0, 0, 1, 1],
            [2, 3, 3, 1, 1],
            [3, 3, 3, 3, 4],
            [3, 4, 4, 4, 4]
          ],
          solution: [{r:0,c:2},{r:1,c:4},{r:2,c:0},{r:3,c:3},{r:4,c:1}]
        }
      ],
      6: [
        {
          name: 'Cozy Kitchen 🐱',
          hint: 'Look for the 1-box territory at Row 4, Col 1!',
          regions: [
            [0, 0, 0, 1, 1, 2],
            [0, 0, 1, 1, 1, 2],
            [0, 0, 4, 1, 2, 2],
            [3, 4, 4, 4, 5, 2],
            [4, 4, 4, 5, 5, 5],
            [4, 4, 4, 5, 5, 5]
          ],
          solution: [{r:0,c:1},{r:1,c:3},{r:2,c:5},{r:3,c:0},{r:4,c:2},{r:5,c:4}]
        },
        {
          name: 'Sunbeam Nap ☀️',
          regions: [
            [0, 0, 1, 1, 1, 2],
            [0, 0, 1, 1, 2, 2],
            [3, 3, 3, 1, 2, 2],
            [4, 4, 3, 3, 5, 2],
            [4, 4, 4, 5, 5, 5],
            [4, 4, 5, 5, 5, 5]
          ],
          solution: [{r:0,c:4},{r:1,c:1},{r:2,c:5},{r:3,c:2},{r:4,c:0},{r:5,c:3}]
        }
      ],
      7: [
        {
          name: 'Garden Paws 🌿',
          regions: [
            [0, 0, 0, 1, 1, 2, 2],
            [0, 0, 1, 1, 1, 2, 2],
            [3, 0, 4, 1, 2, 2, 6],
            [3, 3, 4, 4, 5, 6, 6],
            [3, 4, 4, 4, 5, 5, 6],
            [3, 3, 4, 5, 5, 5, 6],
            [3, 3, 5, 5, 5, 6, 6]
          ],
          solution: [{r:0,c:1},{r:1,c:3},{r:2,c:5},{r:3,c:0},{r:4,c:2},{r:5,c:4},{r:6,c:6}]
        }
      ],
      8: [
        {
          name: 'Cardboard Castle 🏰',
          regions: [
            [0, 0, 0, 0, 1, 1, 1, 3],
            [0, 2, 2, 0, 1, 1, 1, 3],
            [2, 2, 2, 2, 5, 1, 3, 3],
            [4, 2, 2, 5, 5, 5, 3, 3],
            [4, 4, 6, 5, 5, 5, 3, 7],
            [4, 4, 6, 6, 5, 7, 7, 7],
            [6, 6, 6, 6, 7, 7, 7, 7],
            [6, 6, 6, 7, 7, 7, 7, 7]
          ],
          solution: [{r:0,c:3},{r:1,c:6},{r:2,c:2},{r:3,c:7},{r:4,c:1},{r:5,c:4},{r:6,c:0},{r:7,c:5}]
        }
      ]
    };

    let currentSize = 5;
    let puzzleIndex = 0;
    let currentPuzzle = PUZZLES[5][0];
    let board = [];
    let moveHistory = [];
    let soundEnabled = true;
    let timerSeconds = 0;
    let timerInterval = null;
    let clickTimeout = null;

    // Web Audio Synthesizer
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function beep(freq, duration, type='sine') {
      if (!soundEnabled || !audioCtx) return;
      try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function initGame(size = 6, nextPuz = false) {
      currentSize = size;
      const list = PUZZLES[size] || PUZZLES[6];
      if (nextPuz) puzzleIndex = (puzzleIndex + 1) % list.length;
      currentPuzzle = list[puzzleIndex % list.length];
      
      board = Array.from({length: size}, () => Array(size).fill('empty'));
      moveHistory = [];
      
      clearInterval(timerInterval);
      timerSeconds = 0;
      updateTimer();
      timerInterval = setInterval(() => { timerSeconds++; updateTimer(); }, 1000);

      document.getElementById('puzzle-title').textContent = currentPuzzle.name;
      renderGrid();
      validateAndRender();
    }

    function updateTimer() {
      const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
      const s = String(timerSeconds % 60).padStart(2, '0');
      document.getElementById('timer-display').textContent = '⏱️ ' + m + ':' + s;
    }

    function renderGrid() {
      const grid = document.getElementById('grid');
      grid.style.gridTemplateColumns = 'repeat(' + currentSize + ', 1fr)';
      grid.style.gridTemplateRows = 'repeat(' + currentSize + ', 1fr)';
      grid.innerHTML = '';

      for (let r = 0; r < currentSize; r++) {
        for (let c = 0; c < currentSize; c++) {
          const region = currentPuzzle.regions[r][c];
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.id = 'cell-' + r + '-' + c;
          cell.style.backgroundColor = PALETTE[region % PALETTE.length];

          // Compute borders
          const bTop = r === 0 || currentPuzzle.regions[r - 1][c] !== region;
          const bBottom = r === currentSize - 1 || currentPuzzle.regions[r + 1][c] !== region;
          const bLeft = c === 0 || currentPuzzle.regions[r][c - 1] !== region;
          const bRight = c === currentSize - 1 || currentPuzzle.regions[r][c + 1] !== region;

          cell.classList.add(bTop ? 'b-top' : 'in-top');
          cell.classList.add(bBottom ? 'b-bottom' : 'in-bottom');
          cell.classList.add(bLeft ? 'b-left' : 'in-left');
          cell.classList.add(bRight ? 'b-right' : 'in-right');

          // Events
          cell.addEventListener('click', (e) => handleCellClick(r, c));
          cell.addEventListener('dblclick', (e) => {
            e.preventDefault();
            handleCellDoubleClick(r, c);
          });
          cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            handleCellDoubleClick(r, c);
          });

          grid.appendChild(cell);
        }
      }
    }

    function handleCellClick(r, c) {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        handleCellDoubleClick(r, c);
        return;
      }
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        // Single click: place or clear 'cross'
        const current = board[r][c];
        const next = current === 'cross' ? 'empty' : current === 'cat' ? 'empty' : 'cross';
        moveHistory.push({r, c, prev: current, next});
        board[r][c] = next;
        beep(360, 0.05, 'triangle');
        validateAndRender();
      }, 230);
    }

    function handleCellDoubleClick(r, c) {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
      // Double click: place cat or clear
      const current = board[r][c];
      const next = current === 'cat' ? 'empty' : 'cat';
      moveHistory.push({r, c, prev: current, next});
      board[r][c] = next;
      if (next === 'cat') {
        beep(587, 0.08, 'sine');
        setTimeout(() => beep(880, 0.12, 'sine'), 60);
      } else {
        beep(260, 0.06, 'sine');
      }
      validateAndRender();
    }

    function validateAndRender() {
      const cats = [];
      let totalCats = 0;
      for (let r = 0; r < currentSize; r++) {
        for (let c = 0; c < currentSize; c++) {
          if (board[r][c] === 'cat') {
            cats.push({r, c, region: currentPuzzle.regions[r][c]});
            totalCats++;
          }
        }
      }

      // Conflict detection
      const conflicts = new Set();
      for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
          const a = cats[i];
          const b = cats[j];
          const sameRow = a.r === b.r;
          const sameCol = a.c === b.c;
          const sameReg = a.region === b.region;
          const touching = Math.abs(a.r - b.r) <= 1 && Math.abs(a.c - b.c) <= 1;

          if (sameRow || sameCol || sameReg || touching) {
            conflicts.add(a.r + ',' + a.c);
            conflicts.add(b.r + ',' + b.c);
          }
        }
      }

      // Update cell DOM
      for (let r = 0; r < currentSize; r++) {
        for (let c = 0; c < currentSize; c++) {
          const cell = document.getElementById('cell-' + r + '-' + c);
          const state = board[r][c];
          const isConflict = conflicts.has(r + ',' + c);

          cell.innerHTML = '';
          cell.classList.remove('conflict', 'conflict-badge');

          if (state === 'cross') {
            cell.innerHTML = '<span class="cross">✕</span>';
          } else if (state === 'cat') {
            if (isConflict) {
              cell.innerHTML = '<span class="cat-icon">❌</span>';
              cell.classList.add('conflict');
            } else {
              cell.innerHTML = '<span class="cat-icon">🐱</span>';
            }
          }
        }
      }

      document.getElementById('cats-status').textContent = 'Cats: ' + totalCats + '/' + currentSize;

      // Victory Check
      if (totalCats === currentSize && conflicts.size === 0) {
        clearInterval(timerInterval);
        setTimeout(handleVictory, 300);
      }
    }

    function handleVictory() {
      // Fanfare
      beep(523, 0.15, 'triangle');
      setTimeout(() => beep(659, 0.15, 'triangle'), 100);
      setTimeout(() => beep(783, 0.15, 'triangle'), 200);
      setTimeout(() => beep(1046, 0.4, 'triangle'), 300);

      document.getElementById('win-time').textContent = document.getElementById('timer-display').textContent.replace('⏱️ ', '');
      document.getElementById('win-diff').textContent = currentSize + 'x' + currentSize;
      document.getElementById('victory-modal').classList.add('open');
    }

    // Modal & Buttons Listeners
    document.getElementById('btn-how-to-play').onclick = () => document.getElementById('rules-modal').classList.add('open');
    document.getElementById('close-rules').onclick = () => document.getElementById('rules-modal').classList.remove('open');
    document.getElementById('got-it-btn').onclick = () => document.getElementById('rules-modal').classList.remove('open');
    document.getElementById('next-level-btn').onclick = () => {
      document.getElementById('victory-modal').classList.remove('open');
      initGame(currentSize, true);
    };

    document.getElementById('btn-reset').onclick = () => {
      board = Array.from({length: currentSize}, () => Array(currentSize).fill('empty'));
      moveHistory = [];
      validateAndRender();
    };

    document.getElementById('btn-undo').onclick = () => {
      if (moveHistory.length === 0) return;
      const last = moveHistory.pop();
      board[last.r][last.c] = last.prev;
      validateAndRender();
    };

    document.getElementById('btn-new-puzzle').onclick = () => initGame(currentSize, true);

    document.getElementById('btn-hint').onclick = () => {
      // Reveal one solution cat or safe cross
      for (const sol of currentPuzzle.solution) {
        if (board[sol.r][sol.c] !== 'cat') {
          board[sol.r][sol.c] = 'cat';
          moveHistory.push({r: sol.r, c: sol.c, prev: 'empty', next: 'cat'});
          beep(784, 0.15, 'sine');
          validateAndRender();
          return;
        }
      }
    };

    document.getElementById('btn-sound').onclick = (e) => {
      soundEnabled = !soundEnabled;
      e.target.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
    };

    // Difficulty Buttons
    document.querySelectorAll('#diff-selector button').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#diff-selector button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        initGame(parseInt(btn.dataset.size), false);
      };
    });

    // Start
    initGame(5);
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile() {
  const htmlContent = generateStandaloneHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meowdoku.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
