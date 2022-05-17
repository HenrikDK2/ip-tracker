import { Loader } from "@googlemaps/js-api-loader";
import { GeolocationData } from ".";

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  center: {
    lat: 50,
    lng: 0,
  },
  zoom: 4,
};

const searchForm = document.getElementById("form") as HTMLFormElement;
let google: typeof globalThis.google;
let marker: google.maps.Marker = null;
let map: google.maps.Map;

async function initMap() {
  const loader = new Loader({
    apiKey: process.env.GOOGLE_MAPS_APIKEY,
    version: "weekly",
    libraries: ["places"],
  });

  try {
    google = await loader.load();

    map = new google.maps.Map(
      document.getElementsByClassName("map")[0] as HTMLElement,
      mapOptions
    );
  } catch (error) {
    console.error(error);
  }
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const searchInput = document.getElementById("search") as HTMLInputElement;

    const response = await fetch(
      `/.netlify/functions/geolocation?ip=` + searchInput.value
    );
    if (!response.ok) throw response.statusText;

    const data: GeolocationData = await response.json();
    const pos = {
      lng: parseFloat(data.longitude),
      lat: parseFloat(data.latitude),
    };

    // Add information to info cards
    const cards = Array.from(document.getElementsByClassName("info__text"));

    // IP
    cards[0].textContent = data.ip;

    // Location
    cards[1].textContent = data.city + ", " + data.country_name;

    // Timezone
    if (data.time_zone.offset > 0) {
      cards[2].textContent = "UTC +" + data.time_zone.offset;
    } else {
      cards[2].textContent = "UTC " + data.time_zone.offset;
    }

    // ISP
    cards[3].textContent = data.isp;

    // Add marker
    map.setZoom(10);
    map.setCenter(pos);
    if (!marker) {
      marker = new google.maps.Marker();
      marker.setMap(map);
    }
    marker.setPosition(pos);
    marker.setTitle(data.ip);
    searchInput.value = "";
  } catch (error) {
    console.log(error);
  }
});

initMap();
