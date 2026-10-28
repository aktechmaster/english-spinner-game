/* ==========================================================================
   MAIN GAME APPLICATION ENGINE (FIXED & PROTECTED)
   ========================================================================== */
const GameApp = {
  studentCount: 36,
  timerDuration: 15,
  autoEliminate: true,
  mode: 'teams',
  
  remainingStudents: [],
  eliminatedStudents: [],
  usedQuestionIds: [],
  
  // 4 Warna Baku Tim
  teams: [
    { name: 'Team Red', color: '#ef4444', score: 0 },    // Indeks 0 (Siswa 1, 5, 9...)
    { name: 'Team Blue', color: '#3b82f6', score: 0 },   // Indeks 1 (Siswa 2, 6, 10...)
    { name: 'Team Green', color: '#10b981', score: 0 },  // Indeks 2 (Siswa 3, 7, 11...)
    { name: 'Team Yellow', color: '#eab308', score: 0 }  // Indeks 3 (Siswa 4, 8, 12...)
  ],
  individualScores: {},

  questionBank: [],
  currentDrawnStudent: null,
  currentQuestion: null,
  
  timerInterval: null,
  timeLeft: 15,

  canvas: null,
  ctx: null,
  currentAngle: 0,
  isSpinning: false,
  lastTickSlice: -1,

  init() {
    this.loadStorage();
    if (!this.questionBank || this.questionBank.length === 0) {
      this.questionBank = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    }

    ConfettiEngine.init();
    this.initCanvas();
    this.setupKeyboardShortcuts();

    if (this.remainingStudents.length === 0) {
      this.resetRemainingStudents();
    }

    this.updateUI();
    this.drawWheel();
  },

  initCanvas() {
    this.canvas = document.getElementById('spinner-canvas');
    this.ctx = this.canvas.getContext('2d');
  },

  loadStorage() {
    try {
      const savedCount = localStorage.getItem('eng_game_count');
      if (savedCount) this.studentCount = parseInt(savedCount, 10);

      const savedTimer = localStorage.getItem('eng_game_timer');
      if (savedTimer) this.timerDuration = parseInt(savedTimer, 10);

      const savedAuto = localStorage.getItem('eng_game_auto');
      if (savedAuto !== null) this.autoEliminate = savedAuto === 'true';

      const savedMode = localStorage.getItem('eng_game_mode');
      if (savedMode) this.mode = savedMode;

      const savedBank = localStorage.getItem('eng_game_bank');
      if (savedBank) {
        this.questionBank = JSON.parse(savedBank);
        // Normalisasi kategori agar selalu huruf kecil (mencegah error case mismatch)
        this.questionBank.forEach(q => {
          if (q.category) q.category = q.category.toLowerCase();
        });
      }

      const savedTeams = localStorage.getItem('eng_game_teams');
      if (savedTeams) this.teams = JSON.parse(savedTeams);

      const savedIndiv = localStorage.getItem('eng_game_indiv');
      if (savedIndiv) this.individualScores = JSON.parse(savedIndiv);
    } catch(e){}
  },

  saveStorage() {
    try {
      localStorage.setItem('eng_game_count', this.studentCount);
      localStorage.setItem('eng_game_timer', this.timerDuration);
      localStorage.setItem('eng_game_auto', this.autoEliminate);
      localStorage.setItem('eng_game_mode', this.mode);
      localStorage.setItem('eng_game_bank', JSON.stringify(this.questionBank));
      localStorage.setItem('eng_game_teams', JSON.stringify(this.teams));
      localStorage.setItem('eng_game_indiv', JSON.stringify(this.individualScores));
    } catch(e){}
  },

  resetRemainingStudents() {
    this.remainingStudents = Array.from({ length: this.studentCount }, (_, i) => i + 1);
    this.eliminatedStudents = [];
    this.usedQuestionIds = [];
    this.updateUI();
    this.drawWheel();
  },

  updateUI() {
    document.getElementById('display-student-count').textContent = `${this.studentCount} Students`;
    document.getElementById('badge-mode').textContent = this.mode === 'teams' ? 'Team Competition' : 'Individual Mode';
    document.getElementById('remaining-count-num').textContent = this.remainingStudents.length;

    const grid = document.getElementById('student-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= this.studentCount; i++) {
      const isRemaining = this.remainingStudents.includes(i);
      const badge = document.createElement('span');
      badge.className = `px-2 py-0.5 text-xs rounded-md font-bold transition-all ${
        isRemaining 
          ? 'bg-slate-700 text-slate-200 border border-slate-600' 
          : 'bg-slate-900/40 text-slate-600 border border-slate-800 line-through'
      }`;
      badge.textContent = `#${i}`;
      grid.appendChild(badge);
    }

    this.renderScoreboard();
  },

  renderScoreboard() {
    const list = document.getElementById('scoreboard-list');
    const label = document.getElementById('scoreboard-type-label');
    list.innerHTML = '';

    if (this.mode === 'teams') {
      label.textContent = 'Team Standings';
      this.teams.forEach((t, idx) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/80';
        div.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="w-3.5 h-3.5 rounded-full shadow-md" style="background-color: ${t.color}"></span>
            <span class="font-bold text-sm text-slate-200">${t.name}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="GameApp.adjustScore('team', ${idx}, -5)" class="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 font-bold text-xs">-</button>
            <span class="font-display font-bold text-lg text-amber-400 w-10 text-center">${t.score}</span>
            <button onclick="GameApp.adjustScore('team', ${idx}, 5)" class="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 font-bold text-xs">+</button>
          </div>
        `;
        list.appendChild(div);
      });
    } else {
      label.textContent = 'Top Student Scores';
      const entries = Object.entries(this.individualScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (entries.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-500 italic text-center py-2">No individual scores recorded yet.</p>`;
      } else {
        entries.forEach(([student, score]) => {
          const div = document.createElement('div');
          div.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/80 text-xs';
          div.innerHTML = `
            <span class="font-bold text-slate-200">Student #${student}</span>
            <span class="font-display font-bold text-base text-amber-400">${score} pts</span>
          `;
          list.appendChild(div);
        });
      }
    }
  },

  drawWheel() {
    if (!this.ctx) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = centerX - 10;

    this.ctx.clearRect(0, 0, width, height);

    const list = this.remainingStudents.length > 0 
      ? this.remainingStudents 
      : Array.from({ length: this.studentCount }, (_, i) => i + 1);

    const sliceAngle = (2 * Math.PI) / list.length;
    const teamColors = ['#ef4444', '#3b82f6', '#10b981', '#eab308']; // Merah, Biru, Hijau, Kuning

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.currentAngle);

    for (let i = 0; i < list.length; i++) {
      const studentNum = list[i];
      const angleStart = i * sliceAngle;
      const angleEnd = angleStart + sliceAngle;
      
      const teamIndex = (studentNum - 1) % 4;

      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, angleStart, angleEnd);
      this.ctx.closePath();
      this.ctx.fillStyle = teamColors[teamIndex];
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.stroke();

      this.ctx.save();
      this.ctx.rotate(angleStart + sliceAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = list.length > 30 ? 'bold 13px Inter' : 'bold 18px Fredoka';
      this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(`#${studentNum}`, radius - 18, 6);
      this.ctx.restore();
    }

    this.ctx.restore();
  },

  spinWheel() {
    if (this.isSpinning) return;
    if (this.remainingStudents.length === 0) {
      this.resetRemainingStudents();
    }

    this.isSpinning = true;
    document.getElementById('btn-spin').disabled = true;

    const spinDuration = 4500;
    const startTime = performance.now();
    const startAngle = this.currentAngle;
    
    const totalRotation = (Math.PI * 2 * (4 + Math.random() * 3)) + (Math.random() * Math.PI * 2);

    const list = this.remainingStudents;
    const sliceAngle = (2 * Math.PI) / list.length;

    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.currentAngle = startAngle + totalRotation * easeOut;

      const normalizedAngle = (this.currentAngle % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
      const pointerAngle = (3 * Math.PI / 2 - normalizedAngle + 4 * Math.PI) % (2 * Math.PI);
      const currentSlice = Math.floor(pointerAngle / sliceAngle);

      if (currentSlice !== this.lastTickSlice) {
        SoundEngine.tick();
        this.lastTickSlice = currentSlice;
      }

      this.drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.isSpinning = false;
        document.getElementById('btn-spin').disabled = false;
        SoundEngine.spinEnd();

        const winningIndex = currentSlice % list.length;
        this.currentDrawnStudent = list[winningIndex];

        setTimeout(() => {
          this.openTopicModal(this.currentDrawnStudent);
        }, 500);
      }
    };

    requestAnimationFrame(animateSpin);
  },

  openTopicModal(studentNum) {
    document.getElementById('drawn-student-num').textContent = studentNum;
    document.getElementById('topic-student-ref').textContent = studentNum;

    const topicGrid = document.getElementById('topic-grid');
    topicGrid.innerHTML = '';

    Object.keys(TOPIC_DEFINITIONS).forEach(catKey => {
      const cat = TOPIC_DEFINITIONS[catKey];
      const btn = document.createElement('button');
      btn.onclick = () => this.pickTopic(catKey);
      btn.className = `p-4 rounded-2xl bg-gradient-to-br ${cat.color} hover:opacity-90 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1 cursor-pointer`;
      btn.innerHTML = `
        <i class="fa-solid ${cat.icon} text-3xl"></i>
        <span class="text-xs sm:text-sm font-display">${cat.name}</span>
      `;
      topicGrid.appendChild(btn);
    });

    document.getElementById('modal-topic').classList.remove('hidden');
  },

  /* PERBAIKAN UTAMA: Pencarian Bebas Kapitalisasi + Proteksi Fallback */
  pickTopic(catKey) {
    document.getElementById('modal-topic').classList.add('hidden');

    const targetCat = String(catKey).toLowerCase();

    // 1. Ambil pool pertanyaan (Gunakan case-insensitive matching)
    let pool = [];
    if (targetCat === 'random') {
      pool = [...this.questionBank];
    } else {
      pool = this.questionBank.filter(q => q.category && q.category.toLowerCase() === targetCat);
    }

    // Fallback 1: Jika kategori tidak ditemukan/kosong, ambil dari seluruh questionBank
    if (pool.length === 0) {
      pool = [...this.questionBank];
    }

    // Fallback 2: Jika questionBank di storage rusak/kosong, muat ulang dari DEFAULT_QUESTIONS
    if (pool.length === 0) {
      this.questionBank = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
      pool = [...this.questionBank];
    }

    // 2. Filter soal yang belum pernah dipakai
    let unusedPool = pool.filter(q => !this.usedQuestionIds.includes(q.id));

    // Jika semua soal pada kategori tersebut sudah terpakai, reset riwayat untuk kategori ini
    if (unusedPool.length === 0) {
      const poolIds = pool.map(q => q.id);
      this.usedQuestionIds = this.usedQuestionIds.filter(id => !poolIds.includes(id));
      unusedPool = [...pool];
    }

    // 3. Ambil soal acak dari unusedPool
    const selectedQ = unusedPool[Math.floor(Math.random() * unusedPool.length)];

    // Proteksi utama: Jika karena alasan apapun selectedQ masih tidak ada, hentikan aman
    if (!selectedQ) {
      console.error("Gagal memuat pertanyaan.");
      return;
    }

    this.currentQuestion = selectedQ;
    if (selectedQ.id) {
      this.usedQuestionIds.push(selectedQ.id);
    }

    // Auto Eliminate
    if (this.autoEliminate && this.remainingStudents.includes(this.currentDrawnStudent)) {
      this.remainingStudents = this.remainingStudents.filter(s => s !== this.currentDrawnStudent);
      this.eliminatedStudents.push(this.currentDrawnStudent);
      this.updateUI();
      this.drawWheel();
    }

    // Panggil stage tampilan pertanyaan
    this.startQuestionStage(selectedQ);
  },

  scrambleWord(word) {
    if (!word) return '';
    const cleanWord = String(word).trim().toUpperCase();
    let chars = cleanWord.split('');
    if (chars.length <= 1) return cleanWord;

    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    if (chars.join('') === cleanWord) {
      return this.scrambleWord(word);
    }

    return chars.join(' - ');
  },

  startQuestionStage(q) {
    if (!q) return;

    const catKey = (q.category || '').toLowerCase();
    const catInfo = TOPIC_DEFINITIONS[catKey] || { name: q.category || 'General', icon: 'fa-star' };
    const fmtInfo = FORMAT_DEFINITIONS[q.format] || { badge: 'Challenge' };

    document.getElementById('stage-student-badge').textContent = `Student #${this.currentDrawnStudent || 1}`;
    document.getElementById('stage-topic-badge').innerHTML = `<i class="fa-solid ${catInfo.icon}"></i> ${catInfo.name}`;
    document.getElementById('stage-format-badge').textContent = fmtInfo.badge;

    let displayText = q.question;
    if (q.format === 'unscramble') {
      const scrambled = this.scrambleWord(q.answer || '');
      displayText = `Unscramble the word: ${scrambled}`;
    }

    document.getElementById('stage-question-text').textContent = `"${displayText}"`;
    
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('hint-text').textContent = q.hint || 'No hint available for this question.';
    document.getElementById('hint-btn-text').textContent = 'Show Hint';

    document.getElementById('answer-box').classList.add('hidden');
    document.getElementById('answer-text').textContent = q.answer || '';
    document.getElementById('answer-btn-text').textContent = 'Reveal Answer';

    // Buka Modal Pertanyaan
    document.getElementById('modal-question').classList.remove('hidden');

    this.startTimer();
  },

  startTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.timerDuration;

    const timerText = document.getElementById('timer-text');
    const progressCircle = document.getElementById('timer-progress-circle');
    const totalDash = 264;

    const updateCircle = () => {
      timerText.textContent = this.timeLeft;
      const offset = totalDash - (this.timeLeft / this.timerDuration) * totalDash;
      progressCircle.style.strokeDashoffset = offset;

      if (this.timeLeft <= 3) {
        progressCircle.setAttribute('class', 'text-rose-500 transition-all duration-1000 ease-linear');
        SoundEngine.timerBeep(true);
      } else if (this.timeLeft <= 7) {
        progressCircle.setAttribute('class', 'text-amber-400 transition-all duration-1000 ease-linear');
        SoundEngine.timerBeep(false);
      } else {
        progressCircle.setAttribute('class', 'text-emerald-400 transition-all duration-1000 ease-linear');
      }
    };

    updateCircle();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft >= 0) {
        updateCircle();
      } else {
        clearInterval(this.timerInterval);
        SoundEngine.buzzer();
      }
    }, 1000);
  },

  toggleHint() {
    const hintBox = document.getElementById('hint-box');
    const isHidden = hintBox.classList.contains('hidden');
    if (isHidden) {
      hintBox.classList.remove('hidden');
      document.getElementById('hint-btn-text').textContent = 'Hide Hint';
    } else {
      hintBox.classList.add('hidden');
      document.getElementById('hint-btn-text').textContent = 'Show Hint';
    }
  },

  triggerLifeline() {
    SoundEngine.timerBeep(true);
    const qText = document.getElementById('stage-question-text');
    const originalText = qText.textContent;
    qText.innerHTML = `<span class="text-cyan-400">🤝 LIFELINE USED!</span><br>Student #${this.currentDrawnStudent} may choose 1 classmate to help answer!`;
    setTimeout(() => {
      qText.textContent = originalText;
    }, 3000);
  },

  toggleAnswer() {
    const answerBox = document.getElementById('answer-box');
    const isHidden = answerBox.classList.contains('hidden');
    if (isHidden) {
      answerBox.classList.remove('hidden');
      document.getElementById('answer-btn-text').textContent = 'Hide Answer';
    } else {
      answerBox.classList.add('hidden');
      document.getElementById('answer-btn-text').textContent = 'Reveal Answer';
    }
  },

  handleAnswerResult(result) {
    clearInterval(this.timerInterval);

    if (result === true) {
      SoundEngine.fanfare();
      ConfettiEngine.burst();
      this.addScore(10);
      this.logHistory(`Student #${this.currentDrawnStudent}`, 'Correct (+10 pts)', 'emerald');
      this.closeQuestionModal();
    } else if (result === 'steal') {
      SoundEngine.timerBeep(true);
      const qText = document.getElementById('stage-question-text');
      qText.innerHTML = `<span class="text-amber-400">⚡ STEAL TURN OPEN!</span><br>Anyone in the class can raise hand to steal +5 points!`;
      this.addScore(5);
      this.logHistory(`Student #${this.currentDrawnStudent}`, 'Steal Opportunity (+5 pts)', 'amber');
    } else {
      SoundEngine.buzzer();
      this.logHistory(`Student #${this.currentDrawnStudent}`, 'Incorrect (0 pts)', 'rose');
      this.closeQuestionModal();
    }
  },

  closeQuestionModal() {
    clearInterval(this.timerInterval);
    document.getElementById('modal-question').classList.add('hidden');
  },

  addScore(pts) {
    if (this.mode === 'teams') {
      const currentTeamIndex = (this.currentDrawnStudent - 1) % this.teams.length;
      this.teams[currentTeamIndex].score += pts;
    } else {
      const currentScore = this.individualScores[this.currentDrawnStudent] || 0;
      this.individualScores[this.currentDrawnStudent] = currentScore + pts;
    }
    this.saveStorage();
    this.renderScoreboard();
  },

  adjustScore(type, target, delta) {
    if (type === 'team') {
      this.teams[target].score = Math.max(0, this.teams[target].score + delta);
    }
    this.saveStorage();
    this.renderScoreboard();
  },

  logHistory(subject, outcome, color) {
    const logList = document.getElementById('history-list');
    if (logList.querySelector('p')) logList.innerHTML = '';

    const item = document.createElement('div');
    item.className = `p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs`;
    item.innerHTML = `
      <span class="font-bold text-slate-200">${subject}</span>
      <span class="text-${color}-400 font-semibold">${outcome}</span>
    `;
    logList.prepend(item);
  },

  openSetupModal() {
    document.getElementById('setup-student-count').value = this.studentCount;
    document.getElementById('setup-timer').value = this.timerDuration;
    document.getElementById('setup-auto-eliminate').checked = this.autoEliminate;
    document.getElementById('setup-mode').value = this.mode;
    
    this.toggleTeamInputs(this.mode);

    document.getElementById('team-name-0').value = this.teams[0].name;
    document.getElementById('team-name-1').value = this.teams[1].name;
    document.getElementById('team-name-2').value = this.teams[2].name;
    document.getElementById('team-name-3').value = this.teams[3].name;

    document.getElementById('modal-setup').classList.remove('hidden');
  },

  toggleTeamInputs(mode) {
    const container = document.getElementById('team-names-container');
    if (mode === 'teams') {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  },

  saveSetup(e) {
    e.preventDefault();
    const newCount = parseInt(document.getElementById('setup-student-count').value, 10);
    this.timerDuration = parseInt(document.getElementById('setup-timer').value, 10);
    this.autoEliminate = document.getElementById('setup-auto-eliminate').checked;
    this.mode = document.getElementById('setup-mode').value;

    if (this.mode === 'teams') {
      this.teams[0].name = document.getElementById('team-name-0').value || 'Team Red';
      this.teams[1].name = document.getElementById('team-name-1').value || 'Team Blue';
      this.teams[2].name = document.getElementById('team-name-2').value || 'Team Yellow';
      this.teams[3].name = document.getElementById('team-name-3').value || 'Team Green';
    }

    if (newCount !== this.studentCount) {
      this.studentCount = newCount;
      this.resetRemainingStudents();
    } else {
      this.updateUI();
      this.drawWheel();
    }

    this.saveStorage();
    this.closeModal('modal-setup');
  },

  openEditorModal() {
    this.renderEditorList();
    document.getElementById('modal-editor').classList.remove('hidden');
  },

  renderEditorList() {
    const filterCat = document.getElementById('editor-category-filter').value;
    const list = document.getElementById('editor-questions-list');
    list.innerHTML = '';

    const filtered = filterCat === 'all' 
      ? this.questionBank 
      : this.questionBank.filter(q => q.category && q.category.toLowerCase() === filterCat.toLowerCase());

    document.getElementById('editor-total-count').textContent = `Total: ${filtered.length} questions`;

    filtered.forEach((q) => {
      const item = document.createElement('div');
      item.className = 'p-3 bg-slate-900/60 border border-slate-700/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs';
      item.innerHTML = `
        <div class="flex-1 min-w-[200px]">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold uppercase">${q.category}</span>
            <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-semibold">${q.format}</span>
          </div>
          <div class="font-bold text-slate-100 text-sm">"${q.question}"</div>
          <div class="text-slate-400 mt-0.5"><strong class="text-emerald-400">Ans:</strong> ${q.answer}</div>
        </div>
        <button onclick="GameApp.deleteQuestion('${q.id}')" class="px-2.5 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 rounded-lg transition">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
      list.appendChild(item);
    });
  },

  addCustomQuestion(e) {
    e.preventDefault();
    const cat = document.getElementById('new-q-cat').value.toLowerCase();
    const format = document.getElementById('new-q-format').value;
    const text = document.getElementById('new-q-text').value;
    const ans = document.getElementById('new-q-ans').value;
    const hint = document.getElementById('new-q-hint').value;

    const newQ = {
      id: 'custom_' + Date.now(),
      category: cat,
      format: format,
      question: text,
      answer: ans,
      hint: hint || ''
    };

    this.questionBank.unshift(newQ);
    this.saveStorage();
    this.renderEditorList();
    
    document.getElementById('add-question-form').reset();
  },

  deleteQuestion(id) {
    this.questionBank = this.questionBank.filter(q => q.id !== id);
    this.saveStorage();
    this.renderEditorList();
  },

  exportQuestionBank() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.questionBank, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `english_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importQuestionBank(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          this.questionBank = imported;
          this.questionBank.forEach(q => {
            if (q.category) q.category = q.category.toLowerCase();
          });
          this.saveStorage();
          this.renderEditorList();
        }
      } catch(err) {}
    };
    reader.readAsText(file);
  },

  resetDefaultQuestions() {
    this.questionBank = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    this.saveStorage();
    this.renderEditorList();
  },

  openScoreboardModal() {
    const list = document.getElementById('modal-score-items');
    list.innerHTML = '';

    if (this.mode === 'teams') {
      this.teams.forEach((t, idx) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/80';
        div.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="w-4 h-4 rounded-full" style="background-color: ${t.color}"></span>
            <span class="font-bold text-slate-200">${t.name}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="GameApp.adjustScore('team', ${idx}, -5)" class="w-7 h-7 bg-slate-800 rounded text-slate-300 font-bold">-</button>
            <span class="font-display font-bold text-xl text-amber-400 w-12 text-center">${t.score}</span>
            <button onclick="GameApp.adjustScore('team', ${idx}, 5)" class="w-7 h-7 bg-slate-800 rounded text-slate-300 font-bold">+</button>
          </div>
        `;
        list.appendChild(div);
      });
    } else {
      for (let i = 1; i <= this.studentCount; i++) {
        const score = this.individualScores[i] || 0;
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/80 text-xs';
        div.innerHTML = `
          <span class="font-bold text-slate-200">Student #${i}</span>
          <span class="font-display font-bold text-base text-amber-400">${score} pts</span>
        `;
        list.appendChild(div);
      }
    }

    document.getElementById('modal-scoreboard').classList.remove('hidden');
  },

  resetScores() {
    this.teams.forEach(t => t.score = 0);
    this.individualScores = {};
    this.saveStorage();
    this.renderScoreboard();
    this.openScoreboardModal();
  },

  closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  },

  toggleSound() {
    SoundEngine.muted = !SoundEngine.muted;
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (SoundEngine.muted) {
      icon.className = 'fa-solid fa-volume-xmark text-rose-400';
      text.textContent = 'Muted';
    } else {
      icon.className = 'fa-solid fa-volume-high text-amber-400';
      text.textContent = 'Sound ON';
    }
  },

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const icon = document.getElementById('theme-icon');
    if (document.documentElement.classList.contains('dark')) {
      icon.className = 'fa-solid fa-moon text-indigo-400';
    } else {
      icon.className = 'fa-solid fa-sun text-amber-400';
    }
  },

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!document.getElementById('modal-question').classList.contains('hidden')) return;
        this.spinWheel();
      }

      if (!document.getElementById('modal-question').classList.contains('hidden')) {
        if (e.key === '1' || e.key.toLowerCase() === 'c') {
          this.handleAnswerResult(true);
        } else if (e.key === '2' || e.key.toLowerCase() === 's') {
          this.handleAnswerResult('steal');
        } else if (e.key === '3' || e.key.toLowerCase() === 'w') {
          this.handleAnswerResult(false);
        } else if (e.key.toLowerCase() === 'h') {
          this.toggleHint();
        } else if (e.key.toLowerCase() === 'a') {
          this.toggleAnswer();
        }
      }
    });
  }
};

window.onload = function() {
  GameApp.init();
};
