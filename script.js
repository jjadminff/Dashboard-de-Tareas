let tasks = [];
let subtasks = [];

// --- FETCH INICIAL ---
async function fetchTasks() {
  const [tRes, sRes] = await Promise.all([fetch('/api/tasks'), fetch('/api/subtasks')]);
  tasks = await tRes.json();
  subtasks = await sRes.json();
  render();
}

// --- FUNCIONES AUXILIARES ---
function el(tag, cls, txt){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(txt !== undefined) e.textContent = txt;
  return e;
}

// --- RENDER DE TABLERO ---
function render() {
  ['todo','inprogress','done'].forEach(col => {
    const container = document.querySelector(`#${col} .list`);
    container.innerHTML = '';
    tasks.filter(t => t.column_name === col)
      .sort((a,b)=>a.order_index - b.order_index)
      .forEach(t => {
        const taskEl = el('div','task');
        taskEl.draggable = true;
        taskEl.dataset.id = t.id;

        // PRIORIDAD
        const priorityColors = {low:'#d3d3d3', medium:'#2196F3', high:'#4CAF50'};
        const prioTag = el('span','priority-tag', t.priority || 'low');
        prioTag.style.backgroundColor = priorityColors[t.priority || 'low'];
        prioTag.style.color = '#fff';
        prioTag.style.padding = '2px 6px';
        prioTag.style.borderRadius = '4px';
        prioTag.style.marginRight = '4px';
        prioTag.style.cursor = 'pointer';
        prioTag.addEventListener('click', async ()=>{
          const newPrio = prompt('Prioridad (low, medium, high):', t.priority || 'low');
          if(newPrio && ['low','medium','high'].includes(newPrio)){
            t.priority = newPrio;
            await updateTask(t);
            fetchTasks();
          }
        });

        // TÍTULO editable
        const titleSpan = el('span','task-title', t.title);
        titleSpan.contentEditable = true;
        titleSpan.addEventListener('blur', async ()=>{
          const newTitle = titleSpan.textContent.trim();
          if(newTitle && newTitle!==t.title){
            t.title = newTitle;
            await updateTask(t);
            fetchTasks();
          }
        });

        // CONTROLES
        const controls = el('div','task-controls');
        const addSubBtn = el('button','smallbtn','➕ Sub');
        addSubBtn.dataset.taskid = t.id;
        addSubBtn.classList.add('add-subtask-btn');

        const delBtn = el('button','smallbtn','✕');
        delBtn.addEventListener('click', ()=> deleteTask(t.id));
        controls.appendChild(addSubBtn);
        controls.appendChild(delBtn);

        // SUBTASKS
        const subsWrap = el('div','subtasks');
        subsWrap.id = `subs-for-${t.id}`;
        const tSubs = subtasks.filter(s => s.taskId == t.id);
        tSubs.forEach(s=>{
          const sEl = el('div','subtask');
          const chk = el('input');
          chk.type = 'checkbox';
          chk.checked = !!s.completed;
          chk.dataset.subid = s.id;
          chk.classList.add('subtask-checkbox');

          const sTitle = el('div','title', s.title);
          sTitle.contentEditable = true;
          sTitle.dataset.subid = s.id;
          sTitle.classList.add('subtask-title');
          if(s.completed) sTitle.style.textDecoration='line-through';

          const sDel = el('button','smallbtn','✕');
          sDel.dataset.subid = s.id;
          sDel.classList.add('subtask-delete');

          sEl.appendChild(chk);
          sEl.appendChild(sTitle);
          sEl.appendChild(sDel);
          subsWrap.appendChild(sEl);
        });

        // UI agregar subtarea
        const addSubUI = el('div','add-subtask');
        addSubUI.style.display='none';
        addSubUI.dataset.taskid = t.id;
        const input = el('input');
        input.placeholder='Nueva subtarea...';
        input.classList.add('add-sub-input');
        const addBtn = el('button',null,'Agregar');
        addBtn.dataset.taskid = t.id;
        addBtn.classList.add('add-sub-submit');

        addSubUI.appendChild(input);
        addSubUI.appendChild(addBtn);

        // TASK CONTENEDOR
        taskEl.appendChild(prioTag);
        taskEl.appendChild(titleSpan);
        taskEl.appendChild(controls);
        taskEl.appendChild(subsWrap);
        taskEl.appendChild(addSubUI);

        // DRAG & DROP
        taskEl.addEventListener('dragstart', e=> taskEl.classList.add('dragging'));
        taskEl.addEventListener('dragend', e=>{
          taskEl.classList.remove('dragging');
          saveBoard();
        });

        container.appendChild(taskEl);
      });
  });
  enableDropping();
}

// --- FUNCIONES COMUNES ---
async function updateTask(t){
  await fetch('/api/tasks', {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify([{id:t.id, title:t.title, column_name:t.column_name, order_index:t.order_index, priority:t.priority}])
  });
}

async function addTask(){
  const title = document.getElementById('newTitle').value.trim();
  if(!title) return;
  await fetch('/api/tasks',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title, column_name:'todo', order_index:0, priority:'low'})});
  document.getElementById('newTitle').value='';
  fetchTasks();
}

async function deleteTask(id){
  if(!confirm('Eliminar tarea?')) return;
  await fetch('/api/tasks/delete',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
  fetchTasks();
}

async function addSubtask(taskId, title){
  if(!title || !title.trim()) return;
  await fetch('/api/subtasks',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({taskId, title:title.trim()})});
  fetchTasks();
}

async function toggleSubtaskCompleted(id, completed){
  await fetch('/api/subtasks',{method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id, completed})});
  fetchTasks();
}

async function deleteSubtask(id){
  if(!confirm('Eliminar subtarea?')) return;
  await fetch('/api/subtasks/delete',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
  fetchTasks();
}

// --- DRAG & DROP ---
function enableDropping(){
  document.querySelectorAll('.list').forEach(list=>{
    list.addEventListener('dragover', e=>{
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if(!dragging) return;
      const after = getDragAfterElement(list, e.clientY);
      if(!after) list.appendChild(dragging);
      else list.insertBefore(dragging, after);
    });
  });
}

function getDragAfterElement(container, y){
  const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
  return draggableElements.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if(offset <0 && offset > closest.offset) return {offset:offset, element:child};
    else return closest;
  }, {offset:Number.NEGATIVE_INFINITY}).element;
}

// --- GUARDAR TABLERO ---
async function saveBoard(){
  const newTasks = [];
  ['todo','inprogress','done'].forEach(col=>{
    const list = document.querySelectorAll(`#${col} .task`);
    list.forEach((el, idx)=>{
      const t = tasks.find(x=>x.id==el.dataset.id);
      newTasks.push({id:t.id, title:t.title, column_name:col, order_index:idx, priority:t.priority});
    });
  });
  await fetch('/api/tasks',{method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newTasks)});
  fetchTasks();
}

// --- DELEGACIÓN DE EVENTOS ---
document.addEventListener('click', async (e)=>{
  if(e.target.classList.contains('add-subtask-btn')){
    const taskId = e.target.dataset.taskid;
    const ui = document.querySelector(`.add-subtask[data-taskid='${taskId}']`);
    ui.style.display = (ui.style.display==='none' || ui.style.display==='')?'flex':'none';
  }

  if(e.target.classList.contains('add-sub-submit')){
    const taskId = e.target.dataset.taskid;
    const input = document.querySelector(`.add-subtask[data-taskid='${taskId}'] input`);
    if(input.value.trim()!==''){
      await addSubtask(taskId, input.value.trim());
      input.value='';
      document.querySelector(`.add-subtask[data-taskid='${taskId}']`).style.display='none';
    }
  }

  if(e.target.classList.contains('subtask-delete')){
    const subId = e.target.dataset.subid;
    deleteSubtask(subId);
  }
});

document.addEventListener('change', async (e)=>{
  if(e.target.classList.contains('subtask-checkbox')){
    const subId = e.target.dataset.subid;
    const checked = e.target.checked;
    toggleSubtaskCompleted(subId, checked);
  }
});

// --- BOTÓN AGREGAR TAREA PRINCIPAL ---
document.getElementById('addBtn').addEventListener('click', addTask);

// --- CARGA INICIAL ---
fetchTasks();
