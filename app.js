const form = document.querySelector('form');
const contactList = document.querySelector('.contact-list');
const searchInput = document.querySelector('.search');

const contacts = [
    { name: 'María López', email: 'maria@email.com', phone: '555-1234', company: 'Tech' },
    { name: 'José Pérez', email: 'jose@email.com', phone: '555-5678', company: 'Design' },
    { name: 'Ana García', email: 'ana@email.com', phone: '555-9012', company: 'Marketing' }
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
            <div>
                <strong>${contact.name}</strong><br>
                <small>${contact.phone}</small>
            </div>
            <div>
                <button type="button" class="action-btn">Editar</button>
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
let pendingDeleteIndex = null;

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
    confirmMessage.textContent = `¿Eliminar ${contactName}? Esta acción no se puede deshacer.`;
    confirmOverlay.classList.remove('hidden');
}

function hideDeleteConfirm() {
    pendingDeleteIndex = null;
    confirmOverlay.classList.add('hidden');
}

contactList.addEventListener('click', (event) => {
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

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = form.querySelectorAll('input');
    const newContact = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        phone: inputs[2].value.trim(),
        company: inputs[3].value.trim()
    };

    if (!newContact.name || !newContact.email) {
        alert('Por favor completa al menos el nombre y el correo.');
        return;
    }

    contacts.push(newContact);
    form.reset();
    renderContacts(contacts);
});

searchInput.addEventListener('input', filterContacts);

renderContacts(contacts);
