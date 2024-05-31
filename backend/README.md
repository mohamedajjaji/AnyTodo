# AnyTodo - Manage Tasks

AnyTodo is a modern, user-friendly to-do list application designed to help users manage tasks efficiently.

![AnyTodo](/assets/AnyTodo.png)

## Introduction

AnyTodo utilizes modern web technologies for both the backend and frontend:

### Backend Technologies:
- **Django:** Web framework used for developing the backend.
- **Django Rest Framework (DRF):** Toolkit for building Web APIs.
- **MySQL:** Relational database management system used for data storage.
- **Redis:** In-memory data structure store, used as a cache.
- **JWT (JSON Web Tokens):** Used for authentication.

### Frontend Technologies:
- **React:** JavaScript library for building user interfaces.
- **React Router:** Library for routing in React applications.
- **Axios:** Promise-based HTTP client for making API requests.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **React Icons:** Library for including icons in React projects.
- **React Dropzone:** Library for file upload via drag-and-drop.
- **DatePicker:** React library for date and time picking.
- **Day.js:** Lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
- **React Transition Group:** Animations library for React.
- **CSSTransition:** A component from React Transition Group for applying CSS transitions.

## Installation

To get started with AnyTodo, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/mohamedajjaji/AnyTodo.git
    cd AnyTodo
    ```

3. Install backend dependencies and start the Django server:

    Create a virtual environment:

    ```bash
    python venv venv
    venv\Scripts\activate
    ```

    Then install dependencies and run the server:

    ```bash
    cd backend
    pip install -r requirements.txt
    python manage.py runserver 
    ```

4. Install frontend dependencies and start the development server:

    ```bash
    cd frontend
    npm install
    npm start
    ```

## Usage

Once the servers are running, you can access AnyTodo at http://localhost:3000 for the frontend and http://localhost:8000 for the backend.

# Connect with Me

You can find me on various platforms:

- **LinkedIn:** [mohamedajjaji](https://www.linkedin.com/in/mohamedajjaji)
- **Twitter:** [mohamedajjaji](https://twitter.com/mohamedajjaji)

Feel free to reach out to me on any of these platforms!

## Licensing

AnyTodo is licensed under the [The MIT License (MIT)](LICENSE).