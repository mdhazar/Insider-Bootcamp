const form = document.querySelector("form");
const taskInput = document.getElementById("task");
const descInput = document.getElementById("desc");
const priorityRadios = document.querySelectorAll("input[name='priority']");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterSelect = document.getElementById("filter");

let tasks = [];

addTaskButton.addEventListener("click", handleAddTask);
taskList.addEventListener("click", handleTaskActions);
filterSelect.addEventListener("change", filterTasks);

// Handle adding task
function handleAddTask() {
  try {
    if (!taskInput.value.trim()) {
      showError("Task name cannot be empty!");
      return;
    }

    const selectedPriority = getSelectedPriority();
    if (!selectedPriority) {
      showError("Please select a priority!");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskInput.value.trim(),
      description: descInput.value.trim(),
      priority: selectedPriority,
      completed: false,
      createdAt: new Date(),
    };

    tasks.push(newTask);
    renderTask(newTask);
    resetForm();
  } catch (error) {
    showError("An unexpected error occurred. Please try again.");
  }
}

// Get selected priority
function getSelectedPriority() {
  const selectedRadio = document.querySelector(
    "input[name='priority']:checked"
  );
  return selectedRadio ? selectedRadio.value : null;
}

// Render a task
function renderTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.className = task.completed ? "completed" : "";

  li.innerHTML = `
    <div class="task-container">
        <div class="task-content priority-${task.priority}">
        <h3>${task.name}</h3>
        <p>${task.description || "No description"}</p>
        <span class="priority-badge">${task.priority}</span>
        </div>
        <div class="task-actions">
        <button class="complete-btn">${
          task.completed ? "Undo" : "Complete"
        }</button>
        <button class="delete-btn">Delete</button>
        </div>
    </div>
  `;

  if (task.completed) {
    li.querySelector(".task-content").style.backgroundColor =
      "rgba(0, 255, 0, 0.2)";
  }

  taskList.appendChild(li);
}

// Handle task actions with event delegation
function handleTaskActions(event) {
  event.stopPropagation();

  const target = event.target;
  const taskItem = target.closest("li");
  if (!taskItem) return;

  const taskId = parseInt(taskItem.dataset.id);

  if (target.classList.contains("complete-btn")) {
    toggleTaskCompletion(taskId, taskItem);
  }

  if (target.classList.contains("delete-btn")) {
    deleteTask(taskId, taskItem);
  }
}

// Toggle task status
function toggleTaskCompletion(taskId, taskElement) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].completed = !tasks[taskIndex].completed;

  const taskContent = taskElement.querySelector(".task-content");
  const completeBtn = taskElement.querySelector(".complete-btn");

  if (tasks[taskIndex].completed) {
    taskElement.classList.add("completed");
    taskContent.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
    completeBtn.textContent = "Undo";
  } else {
    taskElement.classList.remove("completed");
    taskContent.style.backgroundColor = "";
    completeBtn.textContent = "Complete";
  }
}

// Delete a task
function deleteTask(taskId, taskElement) {
  tasks = tasks.filter((task) => task.id !== taskId);
  taskElement.remove();
}

// Filter tasks
function filterTasks() {
  const filterValue = filterSelect.value;
  const taskItems = taskList.querySelectorAll("li");

  taskItems.forEach((item) => {
    if (filterValue === "all" || item.dataset.priority === filterValue) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Display error message
function showError(message) {
  let errorElement = document.querySelector(".error-message");

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    form.parentNode.insertBefore(errorElement, form);
  }

  errorElement.textContent = message;
  errorElement.style.color = "red";

  setTimeout(() => {
    errorElement.textContent = "";
  }, 3000);
}

// Reset form inputs
function resetForm() {
  taskInput.value = "";
  descInput.value = "";
  priorityRadios.forEach((radio) => (radio.checked = false));
}
