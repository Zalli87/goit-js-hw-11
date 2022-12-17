import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
let countryName = '';

const refs = {
  input: document.querySelector('input#search-box'),
  coutryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  countryName = e.target.value.trim();
  if (e.target.value === '') {
    resetPage();
    Notiflix.Notify.failure('Add some country name');
    return;
  }
  fetchCountries(countryName).then(createMarkup).catch(onError);
}

function createMarkup(countrys) {
  if (countrys.length === 1) {
    resetPage();
    const countryEl = createCountryCardMarkup(countrys);
    refs.countryCard.insertAdjacentHTML('afterbegin', countryEl);
  } else if (countrys.length > 1 && countrys.length <= 10) {
    resetPage();
    const countryListEl = createCountrysListMarkup(countrys);
    refs.coutryList.insertAdjacentHTML('afterbegin', countryListEl);
  } else if (countrys.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

function createCountryCardMarkup(countrys) {
  return countrys
    .map(({ flags, name, capital, population, languages }) => {
      return `<img src='${flags.svg}' width="50" height="50">
        <h2>${name.official}</h2>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
}

function createCountrysListMarkup(countrys) {
  return countrys
    .map(({ flags, name }) => {
      return `<li><img src='${flags.svg}' width="50" height="50">
        <h2>${name.official}</h2>
      </li>`;
    })
    .join('');
}

function resetPage() {
  refs.coutryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
