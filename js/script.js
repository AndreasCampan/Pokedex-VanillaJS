// An IIFE containing the pokedex API and functions
const pokemonRepo = (function () {
  const pokemonNameList = [];
  // Database
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

  // Capitalize the name of each pokemon
  function cap(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function byId(a, b) {
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  }

  // Adds the iterated pokemon to the PokemonNameList array
  function add(pokemon) {
    if (typeof pokemon === 'object') {
      pokemonNameList.push(pokemon);
    } else {
      console.log('you need an object');
    }
  }

  // Retrieves the Pokemon array and sorts by Id
  function getAll() {
    return pokemonNameList.sort(byId);
  }

  // Function that will display pokemon details in the modal
  function showDetails(pokemon) {
    const page = document.querySelector('.pokedex-window');

    function hide() {
      const removeNode = page.querySelector('.modal-foreground');
      removeNode.remove();
    }

    // A function to create the modal and it's content
    function container() {
      const creatediv = document.createElement('div');
      const createbutton = document.createElement('button');
      const createimg = document.createElement('img');
      const createspan = document.createElement('span');
      const createname = document.createElement('h1');
      const createheight = document.createElement('p');
      const createweight = document.createElement('p');
      const createability = document.createElement('p');
      const createtype = document.createElement('p');

      creatediv.classList.add('modal-foreground');
      createbutton.classList.add('close');
      createimg.classList.add('pokemon-img');
      createspan.classList.add('details-text');

      createbutton.innerHTML = 'X';
      createbutton.addEventListener('click', hide);
      createimg.src = pokemon.imageURLanimated;
      createimg.alt = `Image of ${pokemon.name}`;
      createname.innerHTML = cap(pokemon.name);
      createheight.innerHTML = `<strong>Height: </strong> ${pokemon.height * 10}cm`;
      createweight.innerHTML = `<strong>Weight: </strong>${pokemon.weight}lbs`;
      createtype.innerHTML = `<strong>Types: </strong>${pokemon.types}`;
      createability.innerHTML = `<strong>Abilities: </strong>${pokemon.abilities}`;

      // Appends all the created elements to the pokedex window
      createspan.appendChild(createbutton);

      createspan.appendChild(createheight);
      createspan.appendChild(createweight);
      createspan.appendChild(createability);
      createspan.appendChild(createtype);
      creatediv.appendChild(createimg);
      creatediv.appendChild(createname);
      creatediv.appendChild(createspan);
      page.prepend(creatediv);

      creatediv.classList.add('visible');
    }

    window.addEventListener('keydown', (event) => {
      const y = page.querySelector('div');
      if (event.key === 'Escape' && y.classList.contains('visible')) {
        hide();
      }
    });
    container();
  }

  // function to show a loading page while retrieving data.
  function showLoading() {
    const pokemonList = document.querySelector('.pokedex-window');
    const newDiv = document.createElement('div');
    newDiv.innerText = 'Loading List!';
    newDiv.classList.add('msg-board');
    pokemonList.prepend(newDiv);
  }

  // function to hide loading page after retrieving data.
  function hideLoading() {
    const pokemonList = document.querySelector('.pokedex-window');
    const selectedNode = pokemonList.firstElementChild;
    selectedNode.parentElement.removeChild(selectedNode);
  }

  /* Appends to the page a list of pokemon from the api */
  function addListItem(pokemon) {
    const pokemonList = document.querySelector('.pokemon-list');
    const listItem = document.createElement('li');
    const button = document.createElement('button');

    button.innerText = cap(pokemon.name);
    button.classList.add('pokemon-list-style');
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    // event listener for a click to run the showDetails function
    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }

  // A function for mimicking a powering down button of the app
  function powerDown() {
    const powerButton = document.querySelector('.header-powerbttn');
    powerButton.addEventListener('click', () => {
      if (window.confirm('Are you sure you want to power down?')) {
        document.body.style.display = 'none';
      }
    });
  }

  // Loads the pokemon API and fetches the details API for each pokemon
  function loadList() {
    showLoading();
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => Promise.all(data.results.map((item) => fetch(item.url)
        .then((response) => response.json())
        .then((innerItem) => {
          const pokemon = {
            id: innerItem.id,
            name: innerItem.name,
            height: innerItem.height,
            weight: innerItem.weight,
            imageURL: innerItem.sprites.versions['generation-v']['black-white'].front_default,
            imageURLanimated: innerItem.sprites.versions['generation-v']['black-white'].animated.front_default,
            abilities: [],
            types: []
          };
          innerItem.abilities.forEach((innerItemAbility) => {
            pokemon.abilities.push(` ${cap(innerItemAbility.ability.name)}`);
          });
          innerItem.types.forEach((itemType) => {
            pokemon.types.push(` ${cap(itemType.type.name)}`);
          });
          add(pokemon);
        }))))
      .then(() => {
        hideLoading();
      })
      .catch((e) => {
        hideLoading();
        console.error(e);
      });
  }

  // Allows access to the IIFE from outside the function
  return {
    getAllf: getAll,
    addListItemf: addListItem,
    loadListf: loadList,
    powerDownf: powerDown
  };
}());

pokemonRepo.loadListf()
  .then(() => {
    pokemonRepo.getAllf().forEach((pokemon) => {
      pokemonRepo.addListItemf(pokemon);
    });
  })
  .catch((e) => {
    console.log(e);
  });

// Runs the powerdown function to shut down the page if clicked
pokemonRepo.powerDownf();
