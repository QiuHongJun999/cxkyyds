// Core variables
let currentTheme = 'light'; // Default theme
let currentLanguage = 'en'; // Default language
let todos = []; // Task list
let reminders = []; // Reminders list
let urgentTasks = []; // Urgent tasks list
let familyTasks = []; // Family tasks list
let workTasks = []; // Work tasks list

// Load data from LocalStorage
function loadData() {
    const savedTodos = localStorage.getItem('todos');
    const savedReminders = localStorage.getItem('reminders');
    const savedUrgentTasks = localStorage.getItem('urgentTasks');
    const savedFamilyTasks = localStorage.getItem('familyTasks');
    const savedWorkTasks = localStorage.getItem('workTasks');
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedTodos) todos = JSON.parse(savedTodos);
    if (savedReminders) reminders = JSON.parse(savedReminders);
    if (savedUrgentTasks) urgentTasks = JSON.parse(savedUrgentTasks);
    if (savedFamilyTasks) familyTasks = JSON.parse(savedFamilyTasks);
    if (savedWorkTasks) workTasks = JSON.parse(savedWorkTasks);
    if (savedTheme) currentTheme = savedTheme;
    if (savedLanguage) currentLanguage = savedLanguage;
}

// Save data to LocalStorage
function saveData() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('reminders', JSON.stringify(reminders));
    localStorage.setItem('urgentTasks', JSON.stringify(urgentTasks));
    localStorage.setItem('familyTasks', JSON.stringify(familyTasks));
    localStorage.setItem('workTasks', JSON.stringify(workTasks));
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('language', currentLanguage);
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    if (currentTheme === 'light') {
        body.classList.replace('light-theme', 'dark-theme');
        currentTheme = 'dark';
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        currentTheme = 'light';
    }
    saveData(); // Save the theme preference
}

// Language toggle
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    updateLanguage();
    saveData(); // Save the language preference
}

// Update language dynamically (with icon preservation)
function updateLanguage() {
    const translations = {
        en: {
            appTitle: "Multi-Function Memo Application",
            themeToggle: "Switch Theme",
            languageToggle: "Switch Language",
            memo: "Memo",
            reminder: "Task Reminder",
            todo: "View To-Do List",
            urgentTasks: "Urgent Tasks",
            familyTasks: "Family Tasks",  // Added translation
            workTasks: "Work Tasks",      // Added translation
        },
        zh: {
            appTitle: "多功能备忘应用",
            themeToggle: "切换主题",
            languageToggle: "切换语言",
            memo: "备忘录",
            reminder: "任务提醒",
            todo: "查看待办事项",
            urgentTasks: "紧急任务",
            familyTasks: "家庭事项",       // Added translation
            workTasks: "工作事项",         // Added translation
        }
    };

    const t = translations[currentLanguage];
    document.getElementById('app-title').innerHTML = `<i class="fas fa-sticky-note"></i> ${t.appTitle}`;
    document.getElementById('theme-toggle').innerHTML = `<i class="fas fa-adjust"></i> ${t.themeToggle}`;
    document.getElementById('language-toggle').innerHTML = `<i class="fas fa-language"></i> ${t.languageToggle}`;
    document.getElementById('btn-memo').innerHTML = `<i class="fas fa-pencil-alt"></i> ${t.memo}`;
    document.getElementById('btn-reminder').innerHTML = `<i class="fas fa-clock"></i> ${t.reminder}`;
    document.getElementById('btn-todo').innerHTML = `<i class="fas fa-list"></i> ${t.todo}`;
    document.getElementById('btn-urgent').innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${t.urgentTasks}`;
    document.getElementById('btn-family').innerHTML = `<i class="fas fa-home"></i> ${t.familyTasks}`;  // Added button
    document.getElementById('btn-work').innerHTML = `<i class="fas fa-briefcase"></i> ${t.workTasks}`;  // Added button
}

// Show dynamic module content
function showModule(moduleName) {
    const mainContent = document.getElementById('main-content');
    if (moduleName === 'memo') {
        loadMemoModule(mainContent);
    } else if (moduleName === 'reminder') {
        loadReminderModule(mainContent);
    } else if (moduleName === 'todo') {
        loadTodoModule(mainContent);
    } else if (moduleName === 'family') {
        loadFamilyModule(mainContent);  // Added function for family tasks
    } else if (moduleName === 'work') {
        loadWorkModule(mainContent);    // Added function for work tasks
    }
}

// Load Family Module
function loadFamilyModule(container) {
    container.innerHTML = `
        <h2>Family Tasks</h2>
        <input type="text" id="familyInput" placeholder="Enter family task..." />
        <input type="datetime-local" id="familyTime" />
        <button onclick="addFamilyTask()">Add Family Task</button>
        <ul id="familyList"></ul>
    `;
    displayFamilyTasks();
}

function addFamilyTask() {
    const familyInput = document.getElementById('familyInput').value.trim();
    const familyTime = document.getElementById('familyTime').value;

    if (!familyInput || !familyTime) {
        alert("Please enter task content and time!");
        return;
    }

    const newFamilyTask = {
        text: familyInput,
        time: familyTime,
        completed: false,
        urgent: false,
    };

    familyTasks.push(newFamilyTask);
    document.getElementById('familyInput').value = "";
    document.getElementById('familyTime').value = "";
    displayFamilyTasks();
    saveData(); // Save after adding new family task
}

function displayFamilyTasks() {
    const familyList = document.getElementById('familyList');
    familyList.innerHTML = '';

    familyTasks.forEach((task, index) => {
        const li = createTaskItem(task, index, "family");
        familyList.appendChild(li);
    });
}

// Load Work Module
function loadWorkModule(container) {
    container.innerHTML = `
        <h2>Work Tasks</h2>
        <input type="text" id="workInput" placeholder="Enter work task..." />
        <input type="datetime-local" id="workTime" />
        <button onclick="addWorkTask()">Add Work Task</button>
        <ul id="workList"></ul>
    `;
    displayWorkTasks();
}

function addWorkTask() {
    const workInput = document.getElementById('workInput').value.trim();
    const workTime = document.getElementById('workTime').value;

    if (!workInput || !workTime) {
        alert("Please enter task content and time!");
        return;
    }

    const newWorkTask = {
        text: workInput,
        time: workTime,
        completed: false,
        urgent: false,
    };

    workTasks.push(newWorkTask);
    document.getElementById('workInput').value = "";
    document.getElementById('workTime').value = "";
    displayWorkTasks();
    saveData(); // Save after adding new work task
}

function displayWorkTasks() {
    const workList = document.getElementById('workList');
    workList.innerHTML = '';

    workTasks.forEach((task, index) => {
        const li = createTaskItem(task, index, "work");
        workList.appendChild(li);
    });
}
// Load Memo Module
function loadMemoModule(container) {
    container.innerHTML = `
        <h2>Memo</h2>
        <input type="text" id="memoInput" placeholder="Enter your memo..." />
        <input type="datetime-local" id="memoTime" />
        <button onclick="addMemo()">Add Memo</button>
        <ul id="memoList"></ul>
    `;
    displayMemos();
}

function addMemo() {
    const memoInput = document.getElementById('memoInput').value.trim();
    const memoTime = document.getElementById('memoTime').value;

    if (!memoInput || !memoTime) {
        alert("Please enter content and time!");
        return;
    }

    const newMemo = {
        text: memoInput,
        time: memoTime,
        completed: false,
        urgent: false,
    };

    todos.push(newMemo);
    document.getElementById('memoInput').value = "";
    document.getElementById('memoTime').value = "";
    displayMemos();
    saveData(); // Save after adding new memo
}

function displayMemos() {
    const memoList = document.getElementById('memoList');
    memoList.innerHTML = '';

    todos.forEach((memo, index) => {
        const li = createTaskItem(memo, index, "memo");
        memoList.appendChild(li);
    });
}

// Load Reminder Module
function loadReminderModule(container) {
    container.innerHTML = `
        <h2>Task Reminders</h2>
        <input type="text" id="reminderInput" placeholder="Enter your reminder..." />
        <input type="datetime-local" id="reminderTime" />
        <button onclick="addReminder()">Add Reminder</button>
        <ul id="reminderList"></ul>
    `;
    displayReminders();
}

function addReminder() {
    const reminderInput = document.getElementById('reminderInput').value.trim();
    const reminderTime = document.getElementById('reminderTime').value;

    if (!reminderInput || !reminderTime) {
        alert("Please enter reminder content and time!");
        return;
    }

    const newReminder = {
        text: reminderInput,
        time: reminderTime,
        completed: false,
        urgent: false,
    };

    reminders.push(newReminder);
    document.getElementById('reminderInput').value = "";
    document.getElementById('reminderTime').value = "";
    displayReminders();
    saveData(); // Save after adding new reminder
}

function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';

    reminders.forEach((reminder, index) => {
        const li = createTaskItem(reminder, index, "reminder");
        reminderList.appendChild(li);
    });
}

// Load To-Do Module
function loadTodoModule(container) {
    container.innerHTML = `
        <h2>To-Do List</h2>
        <ul id="todoList"></ul>
    `;
    displayTodos();
}

function displayTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos
        .filter(task => !task.completed)
        .forEach((task, index) => {
            const li = createTaskItem(task, index, "todo");
            todoList.appendChild(li);
        });
}

// Display Urgent Tasks
function showUrgentTasks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>Urgent Tasks</h2>
        <ul id="urgentList"></ul>
    `;
    displayUrgentTasks();
}

function displayUrgentTasks() {
    const urgentList = document.getElementById('urgentList');
    urgentList.innerHTML = '';

    urgentTasks.forEach((task, index) => {
        const li = createTaskItem(task, index, "urgent");
        urgentList.appendChild(li);
    });
}

// Task Item
function createTaskItem(task, index, type) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = `${task.text} - ${new Date(task.time).toLocaleString()}`;
    if (task.completed) {
        taskText.classList.add('completed');
    }

    const markBtn = document.createElement('button');
    markBtn.className = 'mark-btn';
    markBtn.textContent = task.completed ? 'Incomplete' : 'Complete';
    markBtn.onclick = () => toggleCompletion(task, index, type);

    const urgentBtn = document.createElement('button');
    urgentBtn.className = 'urgent-btn';
    urgentBtn.textContent = task.urgent ? 'Remove Urgent' : 'Mark Urgent';
    urgentBtn.onclick = () => toggleUrgent(task, index, type);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index, type);

    li.appendChild(taskText);
    li.appendChild(markBtn);
    li.appendChild(urgentBtn);
    li.appendChild(deleteBtn);

    return li;
}

// Toggle completion
function toggleCompletion(task, index, type) {
    task.completed = !task.completed;
    updateList(type);
    saveData(); // Save changes
}


// Toggle urgency
function toggleUrgent(task, index, type) {
    task.urgent = !task.urgent;
    if (task.urgent) {
        urgentTasks.push(task);
    } else {
        urgentTasks = urgentTasks.filter((t) => t !== task);
    }
    updateList(type);
    saveData(); // Save changes
}

// Delete task
function deleteTask(index, type) {
  if (type === 'memo') todos.splice(index, 1);
 else if (type === 'reminder') reminders.splice(index, 1);
    else if (type === 'urgent') urgentTasks.splice(index, 1);

   else if (type === 'family') familyTasks.splice(index, 1);
        
     else if (type === 'work') workTasks.splice(index, 1);
       
    updateList(type);

    saveData();//
}
// Update the list
function updateList(type) {
    if (type === 'memo') displayMemos();
    else if (type === 'reminder') displayReminders();
    else if (type === 'urgent') displayUrgentTasks();
    else if (type === 'todo') displayTodos();
    else if (type === 'family') displayFamilyTasks();
    else if (type === 'work') displayWorkTasks();
}


// Load initial data
loadData();
updateLanguage();
showModule('memo');  // Start with memo module
refreshDisplay('memo');

// Event listeners
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
document.getElementById('btn-memo').addEventListener('click', () => showModule('memo'));
document.getElementById('btn-reminder').addEventListener('click', () => showModule('reminder'));
document.getElementById('btn-todo').addEventListener('click', () => showModule('todo'));
document.getElementById('btn-family').addEventListener('click', () => showModule('family'));
document.getElementById('btn-work').addEventListener('click', () => showModule('work'));
document.getElementById('btn-urgent').addEventListener('click', showUrgentTasks);
