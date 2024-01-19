addEventListener("DOMContentLoaded", (event) => {
  pokemonList();
  btnSearch();
});

// search for pokemon
const btnSearch = () => {
  const btn = document.querySelector("#search-button");
  const inpt = document.querySelector("#search-input");
  btn.addEventListener("click", () => {
    fetchPokemon(inpt.value); 
  })
}

// add pokemons to datalist
const pokemonList = async () => {
  const list = document.querySelector("#pokemonList");
  await fetch("https://pokeapi.co/api/v2/pokemon/?limit=513")
  .then(response=>response.json())
  .then(res=>{
    res.results.map(r=> {
        let option = document.createElement('option');
        option.value = r.name;   
        list.appendChild(option);
    }).join("")
  })
}

// fetch pokemon
const fetchPokemon = async (pokemon) => {
    const pokemonDts = document.querySelector("#pokemonDts");
    pokemonDts.classList.add('d-none');
    // loader
    document.querySelector("#main").innerHTML=`<div class="col-12 pt-3"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>`;
    document.querySelector("#divStats").innerHTML='';
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response=>response.json())
    .then(res=> {
        // basic stats
        basicStats(res);
        // types
        basicTypes(res);
        // stats
        secStats(res);
    })
    .catch(err=> {
        console.error(err);
        reset();
        errorMsg();
        pokemonDts.classList.remove('d-none');
    })
}

// reset values
const reset = () => {
    document.querySelector("#main").innerHTML='';
    document.querySelector("#divStats").classList.add('d-none');
    document.querySelector("#divStats").innerHTML='';
}

const errorMsg = () => {
    Swal.fire({
        title: "Pokemon not found",
        text: "You can search according to the list!",
        icon: "error"
    });
}

const basicStats = (res) => {
    document.querySelector("#main").innerHTML=`
    <div class='col-12 pt-4'>
        <div class="d-flex align-items-center">
            <h3 class="text-danger">${res.name.toUpperCase()}</h3>
            <span class="lead ms-2 font-weight-bold">#${res.id}</span>
        </div>
        <div class="d-flex align-items-center">
            <p>Weight: ${res.weight}</p>
            <p class="ms-2">Height: ${res.height}</p>
        </div>
        <div id="types">
        </div>
        <div id="sprite-container">
            <img id="sprite" src="${res.sprites.front_default}" alt="${res.name} front default sprite">
            <img id="sprite" src="${res.sprites.back_default}" alt="${res.name} back default sprite">
        </div>
    </div>
    `;
}

const basicTypes = (res) => {
    res.types.forEach(dataType => {
        const span = document.createElement("span");
        span.classList.add('badge','bg-warning','text-dark','me-2');
        span.textContent = dataType.type.name.toUpperCase();
        document.getElementById("types").append(span);
    });
}

const secStats = (res) => {
    res.stats.map((stat)=> {
        document.querySelector("#divStats").innerHTML += `
        <li class="list-group-item"><span class="statscl">${stat.stat.name}</span>: <span>${stat.base_stat}</span></li>
        `;
    }).join('');
    document.querySelector("#divStats").classList.remove('d-none');
}