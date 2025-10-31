// custom-renderer.js (v2.3 - Carga por Categoría)

// Botón de cierre
document.getElementById('close-btn').addEventListener('click', () => {
    window.electronCustom.closeWindow();
});

// Función para obtener los IDs de los checkboxes marcados
function getSelectedTweaks() {
    const checkboxes = document.querySelectorAll('#categories-container input[type="checkbox"]:checked');
    const ids = Array.from(checkboxes)
        .map(cb => cb.value)
        .filter(val => val !== 'select-all'); 
    return ids;
}

// Función para guardar el estado actual
function saveCurrentState() {
    const idsToSave = getSelectedTweaks();
    window.electronCustom.saveTweakState(idsToSave);
}

// Actualiza el estado (marcado, desmarcado, o mixto) del checkbox de la cabecera
function updateHeaderCheckbox(listContainer, headerCheckbox) {
    const allCheckboxes = listContainer.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = listContainer.querySelectorAll('input[type="checkbox"]:checked');
    
    if (allCheckboxes.length === 0) {
        headerCheckbox.checked = false;
        headerCheckbox.indeterminate = false; 
    } else if (checkedCheckboxes.length === 0) {
        headerCheckbox.checked = false;
        headerCheckbox.indeterminate = false; 
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
        headerCheckbox.checked = true;
        headerCheckbox.indeterminate = false; 
    } else {
        headerCheckbox.checked = false;
        headerCheckbox.indeterminate = true; // Estado mixto
    }
}

// --- INICIO: LÓGICA DE CARGA DE TWEAKS MODIFICADA ---

// Esta nueva función se llama cuando la página HTML está lista
async function loadAndRenderTweaks() {
    
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    try {
        // 1. Pide solo la lista de categorías (muy rápido)
        const categories = await window.electronCustom.getCategories();
        
        // 2. Pide el estado guardado (tweaks marcados)
        const savedTweakIds = await window.electronCustom.loadTweakState();

        // 3. Recorre cada categoría y pide sus tweaks uno por uno
        for (const category of categories) {
            
            // 4. Pide los tweaks solo para esta categoría (muy rápido)
            const tweaks = await window.electronCustom.getTweaksForCategory(category);
            
            // 5. Dibuja esta categoría (el código de antes)
            const categoryBox = document.createElement('div');
            categoryBox.className = 'category-box';
            
            const header = document.createElement('div');
            header.className = 'category-header';
            header.classList.add(`header-${category.toLowerCase()}`);

            const list = document.createElement('div');
            list.className = 'tweaks-list';

            const headerCheckboxLabel = document.createElement('label');
            headerCheckboxLabel.className = 'category-select-all';
            
            const headerCheckbox = document.createElement('input');
            headerCheckbox.type = 'checkbox';
            headerCheckbox.title = 'Seleccionar/Deseleccionar todo en esta categoría';
            headerCheckbox.value = 'select-all'; 

            const headerSpan = document.createElement('span');
            headerSpan.textContent = category.toUpperCase().replace('_', ' ');

            headerCheckboxLabel.appendChild(headerCheckbox);
            headerCheckboxLabel.appendChild(headerSpan);
            
            header.appendChild(headerCheckboxLabel);

            tweaks.forEach(tweak => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = tweak.id;
                checkbox.value = tweak.id;

                if (savedTweakIds && savedTweakIds.includes(tweak.id)) {
                    checkbox.checked = true;
                }
                
                checkbox.addEventListener('click', () => {
                    updateHeaderCheckbox(list, headerCheckbox);
                });

                const span = document.createElement('span');
                span.textContent = tweak.message;
                
                label.appendChild(checkbox);
                label.appendChild(span);
                list.appendChild(label);
            });

            headerCheckbox.addEventListener('click', () => {
                const allCheckboxesInList = list.querySelectorAll('input[type="checkbox"]');
                allCheckboxesInList.forEach(cb => {
                    cb.checked = headerCheckbox.checked;
                });
                updateHeaderCheckbox(list, headerCheckbox);
            });

            updateHeaderCheckbox(list, headerCheckbox);

            categoryBox.appendChild(header);
            categoryBox.appendChild(list);
            container.appendChild(categoryBox); // Añade la categoría terminada al DOM
        }
    } catch (err) {
        console.error("Error fatal al cargar categorías o tweaks:", err);
        container.innerHTML = `<h2 style="color: #ff5050; text-align: center; margin-top: 20px;">Error al cargar tweaks</h2><p style="text-align: center; color: #ccc;">No se pudo comunicar con el proceso principal. Revisa la consola.</p>`;
    }
}

// Ejecuta la función de carga cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', loadAndRenderTweaks);

// --- FIN: LÓGICA DE CARGA DE TWEAKS MODIFICADA ---


// --- Listeners Botones Principales (Aplicar/Revertir) ---
// (No cambian, 'applyTweaks' ahora solo envía los IDs)
document.getElementById('apply-btn').addEventListener('click', () => {
    const ids = getSelectedTweaks();
    if (ids.length > 0) {
        saveCurrentState();
        window.electronCustom.applyTweaks(ids);
    } else {
        saveCurrentState(); 
    }
});

document.getElementById('revert-btn').addEventListener('click', () => {
    const ids = getSelectedTweaks();
    if (ids.length > 0) {
        saveCurrentState();
        window.electronCustom.revertTweaks(ids);
    } else {
        saveCurrentState();
    }
});


// --- Listeners Botones Globales (Seleccionar/Deseleccionar) ---
document.getElementById('select-all-btn').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#categories-container .tweaks-list input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    
    const headerCheckboxes = document.querySelectorAll('#categories-container .category-header input[type="checkbox"]');
    headerCheckboxes.forEach(cb => {
        cb.checked = true;
        cb.indeterminate = false;
    });
});

document.getElementById('deselect-all-btn').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#categories-container .tweaks-list input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    const headerCheckboxes = document.querySelectorAll('#categories-container .category-header input[type="checkbox"]');
    headerCheckboxes.forEach(cb => {
        cb.checked = false;
        cb.indeterminate = false;
    });
});