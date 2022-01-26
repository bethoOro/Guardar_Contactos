const form = document.querySelector('.form');
const contacs = document.querySelector('.contacs');

let peopleContacs = [];
let modoEdicion = false;
let idModificado;

const contac = {
    name: '',
    lastName: '',
    number: ''
}

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', validadFormulario);

    peopleContacs = JSON.parse(localStorage.getItem('contacs')) || [];

    mostrarHtml();
});

// Validar formulario
function validadFormulario(e) {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const lastName = document.querySelector('#last_name').value;
    const number = document.querySelector('#number').value;

    contac.name = name;
    contac.lastName = lastName;
    contac.number = number;

    if (validar()) {
        mostrarMensaje('Todos los campos son obligatorios');
        return;
    }

    if (modoEdicion) {
        contac.id = idModificado;
        guardarEdicion();
        modoEdicion = false;
    } else {
        contac.id = Date.now();
        peopleContacs = [...peopleContacs, {...contac}];
    }

    mostrarHtml();

    form.reset();
}

// Validamos los datos
function validar() {
    return !Object.values(contac).every(input => input !== '');
}

// Mostrar mensaje
function mostrarMensaje(msj) {
    const validarMessage = document.querySelector('.msg-error');

    if (!validarMessage) {
        const message = document.createElement('div');
        message.classList.add('msg-error');
        message.textContent = msj;

        form.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 4000);
    }

}

function mostrarHtml() {
    limpiarHTML();

    peopleContacs.forEach(contac => {
        const {
            name,
            lastName,
            number,
            id
        } = contac;

        const containerDiv = document.createElement('div');
        containerDiv.classList.add('contac');

        const containerData = document.createElement('div');
        containerData.innerHTML = `
            <p>${name} ${lastName}</p>
            <p>${number}</p>
        `;

        const containerIcons = document.createElement('div');

        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = `
            <i class="fas fa-trash"></i>
        `;

        btnDelete.onclick = () => {
            deleteContac(id);
        }

        const btnEdite = document.createElement('button');
        btnEdite.innerHTML = `
            <i class="fas fa-edit"></i>
        `;

        btnEdite.onclick = () => {
            editeContac(id);
        }

        containerIcons.appendChild(btnEdite);
        containerIcons.appendChild(btnDelete);

        containerDiv.appendChild(containerData);
        containerDiv.appendChild(containerIcons);

        contacs.appendChild(containerDiv);

    });

    // Agregamos los contactos al localstorage
    agregarContactoLocalStorage();
}

function limpiarHTML() {
    while (contacs.firstChild) {
        contacs.removeChild(contacs.firstChild);
    }
}


function agregarContactoLocalStorage() {
    localStorage.setItem('contacs', JSON.stringify(peopleContacs));
}

function deleteContac(id) {
    peopleContacs = peopleContacs.filter(contac => contac.id !== id);
    mostrarHtml();
}

function editeContac(id) {

    peopleContacs.forEach(contac => {

        if (contac.id === id) {
            const {
                name,
                lastName,
                number,
                id
            } = contac;

            idModificado = id;
            

            document.querySelector('#name').value = name;
            document.querySelector('#last_name').value = lastName;
            document.querySelector('#number').value = number;
           
        }

    });
    modoEdicion = true;

}

function guardarEdicion() {
    peopleContacs = peopleContacs.map(con => con.id === contac.id ? {...contac} : con);
}