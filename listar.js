async function carregarLivros() {
    const resposta = await fetch('/livros');
    const livros = await resposta.json();

    const container = document.getElementById('listaLivros');

    container.innerHTML = '';

    const nomesCategorias = {
        'aventura': 'Aventura',
        'biografia': 'Biografia',
        'fantasia': 'Fantasia',
        'ficcao': 'Ficção Científica',
        'policial': 'Policial',
        'romance': 'Romance',
        'suspense': 'Suspense'
    };

    const categorias = {};

    livros.forEach(livro => {
        if (!categorias[livro.categoria]) {
            categorias[livro.categoria] = [];
        }

        categorias[livro.categoria].push(livro);
    });

    for (const categoria in categorias) {
        const tituloCategoria = document.createElement('h2');

        tituloCategoria.textContent = nomesCategorias[categoria];

        tituloCategoria.classList.add('categoria-titulo');

        container.appendChild(tituloCategoria);

        const grid = document.createElement('div');

        grid.classList.add('grid-livros');

        categorias[categoria].forEach(livro => {
            const card = document.createElement('div');

            card.classList.add('card');

            card.innerHTML = `
                <h3 class="card-titulo">${livro.titulo}</h3>

                <p class="card-texto"><strong>Autor:</strong> ${livro.autor}</p>

                <p class="card-texto"><strong>Nota:</strong> ${livro.nota}</p>

                <p class="card-texto"><strong>Descrição:</strong></p>

                <p class="card-texto">${livro.descricao}</p>

                <button
                    class="excluir"
                    onclick="excluirLivro(${livro.id})">
                    Excluir
                </button>
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    }
}

async function excluirLivro(id) {
    const confirmar = confirm('Deseja excluir este livro?');

    if (!confirmar) {
        return;
    }

    await fetch(`/livros/${id}`, {
        method: 'DELETE'
    });

    carregarLivros();
}

carregarLivros();