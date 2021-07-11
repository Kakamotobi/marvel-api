const form = document.querySelector("form");
const heroContainer = document.querySelector(".hero-container");
const comicsContainer = document.querySelector(".comics-container");

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
				</div>
				<p class="copyright">${attributionText}</p>
			`;
		})
		.catch((err) => {
			console.log("Something went wrong with fetch", err);
		});
});
