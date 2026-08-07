const form = document.querySelector('form');
const contactList = document.querySelector('.contact-list');
const searchInput = document.querySelector('.search');

const contacts = [
    { name: 'María López', email: 'maria@email.com', phone: '555-1234' },
    { name: 'José Pérez', email: 'jose@email.com', phone: '555-5678' },
    { name: 'Ana García', email: 'ana@email.com', phone: '555-9012' },
    { name: 'Carlos Méndez', email: 'carlos@email.com', phone: '555-3456' },
    { name: 'Lucía Torres', email: 'lucia@email.com', phone: '555-7890' },
    { name: 'Sofía Ruiz', email: '', phone: '555-2345' }
];

function renderContacts(items) {
    contactList.innerHTML = '';

    if (items.length === 0) {
        contactList.innerHTML = '<li class="contact-item">No se encontraron contactos.</li>';
        return;
    }

    items.forEach(contact => {
        const li = document.createElement('li');
        li.className = 'contact-item';
        li.dataset.index = contacts.indexOf(contact);
        li.innerHTML = `
            <div class="contact-details">
                <div class="contact-name">${contact.name}</div>
                ${contact.email ? `<div class="contact-email">${contact.email}</div>` : '<div class="contact-email optional">Sin correo</div>'}
                <div class="contact-phone">${contact.phone || 'Sin teléfono'}</div>
            </div>
            <div class="contact-actions">
                <button type="button" class="action-btn edit-btn">Editar</button>
                <button type="button" class="action-btn delete-btn">Eliminar</button>
            </div>
        `;
        contactList.appendChild(li);
    });
}

const confirmOverlay = document.getElementById('confirmOverlay');
const confirmMessage = document.getElementById('confirmMessage');
const confirmAccept = document.getElementById('confirmAccept');
const confirmCancel = document.getElementById('confirmCancel');
const editOverlay = document.getElementById('editOverlay');
const editNameInput = document.getElementById('editName');
const editPhoneInput = document.getElementById('editPhone');
const editAccept = document.getElementById('editAccept');
const editCancel = document.getElementById('editCancel');
const editConfirmOverlay = document.getElementById('editConfirmOverlay');
const editConfirmMessage = document.getElementById('editConfirmMessage');
const editConfirmAccept = document.getElementById('editConfirmAccept');
const editConfirmCancel = document.getElementById('editConfirmCancel');
let pendingDeleteIndex = null;
let pendingEditIndex = null;
let pendingEditData = null;

function filterContacts() {
    const query = searchInput.value.toLowerCase();
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query)
    );
    renderContacts(filtered);
}

function showDeleteConfirm(index) {
    pendingDeleteIndex = index;
    const contactName = contacts[index]?.name || 'este contacto';
    confirmMessage.textContent = `estas seguro que quieres eliminar a ${contactName}`;
    confirmOverlay.classList.remove('hidden');
}

function hideDeleteConfirm() {
    pendingDeleteIndex = null;
    confirmOverlay.classList.add('hidden');
}

function showEditModal(index) {
    const contact = contacts[index];
    if (!contact) return;

    pendingEditIndex = index;
    editNameInput.value = contact.name;
    editPhoneInput.value = contact.phone;
    editOverlay.classList.remove('hidden');
}

function hideEditModal() {
    pendingEditIndex = null;
    editOverlay.classList.add('hidden');
}

function showEditConfirm(name) {
    editConfirmMessage.textContent = `¿estas seguro que quieres guardar los cambios de ${name}?`;
    editConfirmOverlay.classList.remove('hidden');
}

function hideEditConfirm() {
    pendingEditData = null;
    editConfirmOverlay.classList.add('hidden');
}

contactList.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-btn');
    if (editButton) {
        const contactItem = editButton.closest('.contact-item');
        if (!contactItem) return;

        const index = Number(contactItem.dataset.index);
        if (Number.isNaN(index)) return;

        showEditModal(index);
        return;
    }

    const deleteButton = event.target.closest('.delete-btn');
    if (!deleteButton) return;

    const contactItem = deleteButton.closest('.contact-item');
    if (!contactItem) return;

    const index = Number(contactItem.dataset.index);
    if (Number.isNaN(index)) return;

    showDeleteConfirm(index);
});

confirmAccept.addEventListener('click', () => {
    if (pendingDeleteIndex === null) return;
    contacts.splice(pendingDeleteIndex, 1);
    hideDeleteConfirm();
    filterContacts();
});

confirmCancel.addEventListener('click', hideDeleteConfirm);

editAccept.addEventListener('click', () => {
    if (pendingEditIndex === null) return;

    const newName = editNameInput.value.trim();
    const newPhone = editPhoneInput.value.trim();
    if (!newName || !newPhone) {
        alert('Por favor completa el nombre y el teléfono para editar.');
        return;
    }

    pendingEditData = { name: newName, phone: newPhone };
    showEditConfirm(contacts[pendingEditIndex].name);
});

editCancel.addEventListener('click', hideEditModal);

editConfirmAccept.addEventListener('click', () => {
    if (pendingEditIndex === null || !pendingEditData) return;

    contacts[pendingEditIndex].name = pendingEditData.name;
    contacts[pendingEditIndex].phone = pendingEditData.phone;
    hideEditConfirm();
    hideEditModal();
    filterContacts();
});

editConfirmCancel.addEventListener('click', hideEditConfirm);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = form.querySelectorAll('input');
    const updatedContact = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        phone: inputs[2].value.trim()
    };

    if (!updatedContact.name) {
        alert('Por favor completa al menos el nombre.');
        return;
    }

    contacts.push(updatedContact);
    form.reset();
    renderContacts(contacts);
});

searchInput.addEventListener('input', filterContacts);

renderContacts(contacts);
