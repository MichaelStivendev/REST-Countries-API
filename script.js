const btnTheme = document.querySelector("#change-mode");
const html = document.querySelector("html");

let countrys = [];



 async function getDatos() {
    try {
      const res = await fetch(
        "./data.json"
        // "https://restcountries.com/v3.1/all?fields=name,capital,currencies,population,region,subregion,tld,languages,flags,borders"
      );
      const data = await res.json();
      countrys = data;
     
    } catch (error) {
      alert("No pude conectarme a la API");
      console.error(error);
    }
  }

btnTheme.addEventListener("click", () => {
  html.dataset.theme = html.dataset.theme == "light" ? "dark" : "light";
  localStorage.setItem("theme", html.dataset.theme);
});

document.body.addEventListener("click", (e) => {
  if (e.target.matches(".mi-boton")) {
     const page = e.target.dataset.page;
     const code = e.target.dataset.code;
     if (page === "InfoCountry.html") {
      history.pushState({ page, code }, "", `?page=country&code=${code}`);
    }
    loadPage(page, code);
  }
});

function loadPage(page, code) {
  fetch(page)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;

      if (page === "home.html") initHome();
      if (page === "InfoCountry.html") {
        initCountryInfo(code);
      }
    });
}
function initHome() {
  const openFilter = document.querySelector(".filter-expand");
  const optionFilter = document.querySelector(".option-filter");
  const optionSelect = document.querySelector("#option-select");
  const renderCountry = document.querySelector("#container-country");
  const options = document.querySelectorAll(".options");
  let textoSelect = "Filter by Region";
  const input = document.querySelector("#search");

  openFilter.addEventListener("click", () => {
    optionFilter.classList.toggle("is-visible");
  });
  document.addEventListener("click", (e) => {
    if (!openFilter.contains(e.target) && !optionFilter.contains(e.target)) {
      optionFilter.classList.remove("is-visible");
    }
  });

  options.forEach((e) => {
    e.addEventListener("click", (e) => {
      textoSelect = e.target.textContent;
      optionSelect.textContent = textoSelect;
      optionFilter.classList.remove("is-visible");
      filterCountrys(textoSelect);
    });
  });



  input.addEventListener("input", (e) => {
    searchCountry(e.target.value);
  });
  function searchCountry(input) {
    console.log(input);
    let result = countrys.filter((el) => el.name.includes(input));
    renderData(result);
  }
  function filterCountrys(filter) {
    if (filter === "All") {
      renderData(countrys);
    } else {
      let countryRegionFilter = countrys.filter((country) =>
        country.region === filter
      );

      renderData(countryRegionFilter);
    }
  }
  renderData(countrys);
  function renderData(data) {
    renderCountry.innerHTML = "";
    data.forEach((element) => {
      const divnew = document.createElement("div");
      divnew.classList.add("card-country");
      const imgcontry = document.createElement("img");
      imgcontry.setAttribute("src", `${element.flags.png}`);
      imgcontry.setAttribute("alt", `imagen de ${element.flags.alt}`);
      imgcontry.classList.add("mi-boton");
      imgcontry.setAttribute("data-page", "InfoCountry.html");
      imgcontry.setAttribute("data-code", element.alpha3Code);
      const name = document.createElement("h2");
      name.textContent = element.name;
      const list = document.createElement("ul");
      const population = document.createElement("li");
      const region = document.createElement("li");
      const capital = document.createElement("li");

      const spanP = document.createElement("strong");
      const spanR = document.createElement("strong");
      const spanC = document.createElement("strong");
      spanP.textContent = "Population:";
      spanR.textContent = "Region:";
      spanC.textContent = "Capital:";

      population.append(spanP, element.population.toLocaleString("en-US"));
      region.append(spanR, element.region);
      capital.append(spanC, element.capital);

      list.append(population, region, capital);

      divnew.append(imgcontry, name, list);

      renderCountry.append(divnew);
    });
  }
}
function initCountryInfo(code) {
  const backButton = document.querySelector(".btn-back");
  const renderInfi = document.querySelector("#info-country");
  console.log(code);
  
  backButton.addEventListener("click", (e) => {
   history.replaceState({}, "", window.location.pathname);
  loadPage("home.html");
  });
  let pais = countrys.find((country) => country.alpha3Code === code);
  console.log(pais);

  console.log("Elemento .info-country:", renderInfi);
  const divnew = document.createElement("div");
  divnew.classList.add("card-info");

  const imgInfo = document.createElement("img");
  imgInfo.setAttribute("src", pais.flags.png);
  imgInfo.setAttribute("alt", `bandera de pais ${pais.name}`);
  const nameInfo = document.createElement("h2");
  nameInfo.textContent = pais.name;
  const listInfo = document.createElement("ul");

  const NativeName = document.createElement("li");
  const population = document.createElement("li");
  const region = document.createElement("li");
  const subRegion = document.createElement("li");
  const capital = document.createElement("li");

  const strongN = document.createElement("strong");
  const strongP = document.createElement("strong");
  const strongR = document.createElement("strong");
  const strongS = document.createElement("strong");
  const strongC = document.createElement("strong");
  strongN.textContent = "Native Name:";
  strongP.textContent = "Population:";
  strongR.textContent = "Region:";
  strongS.textContent = "Sub Region:";
  strongC.textContent = "Capital:";

  NativeName.append(strongN, pais.nativeName);
  population.append(strongP, pais.population.toLocaleString("en-US"));
  region.append(strongR, pais.region);
  subRegion.append(strongS, pais.subregion);
  capital.append(strongC, pais.capital);

  const listInfoTwo = document.createElement("ul");
  listInfoTwo.classList.add("ul-two");
  const tdl = document.createElement("li");
  const currencies = document.createElement("li");
  const lenguages = document.createElement("li");

  const strongT = document.createElement("strong");
  const strongCu = document.createElement("strong");
  const strongLe = document.createElement("strong");
  strongT.textContent = "Top Level Domain:";
  strongCu.textContent = "Currencies:";
  strongLe.textContent = "Languages:";

  tdl.append(strongT, pais.topLevelDomain);
  currencies.append(strongCu, pais.currencies?.[0]?.code ?? "");

  lenguages.append(strongLe);
  pais.languages.forEach((element) => {
    const lang = document.createElement("p");
    lang.textContent = element.name;
    lenguages.append(lang);
  });

  listInfoTwo.append(tdl, currencies, lenguages);

  listInfo.append(NativeName, population, region, subRegion, capital);

  const h3 = document.createElement("h3");
  h3.textContent = "Border Countries:";

  const borders = document.createElement("div");
  borders.append(h3);
  if (pais.borders) {
    pais.borders.forEach((e) => {
      let paisBorder = countrys.find((element) => element.alpha3Code === e);
      const border = document.createElement("p");
      border.classList.add("mi-boton");
      border.setAttribute("data-page", "InfoCountry.html");
      border.setAttribute("data-code", e);
      border.textContent = paisBorder.name;
      borders.append(border);
    });
  }

  divnew.append(imgInfo, nameInfo, listInfo, listInfoTwo, borders);

  renderInfi.append(divnew);
}
window.addEventListener("DOMContentLoaded", async () => {
  html.dataset.theme = localStorage.getItem("theme");

  try {
    await getDatos();

    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const code = params.get("code");

    if (page === "country" && code) {
      loadPage("InfoCountry.html", code);
    } else {
      loadPage("home.html");
    }

  } catch (error) {
    alert("Error al cargar datos");
  }
});

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  const code = params.get("code");

  if (page === "country" && code) {
    loadPage("InfoCountry.html", code);
  } else {
    loadPage("home.html");
  }
});
