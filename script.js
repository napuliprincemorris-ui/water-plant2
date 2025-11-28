const listEl = document.getElementById("list");
const textEl = document.getElementById("text");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const waterEl = document.getElementById("waterAmount");
const treeEl = document.getElementById("treeSelect");
const treeInfoEl = document.getElementById("treeInfo");
const clockEl = document.getElementById("clock");
const ringtone = document.getElementById("ringtone");

let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

// ML VALUES 100 → 2500
for (let i = 100; i <= 2500; i += 100) {
const opt = document.createElement("option");
opt.value = i;
opt.textContent = i + " ml";
waterEl.appendChild(opt);
}

// Update tree info
function updateTreeInfo() {
const selected = treeEl.selectedOptions[0];
if (!selected.value) {
treeInfoEl.textContent = '';
return;
}
const freq = selected.getAttribute('data-frequency');
const sun = selected.getAttribute('data-sun');
treeInfoEl.textContent = `Water every ${freq} days • Sun: ${sun}`;
}

treeEl.addEventListener('change', updateTreeInfo);
updateTreeInfo();

// Clock
setInterval(() => {
const n = new Date();
clockEl.textContent = n.toLocaleTimeString();
checkReminders();
}, 1000);

function saveAll() {
localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Combine date + time
function getDateTime() {
if (!dateEl.value || !timeEl.value) return null;
return new Date(`${dateEl.value}T${timeEl.value}`).toISOString();
}

// Add Reminder
document.getElementById("reminderForm").addEventListener("submit", (e)=>{
e.preventDefault();

const reminder = {
id: Date.now(),
text: textEl.value,
datetime: getDateTime(),
water: waterEl.value,
tree: treeEl.value
};

reminders.push(reminder);
saveAll();
render();

textEl.value = '';
treeEl.value = '';
updateTreeInfo();
});

// Clear All
document.getElementById("clearAll").addEventListener("click", ()=>{
reminders = [];
saveAll();
render();
});

// Floating Add → Scroll to top
document.getElementById("floatingAdd").addEventListener("click", ()=>{
window.scrollTo({top:0, behavior:"smooth"});
});

// Render items
function render(){
listEl.innerHTML = "";

reminders.forEach(r => {
const li = document.createElement("li");
li.className = "item";

```
const left = document.createElement("div");
left.innerHTML = `
  <h3>🪴 ${r.text}</h3>
  <div class="meta">${r.datetime ? new Date(r.datetime).toLocaleString() : 'No time'} • ${r.water} ml${r.tree ? ' • ' + r.tree : ''}</div>
`;

const right = document.createElement("div");

const snooze = document.createElement("button");
snooze.textContent = "Snooze 10m";
snooze.className = "snoozeBtn";
snooze.onclick = () => {
  if(!r.datetime) return;
  let d = new Date(r.datetime);
  d.setMinutes(d.getMinutes() + 10);
  r.datetime = d.toISOString();
  saveAll();
  render();
};

const del = document.createElement("button");
del.textContent = "Delete";
del.className = "deleteBtn";
del.onclick = () => {
  reminders = reminders.filter(x => x.id !== r.id);
  saveAll();
  render();
};

right.appendChild(snooze);
right.appendChild(del);

li.appendChild(left);
li.appendChild(right);
listEl.appendChild(li);
```

});
}

render();

// Check reminders
function checkReminders() {
const now = new Date().getTime();

reminders.forEach(r => {
if(!r.datetime) return;
const t = new Date(r.datetime).getTime();
if (!r.triggered && now >= t) {
r.triggered = true;
ringtone.play();
confetti({particleCount:50, spread:60});
saveAll();
alert(`Time to water! (${r.water} ml${r.tree ? ' for ' + r.tree : ''})`);
}
});
}
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
