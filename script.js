var selectedIcon = undefined, biggestIndex = 1, topBar = document.querySelector("#top");

function selectIcon(el) { el.classList.add("selected"); selectedIcon = el; } 
function deselectIcon(el) { if (el) { el.classList.remove("selected"); selectedIcon = undefined; } }

function handleIconTap(el) {
  if (selectedIcon) deselectIcon(selectedIcon);
  selectIcon(el);
}

function handleIconDoubleTap(id) {
  if (selectedIcon) deselectIcon(selectedIcon);
  if (document.querySelector(id)) openWindow(document.querySelector(id));
}

// --- WINDOW LOGIC & TASKBAR SYSTEM ---
function updateTaskbar() {
  const taskbar = document.querySelector("#taskbar");
  if (!taskbar) return;
  taskbar.innerHTML = ""; 

  const windows = document.querySelectorAll(".window");
  
  windows.forEach(win => {
    if (win.style.display === "block" || win.hasAttribute("data-open")) {
      const btn = document.createElement("button");
      btn.classList.add("taskbar-item");
      
      const headerText = win.querySelector(".window-header span")?.innerText || "App";
      btn.innerText = headerText.replace(/☰|:::|:/g, "").trim();
      
      if (win.style.zIndex == biggestIndex && win.style.display === "block") {
        btn.classList.add("active");
      }
      
      btn.addEventListener("click", () => {
        if (win.style.display === "block" && win.style.zIndex == biggestIndex) {
          win.style.display = "none"; 
        } else {
          win.style.display = "block"; 
          handleWindowTap(win);
        }
        updateTaskbar();
      });
      
      taskbar.appendChild(btn);
    }
  });
}

function openWindow(el) { 
  el.style.display = "block"; 
  el.setAttribute("data-open", "true"); 
  biggestIndex++; 
  el.style.zIndex = biggestIndex; 
  topBar.style.zIndex = biggestIndex + 1; 
  updateTaskbar();
}

function closeWindow(el) { 
  el.style.display = "none"; 
  el.removeAttribute("data-open"); 
  updateTaskbar();
}

function handleWindowTap(el) { 
  biggestIndex++; 
  el.style.zIndex = biggestIndex; 
  topBar.style.zIndex = biggestIndex + 1; 
  deselectIcon(selectedIcon); 
  updateTaskbar();
}

function addWindowTapHandling(el) { el.addEventListener("mousedown", () => handleWindowTap(el)); }

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var header = document.getElementById(elmnt.id + "header") || elmnt;
  header.onmousedown = (e) => {
    e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
    document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
    document.onmousemove = (e) => {
      e = e || window.event; e.preventDefault();
      pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    };
  };
}

function initializeWindow(windowId, closeButtonId) {
  var win = document.querySelector("#" + windowId), closeBtn = document.querySelector("#" + closeButtonId);
  if (win) { addWindowTapHandling(win); dragElement(win); }
  if (closeBtn && win) closeBtn.addEventListener("click", () => closeWindow(win));
}

initializeWindow("welcomescreen", "welcomeclose");
initializeWindow("micromemoscreen", "micromemoclose");
initializeWindow("hobbytrackscreen", "hobbytrackclose");
initializeWindow("paintscreen", "paintclose");
initializeWindow("petscreen", "petclose");
initializeWindow("calculatorscreen", "calculatorclose"); 

document.querySelector("#welcomeopen").addEventListener("click", () => openWindow(document.querySelector("#welcomescreen")));

// --- APP: MICROMEMO (DEVLOG) ---
var devlogs = JSON.parse(localStorage.getItem("retros_devlogs")) || [{ title: "RetrOS v0.1.5 Start", text: "Das System wurde erfolgreich initialisiert." }];

function renderDevlogSidebar() {
  var sb = document.querySelector("#memo-sidebar"); if (!sb) return; sb.innerHTML = "";
  for (let i = 0; i < devlogs.length; i++) {
    var div = document.createElement("div"); div.classList.add("memo-item"); div.style.position = "relative";
    div.innerHTML = '<p style="margin:0; font-weight:bold; font-size:12px; color:#50fa7b; padding-right:20px;">' + devlogs[i].title + '</p><span onclick="deleteDevlog(' + i + ', event)" style="position:absolute; right:8px; top:8px; color:#ff5555; font-size:11px; cursor:pointer;">[X]</span>';
    div.addEventListener("click", () => { document.querySelector("#devlog-title").value = devlogs[i].title; document.querySelector("#devlog-text").value = devlogs[i].text; });
    sb.appendChild(div);
  }
}

function saveDevlog() {
  var t = document.querySelector("#devlog-title").value.trim(), txt = document.querySelector("#devlog-text").value.trim();
  if (!t || !txt) return;
  var idx = devlogs.findIndex(d => d.title === t);
  if (idx !== -1) devlogs[idx].text = txt; else devlogs.push({ title: t, text: txt });
  localStorage.setItem("retros_devlogs", JSON.stringify(devlogs)); renderDevlogSidebar();
}

function deleteDevlog(i, e) { e.stopPropagation(); devlogs.splice(i, 1); localStorage.setItem("retros_devlogs", JSON.stringify(devlogs)); clearFields(); renderDevlogSidebar(); }
function clearFields() { document.querySelector("#devlog-title").value = ""; document.querySelector("#devlog-text").value = ""; }

function exportDevlog() {
  var title = document.querySelector("#devlog-title").value.trim();
  var text = document.querySelector("#devlog-text").value.trim();
  if (!text) return;
  if (!title) title = "untitled_devlog";
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  var tempLink = document.createElement("a");
  tempLink.href = URL.createObjectURL(blob);
  tempLink.download = title.toLowerCase().replace(/\s+/g, "_") + ".txt";
  tempLink.click();
  URL.revokeObjectURL(tempLink.href);
}

renderDevlogSidebar();

// --- SYSTEM CLOCK ---
function updateClock() {
  var el = document.querySelector("#os-time"); if (!el) return;
  var d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  el.innerHTML = "<br>" + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}
setInterval(updateClock, 1000); updateClock();

// --- APP: PIXELPAINT ---
const canvas = document.getElementById("paintCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener("mousemove", draw);

  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("paint-color").value;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }
}
function clearCanvas() {
  const canvas = document.getElementById("paintCanvas");
  if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

// --- APP: RETROPET ---
let hunger = parseInt(localStorage.getItem("retros_pet_hunger")) || 100;

function updatePetUI() {
  const hungerEl = document.getElementById("pet-hunger");
  const avatarEl = document.getElementById("pet-avatar");
  const statusEl = document.getElementById("pet-status");
  if (!hungerEl) return;

  hungerEl.innerText = "Hunger: " + hunger + "%";
  if (hunger <= 0) {
    avatarEl.innerText = "👻";
    statusEl.innerText = "Status: Dead... RIP";
    statusEl.style.color = "#ff5555";
  } else if (hunger < 40) {
    avatarEl.innerText = "😾";
    statusEl.innerText = "Status: Starving!";
    statusEl.style.color = "#ffb86c";
  } else {
    avatarEl.innerText = "🐱";
    statusEl.innerText = "Status: Happy";
    statusEl.style.color = "#50fa7b";
  }
}

function feedPet() {
  if (hunger <= 0) { hunger = 100; }
  else { hunger = Math.min(100, hunger + 20); }
  localStorage.setItem("retros_pet_hunger", hunger);
  updatePetUI();
}

setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(0, hunger - 5);
    localStorage.setItem("retros_pet_hunger", hunger);
    updatePetUI();
  }
}, 8000);

updatePetUI();

// --- APP: CALC-95 ---
function pressCalc(value) {
  const display = document.getElementById("calc-display");
  if (display) {
    if (display.value === "Error") display.value = "";
    display.value += value;
  }
}

function clearCalc() {
  const display = document.getElementById("calc-display");
  if (display) display.value = "";
}

function calculateResult() {
  const display = document.getElementById("calc-display");
  if (display && display.value.trim() !== "") {
    try {
      display.value = eval(display.value);
    } catch (error) {
      display.value = "Error";
    }
  }
}

// --- APP: HOBBYTRACK ---
var hobbies = JSON.parse(localStorage.getItem("retros_hobbies")) || [], currentHobbyIndex = -1, currentRating = 0, currentPhotoBase64 = "", isBatchMode = false;
var hFields = ["name", "category", "notes", "status", "progress"];

function hideHobbyWelcome() { document.querySelector("#hobby-welcome-popup").style.display = "none"; }

function renderHobbyList() {
  var container = document.querySelector("#hobby-list"); if (!container) return; container.innerHTML = "";
  var q = document.querySelector("#hobby-search").value.toLowerCase();
  for (let i = 0; i < hobbies.length; i++) {
    if (q && hobbies[i].name.toLowerCase().indexOf(q) === -1) continue;
    var row = document.createElement("div");
    row.style = "background:#242433; border:1px solid #3d3d5c; padding:10px 15px; border-radius:4px; display:flex; align-items:center; cursor:pointer;";
    row.innerHTML = '<div style="display:flex; align-items:center; gap:12px; flex-grow:1;">' + (isBatchMode ? '<input type="checkbox" class="hobby-batch-cb" data-index="' + i + '" onclick="event.stopPropagation()">' : '') + '<span style="font-weight:bold; color:#50fa7b;">' + hobbies[i].name + '</span></div><span style="font-size:12px; color:' + (hobbies[i].status === "Aktiv" ? "#50fa7b" : hobbies[i].status === "Pausiert" ? "#ff5555" : "#ffb86c") + '">[' + hobbies[i].status + ']</span>';
    row.addEventListener("click", () => { if (!isBatchMode) openHobbyForm(i); });
    container.appendChild(row);
  }
}

function toggleBatchMode() {
  var btn = document.querySelector("#hobby-batch-btn");
  if (!isBatchMode) {
    isBatchMode = true; btn.innerText = "delete"; btn.style.background = "#ff5555"; btn.style.color = "#fff";
  } else {
    var cbs = document.querySelectorAll(".hobby-batch-cb");
    for (let i = cbs.length - 1; i >= 0; i--) { if (cbs[i].checked) hobbies.splice(parseInt(cbs[i].getAttribute("data-index")), 1); }
    localStorage.setItem("retros_hobbies", JSON.stringify(hobbies));
    isBatchMode = false; btn.innerText = "✔"; btn.style.background = "#1a1a24"; btn.style.color = "#50fa7b";
  }
  renderHobbyList();
}

function setRating(r) {
  if (document.querySelector("#hobby-input-name").disabled) return;
  currentRating = r; var spans = document.querySelectorAll("#hobby-stars-container span");
  for (let i = 0; i < spans.length; i++) spans[i].innerText = i < r ? "★" : "☆";
}

function triggerPhotoUpload() { if (!document.querySelector("#hobby-input-name").disabled) document.querySelector("#hobby-file-input").click(); }
function handlePhotoSelected(e) {
  var f = e.target.files[0]; if (!f) return;
  var reader = new FileReader(); reader.onload = (evt) => {
    currentPhotoBase64 = evt.target.result; document.querySelector("#hobby-photo-preview").src = currentPhotoBase64;
    document.querySelector("#hobby-photo-preview").style.display = "block"; document.querySelector("#photo-placeholder-text").style.display = "none";
  }; reader.readAsDataURL(f);
}

function openHobbyForm(idx) {
  currentHobbyIndex = idx; var h = hobbies[idx] || { name: "", category: "", notes: "", status: "Aktiv", progress: "", rating: 0, photo: "" };
  for (let f of hFields) document.querySelector("#hobby-input-" + f).value = h[f];
  currentPhotoBase64 = h.photo;
  document.querySelector("#hobby-photo-preview").src = h.photo;
  document.querySelector("#hobby-photo-preview").style.display = h.photo ? "block" : "none";
  document.querySelector("#photo-placeholder-text").style.display = h.photo ? "none" : "block";
  setRating(h.rating);
  for (let f of hFields) document.querySelector("#hobby-input-" + f).disabled = (idx !== -1);
  document.querySelector("#hobby-edit-btn").style.display = (idx !== -1) ? "block" : "none";
  document.querySelector("#hobby-save-btn").style.display = (idx === -1) ? "block" : "none";
  document.querySelector("#hobby-detail-view").style.display = "flex";
}

function enableEditMode() { for (let f of hFields) document.querySelector("#hobby-input-" + f).disabled = false; document.querySelector("#hobby-edit-btn").style.display = "none"; document.querySelector("#hobby-save-btn").style.display = "block"; }

function saveCurrentHobby() {
  var data = { rating: currentRating, photo: currentPhotoBase64 };
  for (let f of hFields) data[f] = document.querySelector("#hobby-input-" + f).value.trim();
  if (!data.name) return;
  if (currentHobbyIndex === -1) hobbies.push(data); else hobbies[currentHobbyIndex] = data;
  localStorage.setItem("retros_hobbies", JSON.stringify(hobbies));
  document.querySelector("#hobby-detail-view").style.display = "none"; renderHobbyList();
}

function openHobbyFormForNew() { openHobbyForm(-1); }
function goBackToMain() { document.querySelector("#hobby-detail-view").style.display = "none"; renderHobbyList(); }
function searchHobbies() { renderHobbyList(); }

renderHobbyList();
updateTaskbar();