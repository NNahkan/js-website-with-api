/* 
		I have to say that I am sorry for the spaghetti code.. 
		As much as I can, I try to do comments for every function.
		There is a little problem about poke-filter class. It behave little bit weird
		about flex-box. It shift to bottom when I click legendary (for example) when page is not
		max sized. Sorry for setTimeOuts :(

		And :/ I have a question for you. Instead of asking on discord. I think it will be easy for
		you to respond in video. Question is that I am so sick to be bartender LoL. I want so badly
		to begin my career as a developer. The thing is that I have a degree as a engineer(Electric-electronic).
		Do you think I should apply for internship? Or what is your advise for me? I haven't
		done any freelancing for now. Could you talk about this for a couple of minutes ? 
		Love you devslopes <3
*/


const root = document.documentElement;
const body = document.querySelector("body");

const modalOpen = "[data-open]";
const dataFilter = "[data-filter]";
const dataItem = "[data-item]";

const isVisible = "is-visible";
const open = "open";
const active = "active";
const toggleFilter = ".filter-link";
const favorites = ".fav";

//menu ids
const allCount = document.getElementById("All");
const rareCount = document.getElementById("Rare");
const legendaryCount = document.getElementById("Legendary");
const azCount = document.getElementById("a-z");
const zaCount = document.getElementById("z-a");
const favoritesCount = document.getElementById("Favorites");

const favCheck = document.querySelector("[data-filter='Favorites']");
const apiWrapper = document.querySelector(".pokemons-wrapper");
const modal = document.querySelector(".modals");
let filterLink;
let openModal;
let itemLink;
let pokemonClass;
let favToggle;
 

// Arrays
let cards = [];
let favPokemons = [];
let allArr = [];
let rareArr = [];
let legendsArr = [];

const pokemon = fetch("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20");
const buildDom = () => { 
	
//For the number of arrays
countNum();

//Open modal
clickForModals();

//Close modal
document.addEventListener("click", (e) => {
  if (e.target === document.querySelector(".modal.is-visible")) {
	 document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
	 document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

//DENEME
for (const text of favToggle){
	text.addEventListener("click", function() {
	 const favParent = this.parentElement.parentElement;
	 const favName = favParent.getAttribute("id");
	 const nonFav = document.querySelector(`[data-open='${favName}']`);
	 const rarityOfPoke = nonFav.dataset.item;
	 if (text.innerHTML === "Add to Favorites!") {
		 favPokemons.push(favName);
		 text.innerText = "Remove From Favs!";
		 if (rareArr.includes(favName)) {
			 removeFrom(rareArr,favName)
		 } else if (legendsArr.includes(favName)) {
			 removeFrom(legendsArr, favName);
		 } 
		 removeFrom(allArr, favName);
		 
	 } else {
		 removeFrom(favPokemons, favName);
		 if ( rarityOfPoke === "Legendary") {
			 legendsArr.push(favName);
		 } else if ( rarityOfPoke === "Rare"){
			 rareArr.push(favName);
		 } 
		 allArr.push(favName);
		 text.innerText = "Add to Favorites!";
	 }
	 nonFav.style.display = "none";
	 document.getElementById(favName).classList.remove(isVisible);
	 countNum();
	})
}

//sorting
for (const elm of filterLink) {
  elm.addEventListener("click", function () {
	 setActive(elm, toggleFilter);
	 const filter = this.dataset.filter;
	 if (filter === "a-z") {
		cards.sort((a, b) => (a.name > b.name ? 1 : -1));
		removePokes();
	 } else if (filter === "z-a") {
		cards.sort((a, b) => (a.name < b.name ? 1 : -1));
		removePokes();
	 } else {
		cardLink.forEach((card) => {
		  if (filter === "All" && allArr.includes(card.dataset.open)) {
			 card.style.display = "block";
		  } else if (filter === "Favorites" && favPokemons.includes(card.dataset.open)) {
			 card.style.display = "block";
		  } else if (filter === "Rare" && rareArr.includes(card.dataset.open)) {
			 card.style.display = "block";
		  }  else if (filter === "Legendary" && legendsArr.includes(card.dataset.open)  ) {
			 card.style.display = "block";
		  } else {
			 card.style.display = "none";
		  }
		});
	 }
  });
}



// Filtering

}

//Fetching
const fetching = async () => {
  const res = await pokemon;
  const resJson = await res.json();
  await resJson.results.map((result) => {
    let poke = fetch(result.url);
    poke
      .then((res) => res.json())
      .then((data) => {
        let { name, height, stats, id, sprites } = data;
        let card = {
          name: name,
          height: height,
          hp: stats[0].base_stat,
          attack: stats[1].base_stat,
          defense: stats[2].base_stat,
          id: id,
          img: sprites.front_default,
          rarity: fakeRarity(id),
        };
        cardOnScreen(card);
        modalOnScreen(card);
        cards.push(card);
        classify(card);
		  filterLink = document.querySelectorAll(dataFilter);
		  openModal = document.querySelectorAll(modalOpen);
		  cardLink = document.querySelectorAll(dataItem);
		  favToggle = document.querySelectorAll(favorites);
		  buildDom();
      });
  });
};

// Classify card for arrays
const classify = (card) => {
  if (card.rarity === "Rare") {
    rareArr.push(card.name);
  } else if (card.rarity === "Legendary") {
    legendsArr.push(card.name);
  } 
    allArr.push(card.name);
  
};

//Number of arrays to display
const countNum = () => {
	allCount.innerText = `All (${allArr.length})`
	rareCount.innerText = `Rare (${rareArr.length})`
	legendaryCount.innerText = `Legendary (${legendsArr.length})`
	azCount.innerText = `a-z (${allArr.length})`
	zaCount.innerText = `z-a (${allArr.length})`
	favoritesCount.innerText = `Favorites (${favPokemons.length})`
}

// Adding and removing from arrays
const removeFrom = (arr, name) => {
	const ind = arr.indexOf(name);
	arr.splice(ind,1);
};

//Removing modals for sorting
const removePokes = () => {
  pokemonClass = document.querySelectorAll(".pokemon");
  pokemonClass.forEach((poke) => poke.remove());
  cards.forEach((card) => {
    cardOnScreen(card);
  });
  openModal = document.querySelectorAll(modalOpen);
  cardLink = document.querySelectorAll(dataItem);
  clickForModals();
  noneDisp();
};

// Open Modals
const clickForModals = () => {
  for (const elm of openModal) {
    elm.addEventListener("click", function () {
      const modalId = this.dataset.open;
      document.getElementById(modalId).classList.add(isVisible);
    });
  }
};

// None displaying for a-z and z-a
const noneDisp = () => {
	cardLink.forEach((card) => {
		if (favPokemons.includes(card.dataset.open)) {
		  card.style.display = "none";
		} 
	 });
  }

//Rarity is really rare for pokemons.So I create my own fake rarity :(
let fakeRarity = (id) => {
  if ((id + 1) % 7 == 0) {
    return "Rare";
  } else if ((id + 1) % 4 == 0) {
    return "Legendary";
  } else {
    return "Common";
  }
};

console.log("cards", cards);

const cardOnScreen = (card) => {
  const div = document.createElement("div");
  div.setAttribute("data-open", card.name);
  div.setAttribute("data-item", card.rarity);
  div.className = "pokemon";
  div.innerHTML = `
	<div class="poke-infos">
		<div class="poke-img-wrapper">
			<img src="${card.img}" alt="pokeImg">
		</div>
		<h3 class="poke-name">${card.name}</h3>
			<div class="infos-flex">
		<ul class="ul-defaults-none">
		<li>Hit point: ${card.hp}</li>
		<li>Attack: ${card.attack}</li>
		<li>Defense: ${card.defense}</li>		
		<li>Height: ${card.height}</li>		
		<li>Rarity: ${card.rarity}</li>		
		</ul>
			</div>
	</div>
	`;
  apiWrapper.appendChild(div);
};

const modalOnScreen = (card) => {
  const div = document.createElement("div");
  div.setAttribute("id", card.name);
  div.setAttribute("data-animation", "slideInOutTop");
  div.className = "modal";
  div.innerHTML = `
	<div class="modal-dialog">
	<h3 class="poke-name">${card.name}</h3>
	<div class="modal-body">
		<div class="poke-img-wrapper">
			<img src="${card.img}" alt="pokeImg">
		</div>
		<div class="poke-text">
			<p>Hit point: ${card.hp}</p>
			<p>Attack: ${card.attack}</p>
			<p>Defense: ${card.defense}</p>
			<p>Rarity: ${card.rarity}</p>
		</div>
	</div>
	<div class="btn btn-primary round-pill fav">Add to Favorites!</div>
</div>
	 `;
  modal.appendChild(div);
};

//set active
const setActive = (elm, selector) => {
  if (document.querySelector(`${selector}.${active}`) !== null) {
    document.querySelector(`${selector}.${active}`).classList.remove(active);
  }
  elm.classList.add(active);
};

fetching();

