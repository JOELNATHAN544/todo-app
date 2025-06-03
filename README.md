# 📝 Full-Stack Todo Application

A complete full-stack Todo List application that allows users to manage their tasks efficiently. The application features a modern frontend interface and a robust backend API with persistent data storage.

## 🎯 Features

- ✅ Add new tasks
- 📋 View list of tasks
- ✓ Mark tasks as completed
- 🗑️ Delete tasks
- 💾 Persistent data storage
- 🔄 Real-time updates

## 🏗️ Project Structure

### Frontend
- **Technology**: HTML, CSS, JavaScript
- **Location**: `/todo-frontend`
- **Features**:
  - Clean and intuitive user interface
  - Task input field with "Add Task" button
  - Dynamic task list with completion status
  - Real-time updates
  - REST API integration

### Backend
- **Technology**: Java (Spring Boot)
- **Location**: `/todo-backend`
- **Features**:
  - RESTful API endpoints
  - JPA for database operations
  - H2 database integration
  - Proper error handling

### Database
- **Technology**: H2 (In-memory)
- **Schema**:
  - `id`: Auto-generated unique identifier
  - `title`: Task description
  - `completed`: Boolean status flag

## 🔌 API Endpoints

- `GET /api/todos` - Fetch all tasks
- `POST /api/todos` - Create a new task
- `PUT /api/todos/{id}` - Update a task (mark as completed)
- `DELETE /api/todos/{id}` - Delete a task

## 🚀 Getting Started

### Prerequisites
- Java JDK 17 or higher
- Maven
- Modern web browser

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd todo-backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd todo-frontend
   ```
2. Open `index.html` in your web browser

## 🔄 How It Works

1. User opens the website
2. Frontend fetches existing tasks via GET /api/todos
3. User can:
   - Add new tasks (POST /api/todos)
   - Mark tasks as complete (PUT /api/todos/{id})
   - Delete tasks (DELETE /api/todos/{id})
4. All changes are persisted in the H2 database

## 🛠️ Future Improvements

- [ ] Switch to persistent database (MySQL/PostgreSQL)
- [ ] Add user authentication
- [ ] Implement task filtering
- [ ] Add task categories
- [ ] Improve error handling and user feedback
- [ ] Add task due dates
- [ ] Implement task search functionality

## 📚 Learning Resources

This project demonstrates:
- Full-stack application development
- REST API design and implementation
- Database integration with JPA
- Frontend-backend communication
- State management in JavaScript
- Modern web development practices

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

This project is open source and available under the MIT License. 