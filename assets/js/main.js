const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonModal = document.getElementById('pokemonModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const limit = 20;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
            // Garantir que pokemon.info é um array ou um array vazio
            const info = pokemon.info ? JSON.stringify(pokemon.info) : '["aqui vão vir os detalhes do pokemon", \n "em lista de detalhes"]';

            return `
                <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                    <div class="d2">
                        <button class="detalhes" 
                            data-name="${pokemon.name}" 
                            data-photo="${pokemon.photo}"
                            data-number="${pokemon.number}"
                            data-info='${info}'
                            type="button">
                            Detalhes
                        </button>
                    </div>
                </li>
            `;
        }).join('');
        pokemonList.innerHTML += newHtml;

        const detalhesButtons = document.querySelectorAll('.detalhes');
        detalhesButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.currentTarget.getAttribute('data-name');
                const photo = event.currentTarget.getAttribute('data-photo');
                const number = event.currentTarget.getAttribute('data-number');
                const infoString = event.currentTarget.getAttribute('data-info');

                // Tenta analisar o JSON e trata erros
                let info = [];
                try {
                    info = JSON.parse(infoString || '[]');
                } catch (error) {
                    console.error('Erro ao analisar data-info:', error);
                    info = []; // Usa um array vazio se ocorrer um erro
                }

                showPokemonModal(name, photo, number, info); // Passa info para a função
            });
        });
    });
}

function showPokemonModal(name, photo, number, info) {
    const infoHtml = info.map(item => `<li>${item}</li>`).join('');
    const modalHtml = `
        <span class="numberModal">${number}</span>
        <h1 class="pokemonNameModal">${name}</h1>
        <div class="detalhesModal">
            <img src="${photo}" alt="${name}" style="width: 200px; height: 100px;">
            <div class="info"  >
                <ul>

                    ${infoHtml}
                </ul>
            </div>
        </div>
    `;

    // Insere o conteúdo dinâmico no modalBody
    modalBody.innerHTML = modalHtml;
    pokemonModal.style.display = 'block'; // Exibe o modal
}

// Fecha o modal quando o usuário clica no botão de fechar
closeModal.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
});

// Fecha o modal quando o usuário clica fora do modal
window.addEventListener('click', (event) => {
    if (event.target === pokemonModal) {
        pokemonModal.style.display = 'none';
    }
});

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    loadPokemonItens(offset, limit);
});