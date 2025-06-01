document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  let tasks = loadTasks();

  function loadTasks() {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span>${task.text}</span>
        <button class="delete-btn">❌</button>
      `;

      // Mark complete
      li.querySelector("span").addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      // Delete task
      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskList.appendChild(li);
    });
  }

  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  // Initial render
  renderTasks();
});
