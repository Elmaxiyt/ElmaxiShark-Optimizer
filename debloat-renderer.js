// debloat-renderer.js (v1.1 - FIX: Select All excluye Rescate)

const container = document.getElementById('categories-container');
let currentStrings = {};

// Lista de IDs que NO se deben marcar al dar a "Seleccionar Todo"
const EXCLUDED_FROM_SELECT_ALL = ['uwp_restore_all', 'uwp_restore_store'];

document.getElementById('close-btn').addEventListener('click', () => window.electronDebloat.closeWindow());

async function initDebloatWindow() {
    if (!window.electronDebloat) {
        console.error("FATAL: electronDebloat no existe");
        return;
    }

    try {
        const langData = await window.electronDebloat.getLanguage();
        currentStrings = langData.strings || {};
        applyStaticTranslations();

        const categories = await window.electronDebloat.getCategories();
        if (!categories || categories.length === 0) {
            throw new Error("No se recibieron categorías de Debloat.");
        }

        const savedState = await window.electronDebloat.loadTweakState() || [];
        const activeSet = new Set(savedState);

        container.innerHTML = '';

        const headerClasses = {
            'ia_antispy': 'header-ia_antispy',
            'ads_suggestions': 'header-ads_suggestions',
            'ui_shell': 'header-ui_shell',
            'explorador': 'header-explorador',
            'uwp_debloat': 'header-uwp_debloat'
        };

        for (const cat of categories) {
            const tweaks = await window.electronDebloat.getTweaksForCategory(cat);
            if (!tweaks || tweaks.length === 0) continue;

            const box = document.createElement('div');
            box.className = 'category-box';
            const catName = currentStrings[`cat_${cat}`] || cat.toUpperCase();
            const headerClass = headerClasses[cat] || '';

            // El checkbox del header también debe saber si excluir cosas, pero para simplificar,
            // al marcarlo manualmente seleccionará todo lo visible de esa categoría.
            box.innerHTML = `<div class="category-header ${headerClass}">
                                <label class="category-select-all">
                                    <input type="checkbox" class="header-checkbox" value="select-all">
                                    <span>${catName}</span>
                                </label>
                             </div>`;
            
            const list = document.createElement('div');
            list.className = 'tweaks-list';

            tweaks.forEach(tweak => {
                const div = document.createElement('div');
                div.className = 'tweak-item';
                const isChecked = activeSet.has(tweak.id) ? 'checked' : '';
                const translatedMessage = currentStrings[tweak.id] || tweak.message;

                div.innerHTML = `<input type="checkbox" id="${tweak.id}" value="${tweak.id}" class="tweak-checkbox" ${isChecked}>
                                 <label for="${tweak.id}">${translatedMessage}</label>`;
                list.appendChild(div);
            });

            box.appendChild(list);
            container.appendChild(box);
        }
        attachCheckboxListeners();

    } catch (e) {
        console.error("Error al cargar la ventana de Debloat:", e);
        container.innerHTML = `<p style="color: #ff5050; padding: 20px; text-align: center;">
            ERROR AL CARGAR EL MENÚ DE DEBLOAT<br>
            <span style="font-size: 12px; color: #ccc;">${e.message}</span>
        </p>`;
    }
}

function applyStaticTranslations() {
    if (currentStrings.debloat_title) document.querySelector('h2').textContent = currentStrings.debloat_title;
    if (currentStrings.debloat_subtitle) document.querySelector('.subtitle').textContent = currentStrings.debloat_subtitle;
    if (currentStrings.btn_apply_selected) document.getElementById('apply-btn').textContent = currentStrings.btn_apply_selected;
    if (currentStrings.btn_revert_selected) document.getElementById('revert-btn').textContent = currentStrings.btn_revert_selected;
    if (currentStrings.btn_select_all) document.getElementById('select-all-btn').textContent = currentStrings.btn_select_all;
    if (currentStrings.btn_deselect_all) document.getElementById('deselect-all-btn').textContent = currentStrings.btn_deselect_all;
}

function attachCheckboxListeners() {
    document.querySelectorAll('.category-box').forEach(box => {
        const headerCb = box.querySelector('.header-checkbox');
        const tweakCbs = box.querySelectorAll('.tweak-checkbox');
        
        const syncHeader = () => {
            const checkedCount = box.querySelectorAll('.tweak-checkbox:checked').length;
            // Si todos están marcados (o todos menos los excluidos si estamos en esa categoría)
            headerCb.checked = (checkedCount === tweakCbs.length && tweakCbs.length > 0);
            headerCb.indeterminate = (checkedCount > 0 && checkedCount < tweakCbs.length);
        };
        
        syncHeader();

        // Header Checkbox: Marca/Desmarca todos los de su caja
        headerCb.addEventListener('change', () => { 
            tweakCbs.forEach(cb => {
                // Si es un botón de rescate, NO lo marcamos con el header tampoco por seguridad
                if (!EXCLUDED_FROM_SELECT_ALL.includes(cb.value)) {
                    cb.checked = headerCb.checked;
                }
            }); 
            saveState(); 
        });

        tweakCbs.forEach(cb => { cb.addEventListener('change', () => { syncHeader(); saveState(); }); });
    });
}

function saveState() {
    window.electronDebloat.saveTweakState(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value));
}

document.getElementById('apply-btn').addEventListener('click', () => {
    window.electronDebloat.applyTweaks(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value));
});
document.getElementById('revert-btn').addEventListener('click', () => {
    window.electronDebloat.revertTweaks(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value));
});

// --- LÓGICA MODIFICADA: SELECCIONAR TODO ---
document.getElementById('select-all-btn').addEventListener('click', () => { 
    document.querySelectorAll('.tweak-checkbox').forEach(cb => { 
        // Solo marcamos si NO está en la lista de excluidos
        if (!EXCLUDED_FROM_SELECT_ALL.includes(cb.value)) {
            cb.checked = true; 
        } else {
            cb.checked = false; // Aseguramos que Rescate esté desmarcado
        }
    }); 
    // Actualizamos visualmente los headers
    document.querySelectorAll('.category-box').forEach(box => {
        const headerCb = box.querySelector('.header-checkbox');
        const tweakCbs = box.querySelectorAll('.tweak-checkbox');
        const checkedCount = box.querySelectorAll('.tweak-checkbox:checked').length;
        // Si la categoría tiene botones de rescate, el header se quedará "indeterminado" (guión), lo cual es correcto visualmente
        headerCb.checked = (checkedCount === tweakCbs.length);
        headerCb.indeterminate = (checkedCount > 0 && checkedCount < tweakCbs.length);
    });
    saveState(); 
});

document.getElementById('deselect-all-btn').addEventListener('click', () => { 
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; }); 
    saveState(); 
});

initDebloatWindow();

if (window.electronDebloat?.on) {
    window.electronDebloat.on('set-language', (strings) => {
        currentStrings = strings;
        initDebloatWindow();
    });
}