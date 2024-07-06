document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display projects
    fetch('/projects')
        .then(response => response.json())
        .then(data => {
            const projectList = document.getElementById('projects');
            const projectSelect = document.getElementById('project-select');
            data.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.classList.add('project');
                projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <button onclick="showTasks('${project.id}')">Show Tasks</button>
          `;
                projectList.appendChild(projectElement);

                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.title;
                projectSelect.appendChild(option);
            });
        });

    // Handle project form submission
    const projectForm = document.getElementById('project-form');
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(projectForm);
        const project = {
            title: formData.get('title'),
            description: formData.get('description')
        };

        fetch('/create-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            })
            .then(response => response.text())
            .then(message => {
                alert(message);
                location.reload();
            });
    });

    // Handle task form submission
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const task = {
            title: formData.get('taskTitle'),
            deadline: formData.get('deadline')
        };
        const projectId = formData.get('projectId');

        fetch('/add-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId, task })
            })
            .then(response => response.text())
            .then(message => {
                alert(message);
                location.reload();
            });
    });

    // Fetch and display tasks for selected project
    const showTasks = (projectId) => {
        fetch(`/tasks?projectId=${projectId}`)
            .then(response => response.json())
            .then(tasks => {
                const taskList = document.getElementById('tasks');
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
              <h3>${task.title}</h3>
              <p>Deadline: ${task.deadline}</p>
              <p>Status: ${task.status}</p>
              <select onchange="updateTaskStatus('${projectId}', '${task.id}', this.value)">
                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
              </select>
            `;
                    taskList.appendChild(taskElement);
                });
            });
    };

    window.showTasks = showTasks;

    // Update task status
    window.updateTaskStatus = (projectId, taskId, status) => {
        fetch('/update-task-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId, taskId, status })
            })
            .then(response => response.text())
            .then(message => {
                alert(message);
                showTasks(projectId);
            });
    };
});