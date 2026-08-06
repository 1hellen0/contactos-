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
        li.innerHTML = `
            <div>
                <strong>${contact.name}</strong><br>
                <small>${contact.email}</small>
            </div>
            <span>Editar</span>
        `;
        contactList.appendChild(li);
    });
}

function filterContacts() {
    const query = searchInput.value.toLowerCase();
    const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query)
    );
    renderContacts(filtered);
}

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
