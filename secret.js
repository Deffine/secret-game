const logBox = document.getElementById("console-log");
const input = document.getElementById("console-input");
const binary = document.getElementById("hidden-binary");
const clearBtn = document.getElementById("clear-history-btn");
const index = document.getElementById("index");

const secrets = { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false, s7: false, s8: false, s9: false, s10: false, s11: false, s12: false, s13: false, s14: false, s15: false };
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
  s1: { name: "Relentless", level: "Intense", hint: "Secrets don't want to be seen. They want obsession." },
  s2: { name: "Mirror call", level: "Hard", hint: "Say my name." },
  s3: { name: "Abyss", level: "Hard", hint: "Background speaks." },
  s4: { name: "l33t5p34k", level: "Extreme", hint: "Might be found, yet unseen." },
  s5: { name: "Shortcut", level: "Easy", hint: "it's very convenient." },
  s6: { name: "Desperate call", level: "Easy", hint: "Call for help." },
  s7: { name: "The undefined", level: "Easy", hint: "Something's right." },
  s8: { name: "Echo", level: "Medium", hint: "Just repeat." },
  s9: { name: "Difficulties", level: "Intense", hint: "Collect the first." },
  s10: { name: "Presence", level: "Medium", hint: "Don't move." },
  s11: { name: "Emotes", level: "Hard", hint: "Time to move." },
  s12: { name: "Clockwatcher", level: "Hard", hint: "O' clock." },
  s13: { name: "Scroll Obsession", level: "Intense", hint: "Just keep scrolling." },
  s14: {
    name: "Banana",
    level: "Intense",
    hint: "Title. <img src='caesar.png' style='width:30px;height:auto;vertical-align:middle;'>"
  }
};

/* ===== SORT LOGIC ===== */
let sortMode = "found";
document.getElementById("sort-btn").onclick = () => {
  sortMode = sortMode === "found" ? "difficulty" : "found";
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
// SECRET 10 ()
let presenceTimer = null; // Presence secret

input.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const raw = input.value.trim(),
    cmd = raw.toLowerCase();
  input.value = "";
  logUser(raw);
  
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
  if (secrets.s3 && cmd === "leetspeak" && !secrets.s4) {
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
  // check /e {something}
  if (!secrets.s11 && cmd.startsWith("/e ")) {
    const emote = cmd.slice(3).trim(); // lấy chữ sau /e
    if (emote) { // có nhập gì đó
      logSystem("Emote acknowledged.");
      unlockSecret("s11");
    }
  }
  
  // SECRET 12 (Intense)
  let now = new Date();
  let minutes = now.getMinutes();
  if (!secrets.s12 && minutes === 0) {
    logSystem("Right on time.")
    unlockSecret("s12");
  }
  
  // SECRET 14 (Intense)
  if (cmd === "banana" && !secrets.s14) {
    logSystem("Old trick in the book.")
    unlockSecret("s14");
  }
  
  // SECRET 15 (Insane)
  
});


// SECRET 10 (Medium)
input.addEventListener("focus", () => {
  if (presenceTimer || secrets.s10) return; // đã unlock hoặc đang chạy timer
  presenceTimer = setTimeout(() => {
    unlockSecret("s10"); // Presence unlock sau 60s
    logSystem("Told you.")
  }, 60000); // 60000ms = 60s
});

["input", "keydown", "blur"].forEach(ev => {
  input.addEventListener(ev, () => {
    clearTimeout(presenceTimer);
    presenceTimer = null;
  });
});

// SECRET 13: Scroll Obsession (Intense)
let scrollCount = 0;
let scrollTimer = null;
const scrollTarget = logBox; // scroll trên logBox

scrollTarget.addEventListener("scroll", () => {
  scrollCount++;
  
  clearTimeout(scrollTimer);
  // reset nếu player dừng scroll > 3s
  scrollTimer = setTimeout(() => {
    scrollCount = 0;
  }, 3000);
  
  if (scrollCount >= 5000 && !secrets.s13) { // scroll 5000 lần trong khoảng 3s ngắn
    logSystem("Stop...")
    unlockSecret("s13");
  }
});
