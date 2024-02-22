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
    editSymbol.classList.add("edit-symbol");
    editSymbol.addEventListener("click", () => editTask(li));

    const deleteSymbol = document.createElement("span");
    deleteSymbol.innerHTML = "\u00d7";
    deleteSymbol.classList.add("delete-symbol");
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

const editTask = (task) => {
    const textContainer = task.querySelector(".task-text");
    const currentText = textContainer.textContent;
    const categoryIndex = currentText.lastIndexOf('-');
    
    const newText = prompt("Modifier la tâche:", currentText.substring(0, categoryIndex).trim());
    
    if (newText !== null) {
        textContainer.textContent = `${newText} - ${currentText.substring(categoryIndex + 1).trim()}`;
        savedata();
    }
};

listContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-text")) {
        const task = e.target.parentElement;
        task.classList.toggle("checked");
        savedata();
    } else if (e.target.classList.contains("edit-symbol")) {
        const task = e.target.closest("li");
        editTask(task);
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
        
        const deleteSymbol = task.querySelector(".delete-symbol");
        const editSymbol = task.querySelector(".edit-symbol");

        if (deleteSymbol) {
            deleteSymbol.addEventListener("click", () => removeTask(task));
        }
        
        if (editSymbol) {
            editSymbol.addEventListener("click", () => editTask(task));
        }
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

            errorMessage.textContent = ""; 
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
    errorMessage.textContent = ""; 
};

