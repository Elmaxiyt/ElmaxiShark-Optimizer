// custom-renderer.js (v1.6.5 - FIX FINAL: Listener de Cierre Asegurado)

const container = document.getElementById('categories-container');
let currentStrings = {};

// CORRECCIÓN FINAL: Asegurar que el listener del botón 'X' se dispara inmediatamente.
// El botón con id 'close-btn' debe enviar el mensaje al main process.
document.getElementById('close-btn').addEventListener('click', () => window.electronCustom.closeWindow());

async function initCustomWindow() {
    // Aseguramos que el puente existe
    if (!window.electronCustom) {
        console.error("FATAL: electronCustom no existe");
        return;
    }

    try {
        // 1. Cargar Idioma
        const langData = await window.electronCustom.getLanguage();
        currentStrings = langData.strings || {};
        applyStaticTranslations();

        // 2. Cargar Categorías
        const categories = await window.electronCustom.getCategories();
        if (!categories || categories.length === 0) {
            throw new Error("No se recibieron categorías.");
        }

        // 3. Cargar Estados
        const savedState = await window.electronCustom.loadTweakState() || [];
        const activeMode = await window.electronCustom.getTweaksForActiveMode() || [];
        const activeSet = new Set([...savedState, ...activeMode]);

        container.innerHTML = '';

        for (const cat of categories) {
            const tweaks = await window.electronCustom.getTweaksForCategory(cat);
            if (!tweaks || tweaks.length === 0) continue;

            const box = document.createElement('div');
            box.className = 'category-box';
            const catName = currentStrings[`cat_${cat}`] || cat.toUpperCase();

            box.innerHTML = `<div class="category-header header-${cat}">
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
        console.error("Error Custom:", e);
        container.innerHTML = `<p style="color: #ff5050; padding: 20px; text-align: center;">
            ERROR AL CARGAR EL MENÚ<br>
            <span style="font-size: 12px; color: #ccc;">${e.message}</span>
        </p>`;
    }
}

function applyStaticTranslations() {
    if (currentStrings.custom_title) document.querySelector('h2').textContent = currentStrings.custom_title;
    if (currentStrings.custom_subtitle) document.querySelector('.subtitle').textContent = currentStrings.custom_subtitle;
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
            headerCb.checked = (checkedCount === tweakCbs.length && tweakCbs.length > 0);
            headerCb.indeterminate = (checkedCount > 0 && checkedCount < tweakCbs.length);
        };
        syncHeader();
        headerCb.addEventListener('change', () => { tweakCbs.forEach(cb => cb.checked = headerCb.checked); saveState(); });
        tweakCbs.forEach(cb => { cb.addEventListener('change', () => { syncHeader(); saveState(); }); });
    });
}

function saveState() {
    window.electronCustom.saveTweakState(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value));
}

document.getElementById('apply-btn').addEventListener('click', () => window.electronCustom.applyTweaks(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value)));
document.getElementById('revert-btn').addEventListener('click', () => window.electronCustom.revertTweaks(Array.from(document.querySelectorAll('.tweak-checkbox:checked')).map(cb => cb.value)));
document.getElementById('select-all-btn').addEventListener('click', () => { document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; cb.indeterminate = false; }); saveState(); });
document.getElementById('deselect-all-btn').addEventListener('click', () => { document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; cb.indeterminate = false; }); saveState(); });

initCustomWindow();

if (window.electronCustom?.on) {
    window.electronCustom.on('set-language', (strings) => {
        currentStrings = strings;
        initCustomWindow();
    });
}