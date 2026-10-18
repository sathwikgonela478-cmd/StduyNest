/* Complete, self-contained learning projects for Projectx. */
window.PROJECTX_ADVANCED_PROJECTS = [
  {
    title: 'Study Planner Pro', level: 'Intermediate',
    description: 'A complete study planner with task creation, subject labels, priorities, due dates, search, filters, progress, deletion, and automatic saving.',
    features: ['Add study tasks with subject, priority, and due date', 'Filter all / pending / completed tasks and search by task or subject', 'See completion progress and delete tasks', 'Save tasks in localStorage so they remain after refresh'],
    concepts: ['DOM events', 'arrays and objects', 'filter()', 'map()', 'localStorage', 'form validation'],
    walkthrough: [
      {title:'1. HTML creates the structure', body:'The form collects a task title, subject, priority, and date. The list and progress area are empty containers that JavaScript fills in later.'},
      {title:'2. State is stored as an array', body:'Each task is an object with an id, title, subject, priority, date, and done value. An array makes it easy to add, remove, search, and filter tasks.'},
      {title:'3. renderTasks() draws the current state', body:'The render function filters tasks, creates safe DOM elements, and updates the progress count. It uses textContent rather than injecting user input as HTML.'},
      {title:'4. localStorage keeps the data', body:'saveTasks() converts the array into JSON text. When the page opens, the app reads that text and converts it back into an array.'},
      {title:'5. Events connect the interface', body:'Submitting the form adds a task. Filter and search controls redraw the list. Checkbox and delete actions update the array and then save it.'}
    ],
    code: String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Study Planner Pro</title>
<style>
:root{font-family:system-ui,sans-serif;color:#172033;background:#f3f6fb}*{box-sizing:border-box}body{margin:0;padding:24px}.app{max-width:980px;margin:auto}.hero,.panel{background:#fff;border:1px solid #dce4f0;border-radius:18px;padding:22px;margin-bottom:16px;box-shadow:0 8px 28px #14213d0a}.hero{background:linear-gradient(135deg,#e6f1ff,#f8fbff)}h1{margin:0 0 8px}p{line-height:1.55;color:#536178}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}label{display:grid;gap:6px;font-weight:650;font-size:.92rem}input,select,button{font:inherit;border-radius:9px;padding:11px;border:1px solid #cbd5e1}input,select{width:100%;background:white;color:#172033}button{cursor:pointer;background:#155eef;color:white;border-color:#155eef;font-weight:700}.secondary{background:white;color:#172033;border-color:#cbd5e1}.filters{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.filters>*{flex:1;min-width:150px}.stats{font-weight:750;color:#155eef}.task-list{display:grid;gap:10px;padding:0;list-style:none}.task{display:flex;align-items:flex-start;gap:12px;padding:14px;border:1px solid #e0e7f0;border-radius:12px}.task-main{flex:1;min-width:0}.task-title{font-weight:750;overflow-wrap:anywhere}.task-meta{font-size:.85rem;color:#64748b;margin-top:5px}.task.done .task-title{text-decoration:line-through;color:#64748b}.priority{display:inline-block;border-radius:99px;padding:3px 8px;background:#eaf2ff;color:#174ea6;font-size:.78rem}.delete{background:#fff0f0;color:#a21b1b;border-color:#ffd2d2;padding:7px 10px}.empty{padding:24px;text-align:center;border:1px dashed #cbd5e1;border-radius:12px;color:#64748b}.progress-track{height:9px;background:#e6edf7;border-radius:99px;overflow:hidden}.progress-fill{height:100%;width:0;background:#155eef;transition:width .2s}@media(max-width:650px){body{padding:12px}.grid{grid-template-columns:1fr}.hero,.panel{padding:16px}.task{gap:8px}}
</style>
</head>
<body>
<main class="app">
  <header class="hero"><h1>Study Planner Pro</h1><p>Turn your syllabus into small, trackable study tasks. Your tasks are saved on this device.</p><div class="stats" id="progressText">0 of 0 tasks completed</div><div class="progress-track"><div class="progress-fill" id="progressFill"></div></div></header>
  <section class="panel"><h2>Add a study task</h2><form id="taskForm"><div class="grid"><label>Task title<input id="taskTitle" maxlength="100" required placeholder="Example: Revise JavaScript arrays"></label><label>Subject<input id="taskSubject" maxlength="50" required placeholder="Example: JavaScript"></label><label>Priority<select id="taskPriority"><option>Normal</option><option>High</option><option>Low</option></select></label><label>Due date<input id="taskDate" type="date"></label></div><p><button type="submit">+ Add task</button></p></form></section>
  <section class="panel"><h2>Your study plan</h2><div class="filters"><input id="searchTasks" type="search" placeholder="Search tasks or subjects" aria-label="Search tasks"><select id="filterTasks" aria-label="Filter tasks"><option value="all">All tasks</option><option value="pending">Pending</option><option value="done">Completed</option></select><button class="secondary" id="clearDone" type="button">Clear completed</button></div><ul class="task-list" id="taskList"></ul><p id="emptyState" class="empty" hidden>No tasks match. Add a task or change the filter.</p></section>
</main>
<script>
'use strict';
// One unique storage key keeps this app's saved tasks separate from other apps.
const STORAGE_KEY = 'study-planner-pro-tasks-v1';
const form = document.getElementById('taskForm');
const titleInput = document.getElementById('taskTitle');
const subjectInput = document.getElementById('taskSubject');
const priorityInput = document.getElementById('taskPriority');
const dateInput = document.getElementById('taskDate');
const list = document.getElementById('taskList');
const searchInput = document.getElementById('searchTasks');
const filterInput = document.getElementById('filterTasks');
let tasks = loadTasks();
// Read saved tasks safely. Broken or missing saved data falls back to an empty list.
function loadTasks() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(saved) ? saved.filter(function(t){return t && typeof t.id==='string' && typeof t.title==='string' && typeof t.done==='boolean';}) : []; }
  catch (error) { return []; }
}
// Convert the JavaScript array to JSON text before storing it.
function saveTasks() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (error) { alert('Could not save data in this browser.'); } }
function makeElement(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
// Rebuild the visible list from the current task data and active filters.
function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = filterInput.value;
  const visible = tasks.filter(function(task) {
    const matchesText = (task.title + ' ' + task.subject).toLowerCase().includes(query);
    const matchesFilter = filter === 'all' || (filter === 'done' && task.done) || (filter === 'pending' && !task.done);
    return matchesText && matchesFilter;
  });
  list.replaceChildren();
  visible.forEach(function(task) {
    const item = makeElement('li', undefined, 'task' + (task.done ? ' done' : ''));
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = task.done; checkbox.setAttribute('aria-label', 'Mark ' + task.title + ' completed');
    checkbox.addEventListener('change', function(){ task.done = checkbox.checked; saveTasks(); renderTasks(); });
    const main = makeElement('div', undefined, 'task-main');
    main.append(makeElement('div', task.title, 'task-title'));
    main.append(makeElement('div', task.subject + ' · Due: ' + (task.due || 'No date'), 'task-meta'));
    const badge = makeElement('span', task.priority + ' priority', 'priority'); main.append(badge);
    const remove = makeElement('button', 'Delete', 'delete'); remove.type = 'button'; remove.setAttribute('aria-label','Delete '+task.title);
    remove.addEventListener('click', function(){ tasks = tasks.filter(function(entry){return entry.id !== task.id;}); saveTasks(); renderTasks(); });
    item.append(checkbox, main, remove); list.append(item);
  });
  document.getElementById('emptyState').hidden = visible.length > 0;
  const doneCount = tasks.filter(function(task){return task.done;}).length;
  document.getElementById('progressText').textContent = doneCount + ' of ' + tasks.length + ' tasks completed';
  document.getElementById('progressFill').style.width = (tasks.length ? doneCount / tasks.length * 100 : 0) + '%';
}
// The submit event adds a new task without reloading the page.
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const title = titleInput.value.trim(); const subject = subjectInput.value.trim();
  if (!title || !subject) return;
  tasks.unshift({id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random(), title:title, subject:subject, priority:priorityInput.value, due:dateInput.value, done:false});
  saveTasks(); form.reset(); titleInput.focus(); renderTasks();
});
searchInput.addEventListener('input', renderTasks);
filterInput.addEventListener('change', renderTasks);
document.getElementById('clearDone').addEventListener('click', function(){ tasks = tasks.filter(function(task){return !task.done;}); saveTasks(); renderTasks(); });
renderTasks();
</script>
</body>
</html>`
  },
  {
    title: 'Expense Tracker Dashboard', level: 'Intermediate+',
    description: 'A full expense tracker with income/expense entries, category, date, delete, totals, balance, filtering, and local saving.',
    features: ['Record income and expenses with amount, category, and date', 'Calculate total income, total spending, and remaining balance', 'Filter transactions by type and remove mistaken entries', 'Persist transactions in localStorage'],
    concepts: ['form handling', 'numeric validation', 'reduce()', 'filter()', 'DOM rendering', 'JSON storage'],
    walkthrough: [
      {title:'1. A transaction is an object', body:'Each record stores a unique id, description, amount, type, category, and date. The type decides whether the amount adds to income or expenses.'},
      {title:'2. Totals are derived from the data', body:'reduce() walks through the transactions and adds matching amounts. The app calculates totals from the list rather than storing a second, potentially incorrect total.'},
      {title:'3. Input is validated', body:'The form rejects empty descriptions and amounts that are zero or negative. This prevents common mistakes before they enter the transaction list.'},
      {title:'4. Rendering uses safe text', body:'The transaction list is rebuilt from the data array. User-entered text is inserted with textContent, not innerHTML.'},
      {title:'5. Saving and loading', body:'The app serializes transactions to localStorage after changes and reloads them when the page starts. This is local to one browser, not a cloud account.'}
    ],
    code: String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Expense Tracker</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:24px;background:#f2f5fa;color:#182238;font:16px/1.5 system-ui,sans-serif}.app{max-width:1000px;margin:auto}.hero,.panel{background:#fff;border:1px solid #dce4ef;border-radius:16px;padding:22px;margin-bottom:16px}.hero{background:linear-gradient(135deg,#e6fff5,#f8fffc)}h1{margin:0}.muted{color:#637087}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.metric{padding:16px;border-radius:12px;background:#f7f9fc;border:1px solid #e2e8f0}.metric strong{display:block;font-size:1.45rem;overflow-wrap:anywhere}.positive{color:#087443}.negative{color:#b42318}form{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr auto;gap:9px;align-items:end}label{display:grid;gap:5px;font-size:.88rem;font-weight:700}input,select,button{min-width:0;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}button{background:#155eef;color:white;border-color:#155eef;font-weight:700;cursor:pointer}.transactions{list-style:none;padding:0;display:grid;gap:9px}.transaction{display:flex;gap:12px;align-items:center;border:1px solid #e2e8f0;border-radius:10px;padding:12px}.description{flex:1;min-width:0;overflow-wrap:anywhere;font-weight:700}.meta{font-size:.82rem;color:#64748b;font-weight:400}.amount{font-weight:800;white-space:nowrap}.delete{background:#fff;color:#b42318;border-color:#fecaca;padding:7px}.filter-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.filter-row>*{min-width:160px;flex:1}.empty{padding:20px;text-align:center;color:#64748b;border:1px dashed #cbd5e1;border-radius:10px}@media(max-width:800px){form{grid-template-columns:repeat(2,minmax(0,1fr))}.cards{grid-template-columns:1fr}}@media(max-width:480px){body{padding:12px}.hero,.panel{padding:15px}.transaction{align-items:flex-start;flex-wrap:wrap}.amount{margin-left:auto}}
</style></head><body><main class="app">
<header class="hero"><h1>Expense Tracker</h1><p class="muted">Know where your money goes. Your records stay in this browser.</p></header>
<section class="cards"><div class="metric"><span class="muted">Income</span><strong class="positive" id="incomeTotal">₹0.00</strong></div><div class="metric"><span class="muted">Expenses</span><strong class="negative" id="expenseTotal">₹0.00</strong></div><div class="metric"><span class="muted">Balance</span><strong id="balanceTotal">₹0.00</strong></div></section>
<section class="panel"><h2>Add transaction</h2><form id="transactionForm"><label>Description<input id="description" required maxlength="80" placeholder="Bus pass"></label><label>Amount (₹)<input id="amount" type="number" min="0.01" step="0.01" required placeholder="600"></label><label>Type<select id="type"><option value="expense">Expense</option><option value="income">Income</option></select></label><label>Category<select id="category"><option>Food</option><option>Travel</option><option>Study</option><option>Shopping</option><option>Salary</option><option>Other</option></select></label><label>Date<input id="date" type="date" required></label><button type="submit">Add</button></form></section>
<section class="panel"><h2>Transactions</h2><div class="filter-row"><input id="search" type="search" placeholder="Search descriptions" aria-label="Search transactions"><select id="typeFilter" aria-label="Filter by type"><option value="all">All types</option><option value="income">Income only</option><option value="expense">Expenses only</option></select></div><ul class="transactions" id="transactionList"></ul><p class="empty" id="empty" hidden>No transactions yet. Add your first one above.</p></section>
</main><script>
'use strict';
// Keep this app's data under its own localStorage key.
const KEY='expense-tracker-transactions-v1';
const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'});
const $ = function(id){return document.getElementById(id);};
let transactions=[];
try{const stored=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(stored))transactions=stored.filter(function(t){return t&&typeof t.id==='string'&&Number.isFinite(t.amount)&&['income','expense'].includes(t.type);});}catch(error){transactions=[];}
$('date').value=new Date().toISOString().slice(0,10);
function save(){try{localStorage.setItem(KEY,JSON.stringify(transactions));}catch(error){alert('Unable to save in this browser.');}}
function element(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;}
// Recalculate totals from transactions so the summary never drifts out of sync.
function render(){
 const income=transactions.filter(function(t){return t.type==='income';}).reduce(function(sum,t){return sum+t.amount;},0);
 const expenses=transactions.filter(function(t){return t.type==='expense';}).reduce(function(sum,t){return sum+t.amount;},0);
 $('incomeTotal').textContent=money.format(income);$('expenseTotal').textContent=money.format(expenses);$('balanceTotal').textContent=money.format(income-expenses);$('balanceTotal').className=(income-expenses<0?'negative':'positive');
 const q=$('search').value.trim().toLowerCase(),filter=$('typeFilter').value;
 const visible=transactions.filter(function(t){return t.description.toLowerCase().includes(q)&&(filter==='all'||t.type===filter);});
 const list=$('transactionList');list.replaceChildren();
 visible.slice().reverse().forEach(function(t){const item=element('li',undefined,'transaction');const detail=element('div',undefined,'description');detail.append(element('div',t.description));detail.append(element('div',t.category+' · '+t.date,'meta'));const amount=element('span',(t.type==='income'?'+':'−')+money.format(t.amount),'amount '+(t.type==='income'?'positive':'negative'));const del=element('button','Delete','delete');del.type='button';del.addEventListener('click',function(){transactions=transactions.filter(function(x){return x.id!==t.id;});save();render();});item.append(detail,amount,del);list.append(item);});
 $('empty').hidden=visible.length>0;
}
// Validate user input before it becomes a transaction.
$('transactionForm').addEventListener('submit',function(event){event.preventDefault();const description=$('description').value.trim(),amount=Number($('amount').value),date=$('date').value;if(!description||!Number.isFinite(amount)||amount<=0||!date){alert('Enter a description, a positive amount, and a date.');return;}transactions.push({id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()),description:description,amount:Math.round(amount*100)/100,type:$('type').value,category:$('category').value,date:date});save();this.reset();$('date').value=new Date().toISOString().slice(0,10);render();});
$('search').addEventListener('input',render);$('typeFilter').addEventListener('change',render);render();
</script></body></html>`
  },
  {
    title: 'Quiz Master', level: 'Intermediate+',
    description: 'A complete quiz application with shuffled questions, progress bar, answer feedback, score summary, review mode, and restart.',
    features: ['Multiple-choice questions with immediate feedback', 'Progress tracking and score percentage', 'Review each answer with a clear explanation', 'Restart the quiz without reloading the page'],
    concepts: ['arrays of objects', 'state management', 'event listeners', 'conditional rendering', 'functions', 'accessibility'],
    walkthrough: [
      {title:'1. Questions are data', body:'Each question is an object containing its prompt, options, correct option index, and explanation. The renderer can display any question that follows this shape.'},
      {title:'2. State tracks progress', body:'currentIndex records the current question, answers stores the chosen option for each question, and submitted prevents a question from being answered twice.'},
      {title:'3. One render function controls the UI', body:'renderQuestion() updates the prompt, choices, progress bar, and button state from the current state. This avoids manually changing unrelated elements in many places.'},
      {title:'4. Feedback teaches the reason', body:'After an answer is selected, the app tells you whether it is correct and explains why. A wrong answer becomes a learning opportunity instead of only showing a red mark.'},
      {title:'5. The summary is calculated', body:'The final score is calculated by counting answers that match each question’s correct index. Restart resets the state and renders question one again.'}
    ],
    code: String.raw`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Quiz Master</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;background:#eef3fa;color:#172033;font:16px/1.55 system-ui,sans-serif}.app{max-width:760px;margin:24px auto}.card{background:white;border:1px solid #dbe4f0;border-radius:18px;padding:clamp(18px,4vw,32px);box-shadow:0 12px 32px #1720330d}.topline{display:flex;justify-content:space-between;gap:12px;color:#5b6b82;font-size:.9rem}.track{height:9px;background:#e5ebf4;border-radius:99px;overflow:hidden;margin:12px 0 24px}.fill{height:100%;width:0;background:#155eef;transition:width .2s}.question{font-size:1.35rem;font-weight:800;line-height:1.35}.choices{display:grid;gap:10px;margin:20px 0}.choice{display:flex;gap:10px;align-items:center;text-align:left;padding:13px;border:1px solid #cbd5e1;background:#fff;color:#172033;border-radius:10px;cursor:pointer;font:inherit}.choice:hover:not(:disabled){border-color:#155eef;background:#f4f8ff}.choice.correct{border-color:#12805c;background:#eafff5}.choice.wrong{border-color:#c43232;background:#fff0f0}.choice:disabled{cursor:default}.feedback{padding:14px;border-radius:10px;background:#f4f7fb;margin:14px 0}.feedback:empty{display:none}.actions{display:flex;gap:10px;flex-wrap:wrap}button.action{padding:11px 16px;border:1px solid #155eef;border-radius:9px;background:#155eef;color:white;font:inherit;font-weight:750;cursor:pointer}button.secondary{background:white;color:#172033;border-color:#cbd5e1}.summary{text-align:center}.score{font-size:3rem;font-weight:900;color:#155eef}.muted{color:#64748b}@media(max-width:500px){body{padding:12px}.topline{flex-direction:column}.question{font-size:1.15rem}}
</style></head><body><main class="app"><section class="card" id="quizApp" aria-live="polite"></section></main><script>
'use strict';
// Each question is data: prompt, options, correct option index, and teaching explanation.
const questions=[
 {question:'Which keyword declares a variable whose value can be reassigned?',options:['const','let','return','import'],answer:1,why:'let declares a block-scoped variable that can be reassigned. const is used when the binding should not be reassigned.'},
 {question:'What does Array.filter() return?',options:['Always a number','The first item only','A new array containing items that pass a test','It changes every item in the original array'],answer:2,why:'filter() tests each item and creates a new array with the items whose test returned true.'},
 {question:'Which is the safest simple way to put user-provided plain text into an element?',options:['textContent','innerHTML','document.write()','eval()'],answer:0,why:'textContent treats the value as text instead of parsing it as HTML, reducing injection risk.'},
 {question:'What does === compare?',options:['Only the type','Only the value after conversion','Both type and value','Whether two variables are declared'],answer:2,why:'Strict equality checks type and value without converting the operands first.'},
 {question:'What is the purpose of localStorage?',options:['Save data only until a variable changes','Store small key/value strings in this browser across reloads','Share data automatically with every user','Run JavaScript on a server'],answer:1,why:'localStorage stores string values in the current browser origin. It is not a shared cloud database.'}
];
const app=document.getElementById('quizApp');let currentIndex=0;let answers=Array(questions.length).fill(null);let submitted=false;let review=false;
function make(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;}
// Count the answers that match the correct option for each question.
function score(){return answers.reduce(function(total,answer,index){return total+(answer===questions[index].answer?1:0);},0);}
function renderSummary(){app.replaceChildren();const box=make('div',undefined,'summary');box.append(make('p','QUIZ COMPLETE','muted'),make('h1','Your result'),make('div',score()+' / '+questions.length,'score'),make('p',Math.round(score()/questions.length*100)+'% score'));box.append(make('p',score()===questions.length?'Excellent work! You answered every question correctly.':'Review the explanations below, then try again.'));const reviewButton=make('button','Review answers','action secondary');reviewButton.addEventListener('click',function(){review=true;currentIndex=0;renderQuestion();});const restart=make('button','Restart quiz','action');restart.addEventListener('click',restartQuiz);const actions=make('div',undefined,'actions');actions.append(reviewButton,restart);box.append(actions);app.append(box);}
// Draw the current question based on currentIndex and answers.
function renderQuestion(){if(currentIndex>=questions.length){renderSummary();return;}const q=questions[currentIndex];app.replaceChildren();const top=make('div',undefined,'topline');top.append(make('span','Question '+(currentIndex+1)+' of '+questions.length),make('span','Score so far: '+score()));app.append(top);const track=make('div',undefined,'track');const fill=make('div',undefined,'fill');fill.style.width=(currentIndex/questions.length*100)+'%';track.append(fill);app.append(track);app.append(make('h1','Quiz Master'));app.append(make('p',q.question,'question'));const choices=make('div',undefined,'choices');q.options.forEach(function(option,index){const button=make('button',String.fromCharCode(65+index)+'.  '+option,'choice');button.type='button';button.disabled=answers[currentIndex]!==null||review;if(answers[currentIndex]===index)button.classList.add(index===q.answer?'correct':'wrong');if((answers[currentIndex]!==null||review)&&index===q.answer)button.classList.add('correct');button.addEventListener('click',function(){if(answers[currentIndex]!==null||review)return;answers[currentIndex]=index;renderQuestion();});choices.append(button);});app.append(choices);const feedback=make('div',undefined,'feedback');if(answers[currentIndex]!==null||review){const chosen=answers[currentIndex];feedback.append(make('strong',review?'Answer review':(chosen===q.answer?'Correct!':'Not quite.')));feedback.append(make('p',q.why));if(chosen===null)feedback.append(make('p','You did not answer this question in this attempt.'));}app.append(feedback);const actions=make('div',undefined,'actions');if(currentIndex>0){const back=make('button',review?'Previous answer':'Previous question','action secondary');back.addEventListener('click',function(){currentIndex--;renderQuestion();});actions.append(back);}if(currentIndex<questions.length-1){const next=make('button',review?'Next answer':'Next question','action');next.disabled=answers[currentIndex]===null&&!review;next.addEventListener('click',function(){currentIndex++;renderQuestion();});actions.append(next);}else{const finish=make('button',review?'Back to result':'Finish quiz','action');finish.addEventListener('click',function(){if(review){review=false;renderSummary();}else if(answers.every(function(a){return a!==null;})){renderSummary();}else{const unanswered=answers.findIndex(function(a){return a===null;});currentIndex=unanswered;renderQuestion();}});actions.append(finish);}app.append(actions);if(!review&&answers[currentIndex]===null){const note=make('p','Choose an answer to unlock the next question.','muted');app.append(note);}}
// Reset the state to make a fresh attempt.
function restartQuiz(){currentIndex=0;answers=Array(questions.length).fill(null);submitted=false;review=false;renderQuestion();}
renderQuestion();
</script></body></html>`
  }
];
