
// Basic JS with clock, add reminder, and placeholders
const clockEl=document.getElementById('clock');
setInterval(()=>{const d=new Date();clockEl.textContent=d.toLocaleTimeString();},1000);

const form=document.getElementById('reminderForm');
const list=document.getElementById('list');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const text=document.getElementById('text').value;
  if(!text) return;
  const li=document.createElement('li');
  li.textContent=text;
  list.appendChild(li);
  form.reset();
});
