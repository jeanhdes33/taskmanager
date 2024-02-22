const inputBox = document.getElementById('inputbox');
const listContainer = document.getElementById('listcontainer');
const darkModeToggle = document.getElementById('darkModeToggle');
const container = document.querySelector('.container');
const categorySelect = document.getElementById('categorySelect');

const addTask = () => {
    const inputValue = inputBox.value.trim();
    if (inputValue === '') {
        alert("Il faut écrire quelque chose !");
        return;
    }

    const li = document.createElement("li");

    const textDiv = document.createElement("div");
    const category = categorySelect.value || "travail";
    textDiv.textContent = `${inputValue} - ${category}`;
    textDiv.classList.add("task-text");

    li.dataset.category = category;

    const symbolsDiv = document.createElement("div");

    const editSymbol = document.createElement("span");
    editSymbol.innerHTML = "\u21BA";
    editSymbol.addEventListener("click", () => editTask(textDiv));

    const deleteSymbol = document.createElement("span");
    deleteSymbol.innerHTML = "\u00d7";
    deleteSymbol.addEventListener("click", () => removeTask(li));

    symbolsDiv.appendChild(editSymbol);
    symbolsDiv.appendChild(deleteSymbol);

    li.appendChild(textDiv);
    li.appendChild(symbolsDiv);

    listContainer.appendChild(li);

    inputBox.value = "";
    savedata();
};

const removeTask = (task) => {
    task.remove();
    savedata();
};

const editTask = (textContainer) => {
    const newText = prompt("Modifier la tâche:", textContainer.textContent);
    if (newText !== null) {
        textContainer.textContent = newText;
        savedata();
    }
};

listContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-text")) {
        const taskText = e.target;
        taskText.parentElement.classList.toggle("checked");
        savedata();
    } else if (e.target.classList.contains("edit-symbol")) {
        const task = e.target.closest("li");
        editTask(task.querySelector(".task-text"));
    } else if (e.target.classList.contains("delete-symbol")) {
        const task = e.target.closest("li");
        removeTask(task);
    }
}, false);

const savedata = () => {
    localStorage.setItem("data", listContainer.innerHTML);
};

const showtask = () => {
    listContainer.innerHTML = localStorage.getItem("data");

    const tasks = Array.from(document.querySelectorAll('#listcontainer li'));
    tasks.forEach((task) => {
        const { dataset: { category } } = task;
        task.setAttribute('category', category);
    });
};

showtask();

darkModeToggle.addEventListener('click', () => {
    container.classList.toggle('dark-mode');
    saveDarkModePreference(container.classList.contains('dark-mode'));
});

function applyDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    container.classList.toggle('dark-mode', isDarkMode);
}

function saveDarkModePreference(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode);
}

applyDarkModePreference();

const filterTasks = async (category) => {
    const errorMessage = document.getElementById('error-message');

    return new Promise((resolve, reject) => {
        const tasks = Array.from(document.querySelectorAll('#listcontainer li'));
        const categoryExists = tasks.some(task => task.dataset.category === category);

        if (categoryExists || category === 'all') {
            tasks.forEach(task => {
                const taskCategory = task.dataset.category;
                if (taskCategory === category || category === 'all') {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
            });

            errorMessage.textContent = ""; // Efface le message d'erreur s'il y en avait un précédemment.
            resolve("Filtrage réussi !");
        } else {
            errorMessage.textContent = "Aucune tâche dans cette catégorie n'existe";
            reject(new Error("Aucune tâche dans cette catégorie n'existe"));
        }
    });
};

const resetFilters = () => {
    const tasks = Array.from(document.querySelectorAll('#listcontainer li'));
    tasks.forEach(task => {
        task.style.display = 'flex';
    });

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ""; // Efface le message d'erreur.
};