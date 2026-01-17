const logBox = document.getElementById("console-log");
const input = document.getElementById("console-input");
const binary = document.getElementById("hidden-binary");
const clearBtn = document.getElementById("clear-history-btn");
const index = document.getElementById("index");

const secrets = { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false, s7: false, s8: false, s9: false, s10: false, s11: false, s12: false, s13: false, s14: false, s15: false, s16: false, s17: false, s18: false, s19: false, s20: false, s21: false, s22: false, s23: false, s24: false, s25: false, s26: false, s27: false, s28: false, s29: false, s30: false };

const SAVE_KEY = "console-secrets-save";

function saveGame() {
  const data = {
    secrets,
    sortMode
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  
  try {
    const data = JSON.parse(raw);
    if (data.secrets) {
      Object.keys(secrets).forEach(k => {
        secrets[k] = !!data.secrets[k];
      });
    }
    if (data.sortMode) sortMode = data.sortMode;
  } catch (e) {
    console.warn("Save corrupted 💀");
  }
}

const clearHistory = [];
const difficultyColors = {
  Easy: "#63EF00",
  Medium: "#FFEB3B",
  Hard: "#FF1744",
  Intense: "lightblue",
  Insane: "blue",
  Extreme: "#0080ff",
  Terrifying: "cyan",
};
const difficultyOrder = ["Easy", "Medium", "Hard", "Intense", "Insane", "Extreme", "Terrifying"];

const secretInfo = {
  s1: { name: "Relentless", level: "Insane", hint: "The word is not just a word." },
  s2: { name: "Mirror call", level: "Hard", hint: "Say my name." },
  s3: { name: "Abyss", level: "Hard", hint: "Background speaks." },
  s4: { name: "l33t5p34k", level: "Terrifying", hint: "Might be found, yet unseen." },
  s5: { name: "Shortcut", level: "Easy", hint: "it's very convenient." },
  s6: { name: "Desperate call", level: "Easy", hint: "Call for help." },
  s7: { name: "The undefined", level: "Easy", hint: "Something's right." },
  s8: { name: "Echo", level: "Medium", hint: "Just repeat." },
  s9: { name: "Difficulties", level: "Insane", hint: "Collect the first." },
  s10: { name: "Presence", level: "Medium", hint: "AFK." },
  s11: { name: "Expression", level: "Hard", hint: "Mood." },
  s12: { name: "Clockwatcher", level: "Hard", hint: "O' clock." },
  s13: { name: "Scroll Obsession", level: "Intense", hint: "Just keep scrolling." },
  s14: {
    name: "Banana",
    level: "Intense",
    hint: "Title. <img src='https://i.natgeofe.com/n/b8740e26-5d8e-45e7-b113-a23795a28698/01-julius-ceasar-51243549.jpg' style='width:30px;height:auto;vertical-align:middle;'>",
  },
  s15: { name: "No escape", level: "Easy", hint: "Stop trying to escape." },
  s16: {
    name: "Clown",
    level: "Insane",
    hint: `<span id="s16-hint" style="user-select:text;cursor:pointer;text-decoration:underline;">https://social.mtdv.me/37edEkRaFv</span>`
  },
  s17: { name: "The truth", level: "Easy", hint: "Is a hint necessary?" },
  s18: { name: "Free", level: "Hard", hint: "Uh... it's free." },
  s19: { name: "Q.E.D", level: "Medium", hint: "End of math proof." },
  s20: { name: "Smoll country", level: "Easy", hint: "Smallest country." },
  s21: { name: "Baconian", level: "Hard", hint: '<span style = "user-select: text">BABAA ABAAA ABBAA AABBA.</span>' },
  s22: { name: "Mr president", level: "Medium", hint: '<span style = "user-select: text">01100010 00110100 01110010 01110010 00110100 01100011 01101011 00100000 00110000 01100010 00110100 01101101 00110100</span>.' },
  s23: { name: "Almighty", level: "Medium", hint: "Instruction." },
  s24: { name: "Pi", level: "Easy", hint: "3.141592" },
  s25: { name: "Eclipse", level: "Extreme", hint: '<span style= "user-select: text">317427352074303020627231676874</span>.' },
  s26: { name: "Reset data", level: "Hard", hint: "Warning."}
};

/* ===== SORT LOGIC ===== */
let sortMode = "found";
document.getElementById("sort-btn").onclick = () => {
  sortMode = sortMode === "found" ? "difficulty" : "found";
  saveGame(); // 👈
  document.getElementById("sort-btn").textContent =
    "Sort: " + (sortMode === "found" ? "Found" : "Difficulty");
  renderSecrets();
};

/* ===== LOGGING (GIỮ NGUYÊN) ===== */
function logUser(t) {
  const d = document.createElement("div");
  d.className = "log";
  d.textContent = "> " + t.toLowerCase();
  logBox.appendChild(d);
  logBox.scrollTop = logBox.scrollHeight;
}

function logSystem(t) {
  const d = document.createElement("div");
  d.className = "log system";
  d.textContent = t;
  logBox.appendChild(d);
  logBox.scrollTop = logBox.scrollHeight;
}

function logSystemCopyable(t) {
  const d = document.createElement("div");
  d.className = "log system copyable";
  d.innerHTML = `<span class="copy-text" title="Click to copy">${t}</span>`;
  
  d.querySelector(".copy-text").onclick = () => {
    navigator.clipboard.writeText(t).then(() => {
      d.querySelector(".copy-text").textContent = "Copied.";
      setTimeout(() => {
        d.querySelector(".copy-text").textContent = t;
      }, 1000);
    });
  };
  
  logBox.appendChild(d);
  logBox.scrollTop = logBox.scrollHeight;
}

function logCore(t) {
  const d = document.createElement("div");
  d.className = "log core";
  d.textContent = ":: CORE :: " + t;
  logBox.appendChild(d);
  logBox.scrollTop = logBox.scrollHeight;
}

function logCongrats(t, id) {
  const d = document.createElement("div");
  d.className = "log congrats";
  const c = difficultyColors[secretInfo[id].level];
  d.textContent = t;
  d.style.color = c;
  d.style.textShadow = `0 0 12px ${c}`;
  logBox.appendChild(d);
  logBox.scrollTop = logBox.scrollHeight;
}

/* ===== RENDER SECRETS (CÓ SORT) ===== */
function renderSecrets() {
  index.innerHTML = "";
  let entries = Object.entries(secretInfo);
  
  if (sortMode === "found") {
    entries.sort((a, b) => (secrets[b[0]] === true) - (secrets[a[0]] === true));
  } else {
    entries.sort((a, b) =>
      difficultyOrder.indexOf(a[1].level) -
      difficultyOrder.indexOf(b[1].level)
    );
  }
  
  for (const [id, info] of entries) {
    const div = document.createElement("div");
    div.className = "secret-row";
    
    const circle = document.createElement("span");
    circle.className = "secret-circle";
    circle.style.background = difficultyColors[info.level];
    div.appendChild(circle);
    
    const span = document.createElement("span");
    
    if (secrets[id]) {
      span.textContent = `Secret ${id.slice(1)}: ${info.name} ✔`;
      span.style.color = difficultyColors[info.level];
      span.style.textShadow = `0 0 12px ${difficultyColors[info.level]}`;
    } else {
      span.textContent = `Secret ${id.slice(1)}: ???`;
    }
    div.appendChild(span);
    
    const hintDiv = document.createElement("div");
    hintDiv.className = "hint";
    hintDiv.innerHTML = info.hint;
    
    const glowColor = difficultyColors[info.level];
    hintDiv.style.textShadow = `0 0 6px ${glowColor}`;
    
    const container = document.createElement("div");
    container.appendChild(div);
    container.appendChild(hintDiv);
    container.id = id;
    container.className = secrets[id] ? "unlocked" : "locked";
    index.appendChild(container);
  }
}

loadGame();
renderSecrets();

/* ===== DIFFICULTY CHART ===== */
let chartAsc = true;
const chart = document.getElementById("difficulty-chart");
const chartBtn = document.getElementById("toggle-chart");

function renderChart() {
  chart.innerHTML = "";
  const list = [...difficultyOrder];
  if (!chartAsc) list.reverse();
  list.forEach(lv => {
    const row = document.createElement("div");
    row.className = "diff-row";
    const dot = document.createElement("span");
    dot.className = "diff-dot";
    dot.style.background = difficultyColors[lv];
    const text = document.createElement("span");
    text.textContent = lv;
    row.append(dot, text);
    chart.appendChild(row);
  });
}
chartBtn.onclick = () => {
  chartAsc = !chartAsc;
  chartBtn.textContent = "Chart: " + (chartAsc ? "ASC" : "DESC");
  renderChart();
};
renderChart();

/* ===== PHẦN SECRET LOGIC GỐC (GIỮ NGUYÊN) ===== */
clearBtn.onclick = () => {
  if (!logBox.innerHTML) {
    logCore("NO CLEAR EVENTS FOUND");
    return;
  }
  logBox.innerHTML = "";
};

function unlockSecret(id) {
  if (secrets[id]) return;
  secrets[id] = true;
  saveGame(); // 👈 thêm dòng này
  renderSecrets();
  logCongrats(
    `Secret ${id.slice(1)} unlocked: ${secretInfo[id].name} (${secretInfo[id].level})`,
    id
  );
}

const secretWord = document.getElementById("secret-word");
let clickCount = 0,
  clickTimer = null;
secretWord.onclick = () => {
  if (secrets.s1) return;
  clickCount++;
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    clickCount = 0;
    secretWord.classList.remove("pulsing");
  }, 2000);
  if (clickCount === 10) secretWord.classList.add("pulsing");
  if (clickCount === 200) unlockSecret("s1");
};

// SECRET 2 (Hard)
let askedForReal = false;
// SECRET 8 (Medium)
let lastCmd = null; // lưu command trước
let repeatCount = 0; // số lần lặp liên tiếp
// SECRET 10 (Medium)
let idleTimer = null;
const IDLE_TIME = 30000; // 30s
// SECRET 16 (Insane)
let waitingForAudio = false; // trạng thái chờ user nhấn Enter để play audio
let pressEnterTimeout = null; // lưu timeout ID
let audioTimeouts = []; // lưu tất cả setTimeout liên quan đến audio
// SECRET 25 (Extreme)
let eclipseStage = 0;
// 0 = chưa biết gì
// 1 = đã thấy brainfuck
// 2 = đã thấy pastebin

resetIdleTimer();

input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const raw = input.value.trim(),
    cmd = raw.toLowerCase();
  input.value = "";
  logUser(raw);
  
  // RESET DATA
  if (cmd === "r3s3t d4t4") {
    localStorage.removeItem(SAVE_KEY);
    logCore("SAVE DATA OBLITERATED.");
    let p = document.createElement("p");
    let instruction = document.getElementById("instruction");
    instruction.appendChild(p);
    p.innerHTML = "But 2e5e7 0a7a is."
    setTimeout(() => {
      location.reload()
    }, 1500);
    return;
  }
  
  // SECRET 2 (Hard)
  if (cmd === "fake console" && !secrets.s2) {
    askedForReal = true;
    console.log("The real console is listening.");
    console.log("Say hello.");
    logSystem("Where is the real one?")
    return;
  }
  if (askedForReal && ["hi", "hello", "hey", "sup"].includes(cmd) && !secrets.s2) {
    unlockSecret("s2");
  }
  
  // SECRET 3 (Hard)
  if (cmd === "awake" && !secrets.s3) {
    unlockSecret("s3");
    binary.textContent = "00110100 01110111 00110100 01101011 00110011";
  }
  
  // SECRET 4 (Insane)
  if (secrets.s3 && cmd === "4w4k3" && !secrets.s4) {
    logSystem("1337 wasn't just a number.")
    logSystem("What was it?");
  }
  
  if (secrets.s3 && cmd === "leetspeak" && !secrets.s4) {
    logSystem("Good old days...");
    unlockSecret("s4");
  }
  
  // SECRET 5 (Easy)
  if (cmd === "clear" && !secrets.s5) {
    unlockSecret("s5");
    logCore("You can use 'clear' now.");
    return;
  }
  if (cmd === "clear" && secrets.s5) {
    if (!logBox.innerHTML) {
      logCore("NO CLEAR EVENTS FOUND");
      return;
    }
    logBox.innerHTML = "";
    logCore("LOG BUFFER PURGED");
    return;
  }
  
  // SECRET 6 (Easy)
  if (cmd === "help" && !secrets.s6) {
    logSystem("There's no help.")
    unlockSecret("s6");
  }
  
  // SECRET 7 (Easy)
  if (cmd === "something" && !secrets.s7) {
    unlockSecret("s7");
  }
  
  // SECRET 8 (Medium)
  if (cmd === lastCmd) {
    repeatCount++; // cùng command liên tiếp → tăng counter
  } else {
    lastCmd = cmd; // command khác → reset counter
    repeatCount = 1;
  }
  if (repeatCount === 5 && !secrets.s8) {
    logSystem("Stop spamming.")
    unlockSecret("s8"); // unlock Echo khi lặp đúng 5 lần
  }
  
  // SECRET 9 (Intense) 
  if (cmd === "emhiiet" && !secrets.s9) {
    logSystem("Amazing letters.")
    unlockSecret("s9");
  }
  
  // SECRET 11 (Hard) 
  if (
    !secrets.s11 &&
    /^(:\)|:\(|:d|:p|;\)|<3|¯\\_\(ツ\)_\/¯)$/i.test(raw.trim())
  ) {
    logSystem("How come?");
    unlockSecret("s11");
  }
  
  // SECRET 12 (Hard)
  let now = new Date().getUTCMinutes();
  if (!secrets.s12 && now === 0) {
    logSystem("VN DE NZ PK.")
    logSystem("UTC offset → A1Z26.");
  }
  
  // SECRET 14 (Intense)
  if (cmd === "banana" && !secrets.s14) {
    logSystem("Old trick in the book.")
    unlockSecret("s14");
  }
  
  // SECRET 15 (Easy)
  if ((cmd === "exit" || cmd === "quit") && !secrets.s15) {
    logSystem("You're trapped.")
    unlockSecret("s15");
  }
  
  // SECRET 16 (Insane)
  // nếu đang chờ press enter nhưng gõ cmd khác
  if (pressEnterTimeout && cmd !== "skibidi toilet" && !waitingForAudio) {
    clearTimeout(pressEnterTimeout);
    pressEnterTimeout = null;
    logSystem("Cancelled.");
  }
  // Obtain Logic
  if (cmd === "skibidi toilet" && !secrets.s16) {
    logSystem("lol.");
    
    pressEnterTimeout = setTimeout(() => {
      logSystem("Press Enter.");
      waitingForAudio = true;
      pressEnterTimeout = null;
    }, 3000);
    
    return;
  }
  
  // play audio khi user nhấn Enter sau "Press Enter"
  if (waitingForAudio && !secrets.s16) {
    waitingForAudio = false;
    const morsecode = new Audio("morsecode.wav");
    morsecode.play().catch(() => {
      logSystem("Audio blocked. Try pressing Enter again.");
      waitingForAudio = true; // retry
    });
    
    morsecode.addEventListener("ended", () => {
      logSystem("Did you catch it?");
      setTimeout(() => logSystem("If so, you might need help from secret 14."), 2000);
      setTimeout(() => logSystem("Or just listen again."), 4000);
    });
    
    return;
  }
  
  // unlock secret 16
  if (cmd === "cl0wn" && !secrets.s16) {
    unlockSecret("s16");
  }
  
  // SECRET 17 (Easy)
  if (cmd === "b3st g4m3" && !secrets.s17) {
    logSystem("clearly.")
    unlockSecret("s17");
  }
  
  // SECRET 18 (Hard)
  if (cmd === "fr33" && !secrets.s18) {
    unlockSecret("s18");
  }
  
  // SECRET 19 (Medium)
  if (/^q(\.?)e(\.?)d\.?$/i.test(cmd.trim()) && !secrets.s19) {
    unlockSecret("s19");
  }
  
  // SECRET 20 (Easy)
  if (cmd === "vatican city" && !secrets.s20) {
    unlockSecret("s20");
  }
  
  // SECRET 21 (Hard)
  if (cmd === "wing" && !secrets.s21) {
    unlockSecret("s21")
  }
  
  // SECRET 22 (Medium) 
  if (cmd === "b4rr4ck 0b4m4" && !secrets.s22) {
    unlockSecret("s22");
  }
  
  // SECRET 23 (Medium)
  if (cmd === "all might" && !secrets.s23) {
    unlockSecret("s23");
  }
  
  // SECRET 24 (Medium)
  if (cmd === "pi" && !secrets.s24) {
    logSystem("symbol.")
  }
  
  if (cmd === "π" && !secrets.s24) {
    unlockSecret("s24");
  }
  
  // SECRET 25 (Extreme)
  if (cmd === "too bright" && !secrets.s25) {
    logSystem("Wrong one.")
  }
  if (cmd === "t00 br1ght" && !secrets.s25) {
    eclipseStage = 1;
    logSystemCopyable("++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>>+++++++++++++++.++.-------.")
  }
  if (cmd === "sun" && !secrets.s25) {
    if (eclipseStage < 1) {
      return;
    }
    eclipseStage = 2;
    logSystem("P?st?b?n. (ueoai)");
    logSystemCopyable("seKsrcdN");
    logSystem("Password: secret25.");
  }
  
  if (cmd === "moon" && !secrets.s25) {
    if (eclipseStage < 2) {
      return;
    }
    unlockSecret("s25");
    logSystem("Elite knowledge.");
  }
  
  // SECRET 26 (Hard)
  if (cmd === "2e5e7 0a7a" && !secrets.s26) {
    logSystem("postimg - 7JXhmTDY")
  }
  
  if (cmd === "innovation" && !secrets.s26) {
    unlockSecret("s26")
  } 
});


// SECRET 10 (Medium)
function resetIdleTimer() {
  if (secrets.s10) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    unlockSecret("s10");
    logSystem("Told you.");
  }, IDLE_TIME);
}

[
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "touchmove",
  "click"
].forEach(ev => {
  document.addEventListener(ev, resetIdleTimer, { passive: true });
});

// SECRET 13 (Intense)
let scrollCount = 0;
let scrollTimer = null;

// Scroll trên logBox và index cùng tính
const scrollTargets = [logBox, index];
scrollTargets.forEach(target => {
  target.addEventListener("scroll", () => {
    scrollCount++;
    
    clearTimeout(scrollTimer);
    // reset nếu player dừng scroll > 3s
    scrollTimer = setTimeout(() => {
      scrollCount = 0;
    }, 3000);
    
    if (scrollCount >= 5000 && !secrets.s13) { // scroll 5000 lần trong 3s
      logSystem("Stop...");
      unlockSecret("s13");
    }
  });
});

// SECRET 16 (Insane)
document.addEventListener("click", (e) => {
  if (e.target.id === "s16-hint") {
    // copy text vào clipboard
    navigator.clipboard.writeText(e.target.textContent)
      .then(() => {
        
      });
    
    // thay hint sau 1s hoặc khi player "quay lại"
    setTimeout(() => {
      e.target.textContent = "What did you see?";
      e.target.style.cursor = "default";
      e.target.style.userSelect = "none";
      e.target.style.color = "#999";
      e.target.style.textDecoration = "none";
    }, 1000);
  }
});
