const offersUrl = "https://gx.pandora.caps.pl/zadania/api/offers2023.json";
let offersArray = [];
let cityArray = [];

fetch(offersUrl)
  .then((response) => response.json())
  .then((response) => {
    response.offers.forEach((offer) => offersArray.push(offer));
    cityArray = response?.offers
      .map((offer) => offer?.miasto)
      .filter((miasto, index, array) => array.indexOf(miasto) === index);
  })
  .then(() => {
    cityArray.forEach((city) => addCityToList(city));
    renderOffers();
  });

const filterForm = document.getElementById("filter-form");
const availableCheckbox = document.getElementById("available");
const gearBoxCheckbox = document.getElementById("gear-box");
const pricesOrder = document.getElementById("prices-order");
const citiesContainer = document.getElementById("citiesList");

const addCityToList = (city) => {
  const cityOption = document.createElement("option");
  cityOption.value = city;
  cityOption.text = city;
  citiesContainer.appendChild(cityOption);
};

filterForm.addEventListener("change", (e) => {
  if (e.target.classList.contains("event-trigger")) {
    renderOffers();
  }
});

const offersContainer = document.getElementById("offersContainer");
// offersContainer.innerHTML = "<p>Ładuję oferty...</p>";

const createOfferCard = (offer) => {
  const offerCard = document.createElement("div");
  const details = offer?.offer_details;
  const getNiceDate = () => {
    const d = new Date(offer?.pdd);
    const month = [
      "styczeń",
      "luty",
      "marzec",
      "kwiecień",
      "maj",
      "czerwiec",
      "lipiec",
      "sierpień",
      "wrzesień",
      "październik",
      "listopad",
      "grudzień",
    ];
    return `${month[d.getMonth()]} ${d.getFullYear()}`
  }
  offerCard.classList.add("col");
  offerCard.innerHTML = `
  <div class="card border-0 rounded-0 card-bg">
    <div class="card-header bg-transparent border-0 justify-content-end d-flex">
      <button class="btn p-0 m-0 text-white fw-bolder" >
        <i class="bi bi-suit-heart" style="-webkit-text-stroke: 0.5px"></i>
      </button>
    </div>
    <div class="card-body text-center justify-content-center px-5 text-light">
      <h5 class="h5 card-title text-uppercase">${details.model_details}</h5>
      <h5 class="h5 fw-light card-subtitle text-uppercase">${
        details.kabina
      }</h5>
      <p class="mt-3">
      ${
        offer.in_stock === 1
          ? `Dostępny od ręki!`
          : `Przewidywana data dostawy: ${getNiceDate()}*`
      }
      </p>
      <img src=${details.image_paths.front} alt="front" class="img img-fluid" />
      <div class="d-flex justify-content-between">
        <span>Rok produkcji</span>
        <span class="fw-bolder">${details.modelYear}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Skrzynia</span>
        <span class="fw-bolder">${
          details.skrzynia_automatyczna ? "Automatyczna" : "Manualna"
        }</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Miasto</span>
        <span class="fw-bolder">${offer.miasto}</span>
      </div>
      <div class="d-flex justify-content-between align-items-baseline">
        <span>Cena netto</span>
        <span class="fw-bolder fs-2">
          ${offer.car_price_disc} <span class="fw-light fs-6">zł</span>
        </span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Cena brutto</span>
        <span class="fw-bolder">
          ${offer.total_gross_price} <span class="fw-light">zł</span>
        </span>
      </div>
      <a href="#" class="btn rounded-0 m-4 px-5 bg-white text-uppercase">
        Zobacz ofertę
      </a>
    </div>
  </div>
  `;
  offersContainer.appendChild(offerCard);
  return offerCard;
};

const renderOffers = () => {
  let offersList = [];
  offersContainer.innerHTML = "";

  offersList = offersArray
    .filter((offer) =>
      availableCheckbox.checked ? offer.in_stock === 1 : offer
    )
    .filter((offer) =>
      gearBoxCheckbox.checked
        ? offer.offer_details.skrzynia_automatyczna
        : offer
    )
    .sort((a, b) =>
      pricesOrder.value === "ascending"
        ? parseFloat(a.car_price_disc) - parseFloat(b.car_price_disc)
        : parseFloat(b.car_price_disc) - parseFloat(a.car_price_disc)
    )
    .filter((offer) =>
      citiesContainer?.value ? offer.miasto === citiesContainer.value : offer
    );

  offersList.forEach((offer) => createOfferCard(offer));
};
