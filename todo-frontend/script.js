document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const loadingMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");
  const filterSelect = document.getElementById("filter-select");
  const dueDateInput = document.getElementById("due-date-input");
  const categorySelect = document.getElementById("category-select");
  const customCategoryInput = document.getElementById("custom-category-input");
  const searchInput = document.getElementById("search-input");

  const API_URL = "http://localhost:8081/api/todos";
  let tasks = [];

  // Auth elements
  const authSection = document.getElementById("auth-section");
  const logoutSection = document.getElementById("logout-section");
  const authUsername = document.getElementById("auth-username");
  const authPassword = document.getElementById("auth-password");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const authMessage = document.getElementById("auth-message");
  const currentUserSpan = document.getElementById("current-user");
  const container = document.querySelector(".container");

  const AUTH_API = "http://localhost:8081/api/auth";
  let currentUser = null;

  function showLoading() {
    loadingMessage.style.display = "block";
    errorMessage.style.display = "none";
  }

  function hideLoading() {
    loadingMessage.style.display = "none";
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }

  function showAuthMessage(msg) {
    authMessage.textContent = msg;
    authMessage.style.display = "block";
    setTimeout(() => {
      authMessage.style.display = "none";
    }, 3000);
  }

  function showAppUI(loggedIn) {
    if (loggedIn) {
      authSection.style.display = "none";
      container.style.display = "block";
      logoutSection.style.display = "block";
    } else {
      authSection.style.display = "block";
      container.style.display = "none";
      logoutSection.style.display = "none";
    }
  }

  function fetchMe() {
    return fetch(`${AUTH_API}/me`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(user => {
        currentUser = user;
        currentUserSpan.textContent = `Logged in as: ${user.username}`;
        showAppUI(true);
        loadTasks();
      })
      .catch(() => {
        currentUser = null;
        showAppUI(false);
      });
  }

  function loadTasks() {
    showLoading();
    fetchWithCreds(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        tasks = data;
        renderTasks(filterTasks());
        hideLoading();
      })
      .catch((err) => {
        hideLoading();
        showError(err.message);
      });
  }

  function filterTasks() {
    const filter = filterSelect.value;
    let filtered = tasks;
    switch (filter) {
      case "active":
        filtered = filtered.filter(task => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        break;
    }
    // Search filter
    const search = searchInput.value.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(task =>
        (task.title && task.title.toLowerCase().includes(search)) ||
        (task.category && task.category.toLowerCase().includes(search)) ||
        (task.dueDate && task.dueDate.toLowerCase().includes(search))
      );
    }
    return filtered;
  }

  function createTask(text, dueDate, category) {
    if (!text.trim()) {
      showError("Task cannot be empty");
      return;
    }
    showLoading();
    fetchWithCreds(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: text, completed: false, dueDate: dueDate || null, category: category || null }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create task");
        return loadTasks();
      })
      .catch((err) => {
        hideLoading();
        showError(err.message);
      });
  }

  function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    showLoading();
    fetchWithCreds(`${API_URL}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return loadTasks();
      })
      .catch((err) => {
        hideLoading();
        showError(err.message);
      });
  }

  function updateTask(id, updatedData) {
    showLoading();
    fetchWithCreds(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return loadTasks();
      })
      .catch((err) => {
        hideLoading();
        showError(err.message);
      });
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      const dueDateStr = task.dueDate ? `<span class='due-date'>Due: ${task.dueDate}</span>` : "";
      const categoryStr = task.category ? `<span class='category-label'>[${task.category}]</span>` : "";
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <span class="task-title">${task.title}</span>
        ${dueDateStr}
        ${categoryStr}
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
      `;

      // Toggle complete
      li.querySelector("input[type=checkbox]").addEventListener("change", () => {
        updateTask(task.id, { title: task.title, completed: !task.completed, dueDate: task.dueDate, category: task.category });
      });

      // Edit task
      li.querySelector(".edit-btn").addEventListener("click", () => {
        const newTitle = prompt("Edit task:", task.title);
        let newDueDate = task.dueDate || "";
        let newCategory = task.category || "";
        if (newTitle !== null) {
          newDueDate = prompt("Edit due date (YYYY-MM-DD):", newDueDate);
          newCategory = prompt("Edit category:", newCategory);
        }
        if (newTitle && newTitle.trim() && (newTitle !== task.title || newDueDate !== task.dueDate || newCategory !== task.category)) {
          updateTask(task.id, { title: newTitle.trim(), completed: task.completed, dueDate: newDueDate || null, category: newCategory || null });
        }
      });

      // Delete task
      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });
  }

  // Event Listeners
  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    let category = categorySelect.value;
    if (category === "Other") {
      category = customCategoryInput.value.trim();
      if (!category) {
        showError("Please enter a custom category.");
        return;
      }
    }
    if (text) {
      createTask(text, dueDate, category);
    taskInput.value = "";
      dueDateInput.value = "";
      categorySelect.value = "Work";
      customCategoryInput.value = "";
      customCategoryInput.style.display = "none";
    }
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  filterSelect.addEventListener("change", () => {
    renderTasks(filterTasks());
  });

  // Show/hide custom category input
  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "Other") {
      customCategoryInput.style.display = "inline-block";
    } else {
      customCategoryInput.style.display = "none";
      customCategoryInput.value = "";
    }
  });

  searchInput.addEventListener("input", () => {
    renderTasks(filterTasks());
  });

  loginBtn.addEventListener("click", () => {
    const username = authUsername.value.trim();
    const password = authPassword.value;
    fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.text().then(msg => ({ ok: res.ok, msg })))
      .then(({ ok, msg }) => {
        if (!ok) throw new Error(msg);
        fetchMe();
      })
      .catch(err => showAuthMessage(err.message));
  });

  registerBtn.addEventListener("click", () => {
    const username = authUsername.value.trim();
    const password = authPassword.value;
    fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.text().then(msg => ({ ok: res.ok, msg })))
      .then(({ ok, msg }) => {
        if (!ok) throw new Error(msg);
        showAuthMessage("Registration successful! Please log in.");
      })
      .catch(err => showAuthMessage(err.message));
  });

  logoutBtn.addEventListener("click", () => {
    fetch(`${AUTH_API}/logout`, {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        currentUser = null;
        showAppUI(false);
      });
  });

  // Override fetch for tasks to always send credentials
  function fetchWithCreds(url, options = {}) {
    return fetch(url, { ...options, credentials: "include" });
  }

  // On page load, check if logged in
  showAppUI(false);
  fetchMe();
});
