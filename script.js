const currentDate = new Date().toISOString().slice(0, 10);

function loadTodos(date) {
    return JSON.parse(localStorage.getItem(`todos_${date}`)) || [];
}

function loadReminders() {
    return JSON.parse(localStorage.getItem('reminders')) || [];
}

function loadUrgentTasks() {
    return JSON.parse(localStorage.getItem('urgentTasks')) || [];
}

function saveTodos(date, todos) {
    localStorage.setItem(`todos_${date}`, JSON.stringify(todos));
}

function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function saveUrgentTasks(urgentTasks) {
    localStorage.setItem('urgentTasks', JSON.stringify(urgentTasks));
}

let todos = loadTodos(currentDate);
let reminders = loadReminders();
let urgentTasks = loadUrgentTasks();

function showModule(moduleName) {
    const mainContent = document.getElementById('main-content');

    if (moduleName === 'memo') {
        loadMemoModule();
    } else if (moduleName === 'reminder') {
        loadReminderModule();
    } else if (moduleName === 'todo') {
        loadTodoModule();
    } else {
        mainContent.innerHTML = '<p>请选择一个功能。</p>';
    }
}

// 备忘录模块
function loadMemoModule() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>备忘录</h2>
        <input type="text" id="memoInput" placeholder="输入你的备忘..." />
        <input type="datetime-local" id="memoTime" />
        <button onclick="addMemo()">添加</button>
        <ul id="memoList" class="memo-list"></ul>
    `;
    displayMemos();
}

function addMemo() {
    const memoInput = document.getElementById('memoInput');
    const memoTime = document.getElementById('memoTime').value;

    if (memoInput.value.trim() === "" || !memoTime) {
        alert("请填写内容和时间");
        return;
    }

    const memoItem = {
        text: memoInput.value.trim(),
        time: memoTime,
        completed: false,
        urgent: false
    };

    todos.push(memoItem);
    saveTodos(currentDate, todos);
    memoInput.value = "";
    displayMemos();
}

function displayMemos() {
    const memoList = document.getElementById('memoList');
    memoList.innerHTML = '';

    todos.forEach((memo, index) => {
        const memoItem = document.createElement('li');
        memoItem.className = 'task-item';

        const memoText = document.createElement('span');
        memoText.className = 'task-text';
        memoText.textContent = `${memo.text} - ${new Date(memo.time).toLocaleString()}`;
        if (memo.completed) {
            memoText.classList.add('completed');
        }

        const markBtn = document.createElement('button');
        markBtn.className = 'mark-btn';
        markBtn.textContent = memo.completed ? '未完成' : '完成';
        markBtn.onclick = () => toggleMemoComplete(index);

        const urgentBtn = document.createElement('button');
        urgentBtn.className = 'urgent-btn';
        urgentBtn.textContent = memo.urgent ? '取消紧急' : '设为紧急';
        urgentBtn.onclick = () => toggleUrgentStatus(memo, 'memo', index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.onclick = () => deleteMemo(index);

        memoItem.appendChild(memoText);
        memoItem.appendChild(markBtn);
        memoItem.appendChild(urgentBtn);
        memoItem.appendChild(deleteBtn);
        memoList.appendChild(memoItem);
    });
}

function toggleMemoComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos(currentDate, todos);
    displayMemos();
}

function deleteMemo(index) {
    todos.splice(index, 1);
    saveTodos(currentDate, todos);
    displayMemos();
}

// 紧急任务功能
function toggleUrgentStatus(task, type, index) {
    task.urgent = !task.urgent;

    if (task.urgent) {
        urgentTasks.push({ ...task, type });
    } else {
        urgentTasks = urgentTasks.filter(urgent => !(urgent.text === task.text && urgent.time === task.time));
    }

    if (type === 'memo') {
        saveTodos(currentDate, todos);
        displayMemos();
    } else {
        saveReminders(reminders);
        displayReminders();
    }
    saveUrgentTasks(urgentTasks);
}

// 事项提醒模块
function loadReminderModule() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>事项提醒</h2>
        <input type="text" id="reminderText" placeholder="输入提醒内容..." />
        <input type="datetime-local" id="reminderTime" />
        <button onclick="addReminder()">添加提醒</button>
        <ul id="reminderList" class="reminder-list"></ul>
    `;
    displayReminders();
}

function addReminder() {
    const reminderText = document.getElementById('reminderText').value;
    const reminderTime = document.getElementById('reminderTime').value;

    if (!reminderText || !reminderTime) {
        alert("请填写提醒内容和时间！");
        return;
    }

    const reminder = {
        text: reminderText,
        time: reminderTime,
        completed: false,
        urgent: false
    };

    reminders.push(reminder);
    saveReminders(reminders);
    displayReminders();
    setReminderAlarm(reminder);
}

function displayReminders() {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '';

    reminders.forEach((reminder, index) => {
        const reminderItem = document.createElement('li');
        reminderItem.className = 'task-item';

        const reminderText = document.createElement('span');
        reminderText.className = 'task-text';
        reminderText.textContent = `${reminder.text} - ${new Date(reminder.time).toLocaleString()}`;
        if (reminder.completed) reminderText.classList.add('completed');

        const markBtn = document.createElement('button');
        markBtn.className = 'mark-btn';
        markBtn.textContent = reminder.completed ? '未完成' : '完成';
        markBtn.onclick = () => toggleReminderComplete(index);

        const urgentBtn = document.createElement('button');
        urgentBtn.className = 'urgent-btn';
        urgentBtn.textContent = reminder.urgent ? '取消紧急' : '设为紧急';
        urgentBtn.onclick = () => toggleUrgentStatus(reminder, 'reminder', index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.onclick = () => deleteReminder(index);

        reminderItem.appendChild(reminderText);
        reminderItem.appendChild(markBtn);
        reminderItem.appendChild(urgentBtn);
        reminderItem.appendChild(deleteBtn);
        reminderList.appendChild(reminderItem);
    });
}

function toggleReminderComplete(index) {
    reminders[index].completed = !reminders[index].completed;
    saveReminders(reminders);
    displayReminders();
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    saveReminders(reminders);
    displayReminders();
}

function setReminderAlarm(reminder) {
    const reminderDate = new Date(reminder.time).getTime();
    const now = new Date().getTime();
    const delay = reminderDate - now;

    if (delay > 0) {
        setTimeout(() => {
            alert(`提醒: ${reminder.text}`);
            reminder.completed = true;
            saveReminders(reminders);
            displayReminders();
        }, delay);
    }
}

// 查看待办事项模块
function loadTodoModule() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>查看待办事项</h2>
        <ul id="taskList" class="task-list"></ul>
    `;
    displayAllTasks();
}

function displayAllTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    todos.forEach((task, index) => {
        if (!task.completed) {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = `${task.text} - ${new Date(task.time).toLocaleString()}`;

            const markBtn = document.createElement('button');
            markBtn.className = 'mark-btn';
            markBtn.textContent = '完成';
            markBtn.onclick = () => {
                task.completed = true;
                saveTodos(currentDate, todos);
                displayAllTasks();
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = () => {
                todos.splice(index, 1);
                saveTodos(currentDate, todos);
                displayAllTasks();
            };

            taskItem.appendChild(taskText);
            taskItem.appendChild(markBtn);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        }
    });
}

// 查看紧急任务
function showUrgentTasks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>紧急任务</h2>
        <ul id="urgentTaskList" class="urgent-task-list"></ul>
    `;
    displayUrgentTasks();
}

function displayUrgentTasks() {
    const urgentTaskList = document.getElementById('urgentTaskList');
    urgentTaskList.innerHTML = '';

    urgentTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = `${task.text} - ${new Date(task.time).toLocaleString()}`;
        if (task.completed) taskText.classList.add('completed');

        const markBtn = document.createElement('button');
        markBtn.className = 'mark-btn';
        markBtn.textContent = task.completed ? '未完成' : '完成';
        markBtn.onclick = () => {
            task.completed = !task.completed;
            saveUrgentTasks(urgentTasks);
            displayUrgentTasks();
            if (task.type === 'memo') saveTodos(currentDate, todos);
            else saveReminders(reminders);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.onclick = () => {
            urgentTasks.splice(index, 1);
            saveUrgentTasks(urgentTasks);
            displayUrgentTasks();
        };

        taskItem.appendChild(taskText);
        taskItem.appendChild(markBtn);
        taskItem.appendChild(deleteBtn);
        urgentTaskList.appendChild(taskItem);
    });
}

reminders.forEach(setReminderAlarm);


