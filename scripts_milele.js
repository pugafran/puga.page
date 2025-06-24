    const API_BASE_URL = 'https://api.puga.page';

    let map;
    const pois = {};
const markers = {};
const markerColors = {
        restaurant: '#007bff',
        landmark: '#28a745',
        activity: '#fd7e14',
        other: '#dc3545'
};

    // Convertir archivo a DataURL (base64)
    function fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Inicializar mapa
    function initMap() {
        const asturias = { lat: 43.361395, lng: -5.859327 };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: asturias,
        });

        map.addListener('click', (event) => {
            document.getElementById('latitude').value = event.latLng.lat();
            document.getElementById('longitude').value = event.latLng.lng();
            document.getElementById('formContainer').style.display = 'block';
        });
    }

    // Función para obtener parámetros de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Intento automático de login si hay username y password en la URL
async function autoLogin() {
    const username = getQueryParam("username");
    const password = getQueryParam("password");

    if (username && password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password }),
                mode: 'cors'
            });

            if (!response.ok) throw new Error('Error de autenticación');

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);

            // Redirigir a la vista principal tras autenticación exitosa
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        document.getElementById('toggleFormButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';

            await loadPois();
        } catch (error) {
            console.error(error.message);
        }
    }
}

// Ejecutar autoLogin cuando la página cargue
window.addEventListener('load', autoLogin);


    // Crear contenido de InfoWindow con botón de eliminar
    function createInfoContent(data, key) {
        const typeClassMap = {
            restaurant: 'restaurant',
            landmark: 'landmark',
            activity: 'activity',
            other: 'cita'
        };
        
        return `
            <div class="info-window ${typeClassMap[data.type]}">
                <h3>${data.placeName}</h3>
                ${data.title ? `<p><strong>Título:</strong> ${data.title}</p>` : ''}
                ${data.description ? `<p>${data.description}</p>` : ''}
                ${data.photo ? `<img src="${data.photo}" style="max-width:100%;height:auto;"/>` : ''}
                <p><strong>Fecha:</strong> ${data.date}</p>
                <p><strong>Tipo:</strong> ${data.type.replace(/\b\w/g, l => l.toUpperCase())}</p>
                ${data.rating ? `<p><strong>Calificación:</strong> ${'★'.repeat(data.rating)}</p>` : ''}
                <button onclick="deletePOI('${key}')" class="delete-btn">🗑️ Eliminar</button>
            </div>
        `;
    }

    // Eliminar POI
    async function deletePOI(key) {
        if (confirm('¿Eliminar este recuerdo?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/pois/${encodeURIComponent(key)}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                });
                
                if (response.ok) {
                    markers[key].marker.setMap(null);
                    delete markers[key];
                    alert('Recuerdo eliminado');
                } else {
                    throw new Error('Error al eliminar el recuerdo');
                }
            } catch (error) {
                alert(error.message);
            }
        }
    }

    // Añadir marcador con color
    async function addPointOfInterest(location, data) {
        const token = localStorage.getItem('access_token');
        if (!token) return alert('Debes iniciar sesión.');

        const key = `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`;

        try {
            const response = await fetch(`${API_BASE_URL}/pois`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, ...data }),
                mode: 'cors'
            });

            if (!response.ok) throw new Error('Error al añadir el POI.');

            // Crear marcador con color
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: data.placeName,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: markerColors[data.type],
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                    scale: 10
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: createInfoContent(data, key)
            });

            marker.addListener('click', () => infoWindow.open(map, marker));
            markers[key] = { marker, infoWindow };
            
            alert('¡Recuerdo añadido! ❤️');
        } catch (error) {
            alert(error.message);
        }
    }

    // Cargar POIs desde el backend
    async function loadPois() {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/pois`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) throw new Error('Error al cargar los POIs');
            const poisData = await response.json();

            for (const key in poisData) {
                const [lat, lng] = key.split(',').map(parseFloat);
                const location = { lat, lng };

                // Crear marcador
                const marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: poisData[key][0].placeName,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: markerColors[poisData[key][0].type],
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        scale: 10
                    }
                });

                // Crear InfoWindow
                const infoWindow = new google.maps.InfoWindow({
                    content: createInfoContent(poisData[key][0], key)
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                markers[key] = { marker, infoWindow };
                pois[key] = poisData[key];
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Resto del código sin cambios...
    document.getElementById('poiForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const placeName = document.getElementById('placeName').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);
        const date = document.getElementById('date').value;
        const type = document.getElementById('type').value;
        const rating = type === 'restaurant' ? parseInt(document.getElementById('rating').value) : null;

        const photoFile = document.getElementById('photo').files[0];
        let photo = null;
        if (photoFile) {
            try {
                photo = await fileToDataURL(photoFile);
            } catch (err) {
                console.error(err);
            }
        }

        await addPointOfInterest(
            { lat: latitude, lng: longitude },
            { placeName, title, description, date, type, rating, photo }
        );

        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('poiForm').reset();
    });

    // Manejo de inicio de sesión y eventos
    async function login(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password }),
                mode: 'cors'
            });

            if (!response.ok) throw new Error('Usuario o contraseña incorrectos');
            
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);

            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('map').style.display = 'block';
            document.getElementById('toggleFormButton').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';

            await loadPois();
        } catch (error) {
            alert(error.message);
        }
    }

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('toggleFormButton').addEventListener('click', () => {
        const formContainer = document.getElementById('formContainer');
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('closeFormButton').addEventListener('click', () => {
        document.getElementById('formContainer').style.display = 'none';
    });
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('access_token');
        location.reload();
    });

    document.getElementById('type').addEventListener('change', function() {
        const iconContainer = document.getElementById('iconContainer');
        iconContainer.setAttribute('data-type', this.value);
        document.getElementById('rating').style.display = this.value === 'restaurant' ? 'block' : 'none';
    });

    window.addEventListener('load', () => {
        if (localStorage.getItem('access_token')) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('map').style.display = 'block';
            document.getElementById('toggleFormButton').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            loadPois();
        } else {
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'none';
        }
    });
