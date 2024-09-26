const URLDeptos = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const URLObjects = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
const URLObjectIDs = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
const URLSearchHasImage = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=""';
const URLSearch = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

let currentPage = 1; 
const itemsPerPage = 20; 
let totalItems = 100; 

function fetchDeptos() {
    fetch(URLDeptos)
        .then((response) => response.json())
        .then((data) => {
            const deptos = document.getElementById("departamento");
            
            const defaultOption = document.createElement("option");
            defaultOption.value = ""; 
            defaultOption.textContent = "Select department";
            defaultOption.selected = true; 
            defaultOption.disabled = true; 
            deptos.appendChild(defaultOption);

            data.departments.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.departmentId;
                option.textContent = item.displayName;
                deptos.appendChild(option);   
            });
        });
}

fetchDeptos();

function fetchObjects(objectIDs) {
    let objetosHtml = '';

    document.getElementById("grilla").innerHTML = '';

    const slicedObjectIDs = objectIDs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    slicedObjectIDs.forEach(objectId => {
        fetch(URLObjectIDs + objectId)
            .then((response) => response.json())
            .then((data) => {
                if (data.primaryImageSmall) { // Solo mostrar si hay imagen
                    objetosHtml += `<div class="objeto">
                                        <img src="${data.primaryImageSmall}" alt="${data.title}"/>
                                        <h4 class="titulo">${data.title}</h4> 
                                        <h6 class="cultura">${data.culture ? data.culture : 'sin datos'}</h6>
                                        <h6 class="dinastia">${data.dynasty ? data.dynasty : 'sin datos'}</h6>
                                    </div>`;
                }
                document.getElementById("grilla").innerHTML = objetosHtml;
            });
    });
}

document.getElementById("buscar").addEventListener("click", (event) => {
    event.preventDefault(); 

    const departamento = document.getElementById('departamento').value;
    const keyword = document.getElementById('keyword').value;

    // Check que al menos un campo de búsqueda esté lleno
    if (departamento || keyword) {
        const query = `${URLSearch}?q=${keyword}&departmentId=${departamento}&hasImages=true`;

        fetch(query)
            .then((response) => response.json())
            .then((data) => {
                if (data.objectIDs && data.objectIDs.length > 0) {
                    const limitedObjectIDs = data.objectIDs.slice(0, totalItems); 
                    currentPage = 1; 
                    fetchObjects(limitedObjectIDs); 
                    updatePagination(limitedObjectIDs); 
                } else {
                    document.getElementById("grilla").innerHTML = '<div class="no-results">No se encontraron resultados.</div>'; 
                    document.getElementById("pagination").style.display = 'none'; 
                }
            });
    } else {
        document.getElementById("grilla").innerHTML = 'Por favor, ingresa una palabra clave o selecciona un departamento.';
        document.getElementById("pagination").style.display = 'none';
    }
});

function updatePagination(objectIDs) {
    const totalPages = Math.ceil(objectIDs.length / itemsPerPage);
    const paginationHtml = document.getElementById("pagination");

    // ocultamos la paginacion si no hay mas de 20 objetos
    if (totalPages <= 1) {
        paginationHtml.style.display = 'none';
        return;
    } else {
        paginationHtml.style.display = 'flex'; 
    }
 
    paginationHtml.innerHTML = ''; 
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener("click", () => {
            currentPage = i;

            const allButtons = document.querySelectorAll('#pagination button');
            allButtons.forEach(button => button.classList.remove('active'));

            pageButton.classList.add('active');

            fetchObjects(objectIDs); 
        });

        paginationHtml.appendChild(pageButton);
    }
}


fetch(URLSearchHasImage)
    .then((response) => response.json())
    .then((data) => {
        const objectIDs = data.objectIDs.slice(0, totalItems); 
        fetchObjects(objectIDs); 
        updatePagination(objectIDs); 
    });


document.getElementById("buscar").addEventListener("click", (event) => {
    event.preventDefault();
    const keyword = document.getElementById('keyword').value;

    fetch(URLSearch + `?q=${keyword}&departmentId=${departamento}`)
        .then((response) => response.json())
        .then((data) => {
            const objectIDs = data.objectIDs.slice(0, totalItems); 
            currentPage = 1; 
            fetchObjects(objectIDs); 
            updatePagination(objectIDs); 
        });
});
