const newTaskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterAllBtn = document.getElementById("filter-all");
const filterPendingBtn = document.getElementById("filter-pending");
const filterCompletedBtn = document.getElementById("filter-completed");
const clearCompletedBtn = document.getElementById("clear-completed");
const taskCounter = document.getElementById("task-counter");

addTaskBtn.addEventListener("click", addTask);
filterAllBtn.addEventListener("click", () => filterTasks("all"));
filterPendingBtn.addEventListener("click", () => filterTasks("pending"));
filterCompletedBtn.addEventListener("click", () => filterTasks("completed"));
clearCompletedBtn.addEventListener("click", clearCompletedTasks);

function addTask() {
  const taskText = newTaskInput.value.trim();

  if (taskText === "") {
    alert("Por favor, insira uma tarefa.");
    return;
  }
  if (isDuplicate(taskText)) {
    alert("Esta tarefa já foi adicionada.");
    return;
  }

  const taskItem = document.createElement("li");
  const taskTextElement = document.createElement("span");
  taskTextElement.textContent = taskText;

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Concluir";
  completeBtn.classList.add("complete-btn");
  completeBtn.addEventListener("click", function () {
    taskItem.classList.toggle("completed");
    saveTasks();
    updateTaskCounter();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    const newText = prompt("Editar tarefa:", taskTextElement.textContent);
    if (newText) {
      taskTextElement.textContent = newText;
      saveTasks();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Excluir";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    taskItem.remove();
    saveTasks();
    updateTaskCounter();
  });

  taskActions.append(completeBtn, editBtn, deleteBtn);

  taskItem.append(taskTextElement, taskActions);
  taskList.appendChild(taskItem);

  newTaskInput.value = "";

  saveTasks();
  updateTaskCounter();
}

function isDuplicate(taskText) {
  const tasks = taskList.querySelectorAll("li span");
  for (let task of tasks) {
    if (task.textContent === taskText) {
      return true;
    }
  }
  return false;
}

function filterTasks(filter) {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "pending":
        task.classList.contains("completed")
          ? (task.style.display = "none")
          : (task.style.display = "flex");
        break;
      case "completed":
        task.classList.contains("completed")
          ? (task.style.display = "flex")
          : (task.style.display = "none");
        break;
    }
  });
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((task) => {
    tasks.push({
      text: task.querySelector(".task-text").textContent,
      completed: task.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = task.text;

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Concluir";
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", function () {
      taskItem.classList.toggle("completed");
      saveTasks();
      updateTaskCounter();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
      const newText = prompt("Editar tarefa:", taskTextElement.textContent);
      if (newText) {
        taskTextElement.textContent = newText;
        saveTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      taskItem.remove();
      saveTasks();
      updateTaskCounter();
    });

    taskActions.append(completeBtn, editBtn, deleteBtn);
    taskItem.append(taskTextElement, taskActions);
    taskList.appendChild(taskItem);
  });

  updateTaskCounter();
}

function updateTaskCounter() {
  const tasks = taskList.querySelectorAll("li");
  let pendingCount = 0;
  let completedCount = 0;

  tasks.forEach((task) => {
    if (task.classList.contains("completed")) {
      completedCount++;
    } else {
      pendingCount++;
    }
  });

  taskCounter.textContent = `Pendentes: ${pendingCount} | Concluídas: ${completedCount}`;
}

function clearCompletedTasks() {
  const completedTasks = taskList.querySelectorAll("li.completed");
  completedTasks.forEach((task) => task.remove());
  saveTasks();
  updateTaskCounter();
}
loadTasks();
updateTaskCounter();
