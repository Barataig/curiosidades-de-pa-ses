const listaDePaises = document.getElementById('country-list');
const searchInput = document.getElementById('search');
let countriesData = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 10;

// Busca os países da API
function fetchCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            countriesData = countries;
            displayCountries();
            setupInfiniteScroll();
        })
        .catch(console.error);
}

// Exibe países na tela
function displayCountries() {
    const countriesToDisplay = countriesData.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
    countriesToDisplay.filter(country => country.flags && country.flags.png).forEach(country => {
        const countryCard = createCountryCard(country);
        listaDePaises.appendChild(countryCard);
    });
    currentIndex += ITEMS_PER_PAGE;
}

// Cria o cartão de um país
function createCountryCard(country) {
    const countryCard = document.createElement('div');
    countryCard.className = 'country-card';
    countryCard.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="Bandeira de ${country.name.common}">
        <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p>População: ${country.population.toLocaleString()}</p>
        <div class="country-details" style="display: none;">
            <p>Área: ${country.area.toLocaleString()} km²</p>
            <p>Moeda: ${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'}</p>
            <p>Idioma: ${country.languages ? Object.values(country.languages)[0] : 'N/A'}</p>
        </div>
    `;
    const favoriteBtn = createFavoriteButton(country);
    countryCard.appendChild(favoriteBtn);
    countryCard.querySelector('img').addEventListener('click', () => toggleCountryDetails(countryCard));
    return countryCard;
}

// Cria o botão de favoritar
function createFavoriteButton(country) {
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.innerHTML = favoritos.includes(country.name.common) ? '⭐' : '☆';
    favoriteBtn.addEventListener('click', () => toggleFavorito(country.name.common, favoriteBtn));
    return favoriteBtn;
}

// Alterna a exibição dos detalhes do país
function toggleCountryDetails(countryCard) {
    const detailsDiv = countryCard.querySelector('.country-details');
    detailsDiv.style.display = detailsDiv.style.display === 'block' ? 'none' : 'block';
}

// Favoritar/desfavoritar países
function toggleFavorito(countryName, btn) {
    favoritos.includes(countryName) ? 
        (favoritos = favoritos.filter(fav => fav !== countryName), btn.innerHTML = '☆') : 
        (favoritos.push(countryName), btn.innerHTML = '⭐');
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Filtro de busca
searchInput.addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    listaDePaises.innerHTML = '';
    currentIndex = 0;
    const filteredCountries = countriesData.filter(country => country.name.common.toLowerCase().includes(filter));
    filteredCountries.forEach(country => {
        const countryCard = createCountryCard(country);
        listaDePaises.appendChild(countryCard);
    });
});

// Configura o scroll infinito
function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && currentIndex < countriesData.length) {
            displayCountries();
        }
    });
}

// Chama a função para buscar e exibir os países
fetchCountries();
