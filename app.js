const form = document.querySelector("form");
const heroContainer = document.querySelector(".hero-container");
const comicsContainer = document.querySelector(".comics-container");
const h1 = document.querySelector("h1");

// Search Hero
form.addEventListener("submit", function (evt) {
	evt.preventDefault();

	const searchInput = form.querySelector("#search-input");

	const api = `https://gateway.marvel.com:443/v1/public/characters?name=${searchInput.value}&apikey=39412169a8ad74430a18f462d40b6ec8`;

	searchInput.value = "";

	fetch(api)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Status Code Error: ${res.status}`);
			} else {
				return res.json();
			}
		})
		.then((hero) => {
			const { attributionText } = hero;
			const { thumbnail, name, id, description } = hero.data.results[0];

			heroContainer.innerHTML = `
				<div class="hero__thumbnail-container">
					<img class="hero__thumbnail-img" src=${thumbnail.path}.${
				thumbnail.extension
			} alt="${name} Thumbnail">
				</div>
				<div class="hero__bio">
					<h2 class="hero__name">${name}</h2>
					<h3 class="hero__id">${id}</h3>
					<p class="hero__desc">${
						description === ""
							? "Sorry. No Description Avabilable."
							: description
					}</p>
					<p class="copyright">${attributionText}</p>
				</div>
			`;

			const comicsAPI = `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?apikey=39412169a8ad74430a18f462d40b6ec8`;
			return fetch(comicsAPI);
		})
		.then((res) => {
			return res.json();
		})
		.then((comicBooks) => {
			const { results } = comicBooks.data;

			comicsContainer.innerHTML = "";

			const h2 = document.createElement("h2");
			h2.innerText = "Comic Books";
			h2.classList.add("comics-container__title");
			comicsContainer.append(h2);
			comicsContainer.style.backgroundColor = "var(--dark)";

			const comicsWrapper = document.createElement("div");
			comicsWrapper.classList.add("comics-wrapper");

			for (let result of results) {
				const img = document.createElement("img");
				img.src = `${result.thumbnail.path}.${result.thumbnail.extension}`;
				img.alt = `${result.title} Thumbnail`;
				img.classList.add("comic__thumbnail");
				const title = document.createElement("h4");
				title.innerText = result.title;
				title.classList.add("comic__title");
				const comic = document.createElement("div");
				comic.classList.add("comic");
				comic.append(img, title);
				comicsWrapper.append(comic);
			}
			comicsContainer.append(comicsWrapper);
		})
		.catch((err) => {
			heroContainer.innerHTML = `
			<h1>Sorry. We couldn't find your hero.</h1>
			`;
			comicsContainer.innerHTML = "";
			comicsContainer.style.backgroundColor = "";
		});
});
