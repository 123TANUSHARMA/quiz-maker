const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let projects = [];

// Create a new project
app.post('/create-project', (req, res) => {
    const project = {...req.body, id: Date.now().toString(), tasks: [] };
    projects.push(project);
    res.send('Project created successfully');
});

// Get all projects
app.get('/projects', (req, res) => {
    res.json(projects);
});

// Add a task to a project
app.post('/add-task', (req, res) => {
    const { projectId, task } = req.body;
    const project = projects.find(proj => proj.id === projectId);
    if (project) {
        project.tasks.push({...task, id: Date.now().toString(), status: 'Pending' });
        res.send('Task added successfully');
    } else {
        res.status(404).send('Project not found');
    }
});

// Get tasks for a project
app.get('/tasks', (req, res) => {
    const projectId = req.query.projectId;
    const project = projects.find(proj => proj.id === projectId);
    if (project) {
        res.json(project.tasks);
    } else {
        res.status(404).send('Project not found');
    }
});

// Update task status
app.post('/update-task-status', (req, res) => {
    const { projectId, taskId, status } = req.body;
    const project = projects.find(proj => proj.id === projectId);
    if (project) {
        const task = project.tasks.find(task => task.id === taskId);
        if (task) {
            task.status = status;
            res.send('Task status updated successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } else {
        res.status(404).send('Project not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});