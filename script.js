// Tipos de campos que requieren opciones
const FIELDS_WITH_OPTIONS = ['select', 'radio', 'checkbox'];

// Estado del formulario
let formState = {
    title: '',
    description: '',
    fields: []
};

// Referencias a elementos DOM
const elements = {
    addFieldsTab: document.getElementById('addFieldsTab'),
    previewTab: document.getElementById('previewTab'),
    addFieldsPanel: document.getElementById('addFieldsPanel'),
    previewPanel: document.getElementById('previewPanel'),
    fieldType: document.getElementById('fieldType'),
    fieldLabel: document.getElementById('fieldLabel'),
    fieldPlaceholder: document.getElementById('fieldPlaceholder'),
    fieldRequired: document.getElementById('fieldRequired'),
    optionsContainer: document.getElementById('optionsContainer'),
    optionsList: document.getElementById('optionsList'),
    addOption: document.getElementById('addOption'),
    addFieldBtn: document.getElementById('addFieldBtn'),
    formTitle: document.getElementById('formTitle'),
    formDescription: document.getElementById('formDescription'),
    previewTitle: document.getElementById('previewTitle'),
    previewDescription: document.getElementById('previewDescription'),
    previewFields: document.getElementById('previewFields'),
    createFormBtn: document.getElementById('createFormBtn')
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    elements.addFieldsTab.addEventListener('click', () => switchTab('add'));
    elements.previewTab.addEventListener('click', () => switchTab('preview'));

    // Tipo de campo
    elements.fieldType.addEventListener('change', toggleOptionsContainer);

    // Agregar opción
    elements.addOption.addEventListener('click', addOption);

    // Agregar campo
    elements.addFieldBtn.addEventListener('click', addField);

    // Título y descripción
    elements.formTitle.addEventListener('input', updateFormConfig);
    elements.formDescription.addEventListener('input', updateFormConfig);

    // Crear formulario
    elements.createFormBtn.addEventListener('click', createForm);
});

// Funciones
function switchTab(tab) {
    if (tab === 'add') {
        elements.addFieldsTab.classList.add('border-blue-500', 'text-blue-600');
        elements.previewTab.classList.remove('border-blue-500', 'text-blue-600');
        elements.addFieldsPanel.classList.remove('hidden');
        elements.previewPanel.classList.add('hidden');
    } else {
        elements.previewTab.classList.add('border-blue-500', 'text-blue-600');
        elements.addFieldsTab.classList.remove('border-blue-500', 'text-blue-600');
        elements.previewPanel.classList.remove('hidden');
        elements.addFieldsPanel.classList.add('hidden');
        updatePreview();
    }
}

function toggleOptionsContainer() {
    const showOptions = FIELDS_WITH_OPTIONS.includes(elements.fieldType.value);
    elements.optionsContainer.classList.toggle('hidden', !showOptions);
}

function addOption() {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'flex gap-2';
    optionDiv.innerHTML = `
        <input 
            type="text" 
            placeholder="Nueva opción"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <button 
            class="px-3 py-2 text-gray-500 hover:text-red-500"
            onclick="removeOption(this)"
        >
            ×
        </button>
    `;
    elements.optionsList.appendChild(optionDiv);
}

function removeOption(button) {
    button.parentElement.remove();
}

function getOptions() {
    if (!FIELDS_WITH_OPTIONS.includes(elements.fieldType.value)) return [];
    return Array.from(elements.optionsList.querySelectorAll('input'))
        .map(input => input.value.trim())
        .filter(Boolean);
}

function addField() {
    const field = {
        id: Date.now().toString(),
        type: elements.fieldType.value,
        label: elements.fieldLabel.value,
        placeholder: elements.fieldPlaceholder.value,
        required: elements.fieldRequired.checked,
        options: getOptions()
    };

    if (!field.label) {
        alert('Por favor, ingresa una etiqueta para el campo');
        return;
    }

    if (FIELDS_WITH_OPTIONS.includes(field.type) && field.options.length === 0) {
        alert('Por favor, agrega al menos una opción');
        return;
    }

    formState.fields.push(field);
    updatePreview();
    resetFieldForm();
    elements.createFormBtn.disabled = false;
}

function resetFieldForm() {
    elements.fieldLabel.value = '';
    elements.fieldPlaceholder.value = '';
    elements.fieldRequired.checked = false;
    elements.optionsList.innerHTML = `
        <div class="flex gap-2">
            <input 
                type="text" 
                placeholder="Opción 1"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button 
                class="px-3 py-2 text-gray-500 hover:text-red-500"
                onclick="removeOption(this)"
            >
                ×
            </button>
        </div>
    `;
}

function updateFormConfig() {
    formState.title = elements.formTitle.value;
    formState.description = elements.formDescription.value;
    updatePreview();
}

function updatePreview() {
    elements.previewTitle.textContent = formState.title || 'Título del formulario';
    elements.previewDescription.textContent = formState.description || 'Descripción del formulario';
    
    elements.previewFields.innerHTML = formState.fields.map(field => {
        const requiredMark = field.required ? '<span class="text-red-500 ml-1">*</span>' : '';
        let inputHtml = '';

        switch (field.type) {
            case 'textarea':
                inputHtml = `
                    <textarea 
                        placeholder="${field.placeholder}"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ${field.required ? 'required' : ''}
                    ></textarea>
                `;
                break;
            case 'select':
                inputHtml = `
                    <select 
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ${field.required ? 'required' : ''}
                    >
                        <option value="">${field.placeholder}</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                `;
                break;
            case 'radio':
                inputHtml = field.options.map(opt => `
                    <div class="flex items-center space-x-2">
                        <input 
                            type="radio" 
                            name="radio_${field.id}" 
                            value="${opt}"
                            ${field.required ? 'required' : ''}
                            class="text-blue-600 focus:ring-blue-500"
                        >
                        <label class="text-gray-700">${opt}</label>
                    </div>
                `).join('');
                break;
            case 'checkbox':
                inputHtml = field.options.map(opt => `
                    <div class="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            name="checkbox_${field.id}" 
                            value="${opt}"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        >
                        <label class="text-gray-700">${opt}</label>
                    </div>
                `).join('');
                break;
            default:
                inputHtml = `
                    <input 
                        type="${field.type}"
                        placeholder="${field.placeholder}"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ${field.required ? 'required' : ''}
                    >
                `;
        }

        return `
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                    ${field.label}${requiredMark}
                </label>
                ${inputHtml}
            </div>
        `;
    }).join('');
}

function generateFormHTML(formConfig) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formConfig.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div class="container mx-auto max-w-2xl">
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold mb-4">${formConfig.title}</h1>
            <p class="text-gray-600 mb-6">${formConfig.description}</p>
            
            <form id="dynamicForm" class="space-y-6" onsubmit="handleSubmit(event)">
                ${formConfig.fields.map(field => {
                    const requiredMark = field.required ? '<span class="text-red-500 ml-1">*</span>' : '';
                    let inputHtml = '';

                    switch (field.type) {
                        case 'textarea':
                            inputHtml = `
                                <textarea 
                                    name="${field.id}"
                                    placeholder="${field.placeholder}"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ${field.required ? 'required' : ''}
                                ></textarea>
                            `;
                            break;
                        case 'select':
                            inputHtml = `
                                <select 
                                    name="${field.id}"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ${field.required ? 'required' : ''}
                                >
                                    <option value="">${field.placeholder}</option>
                                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                </select>
                            `;
                            break;
                        case 'radio':
                            inputHtml = field.options.map(opt => `
                                <div class="flex items-center space-x-2">
                                    <input 
                                        type="radio" 
                                        name="${field.id}" 
                                        value="${opt}"
                                        ${field.required ? 'required' : ''}
                                        class="text-blue-600 focus:ring-blue-500"
                                    >
                                    <label class="text-gray-700">${opt}</label>
                                </div>
                            `).join('');
                            break;
                        case 'checkbox':
                            inputHtml = field.options.map(opt => `
                                <div class="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        name="${field.id}" 
                                        value="${opt}"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    >
                                    <label class="text-gray-700">${opt}</label>
                                </div>
                            `).join('');
                            break;
                        default:
                            inputHtml = `
                                <input 
                                    type="${field.type}"
                                    name="${field.id}"
                                    placeholder="${field.placeholder}"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ${field.required ? 'required' : ''}
                                >
                            `;
                    }

                    return `
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">
                                ${field.label}${requiredMark}
                            </label>
                            ${inputHtml}
                        </div>
                    `;
                }).join('')}
                
                <button 
                    type="submit"
                    class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Enviar
                </button>
            </form>
        </div>
    </div>

    <script>
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        console.log('Datos del formulario:', data);
        alert('Formulario enviado con éxito!');
    }
    </script>
</body>
</html>`;
}

function downloadHTML(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function createForm() {
    if (!formState.title || formState.fields.length === 0) {
        alert('Por favor, agrega un título y al menos un campo');
        return;
    }

    const htmlContent = generateFormHTML(formState);
    const filename = `${formState.title.toLowerCase().replace(/\s+/g, '-')}-form.html`;
    
    downloadHTML(filename, htmlContent);
}