document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api"; // Atualize para o URL correto da sua API
  const estoqueModal = document.getElementById("estoqueModal");
  const estoqueForm = document.getElementById("estoqueForm");
  const addEstoqueBtn = document.getElementById("addEstoqueBtn");
  const modalTitleEstoque = document.getElementById("modalTitleEstoque");
  let editEstoqueId = null;

  // Função para carregar plantações
  const loadEstoque = async () => {
    const response = await fetch(`${apiUrl}/estoque`);
    const estoque = await response.json();
    const tableBody = document.querySelector("#estoqueTable tbody");
    tableBody.innerHTML = "";

    estoque.forEach((estoque) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${estoque.item}</td>
                <td>${estoque.name}</td>
                <td>${estoque.description}</td>
                <td>${estoque.brand}</td>
                <td>
                    <button class="editEstoqueBtn" data-id="${estoque._id}">Editar</button>
                    <button class="deleteEstoqueBtn" data-id="${estoque._id}">Deletar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Adicionar eventos de edição e deleção
    document.querySelectorAll(".editEstoqueBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        openEditEstoqueModal(e.target.dataset.id)
      );
    });

    document.querySelectorAll(".deleteEstoqueBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        deleteEstoque(e.target.dataset.id)
      );
    });
  };

  // Função para adicionar plantação
  const addEstoque = async (estoque) => {
    await fetch(`${apiUrl}/estoque`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estoque),
    });
    loadEstoque();
  };

  // Função para atualizar plantação
  const updateEstoque = async (id, estoque) => {
    await fetch(`${apiUrl}/estoque/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estoque),
    });
    loadEstoque();
  };

  // Função para deletar plantação
  const deleteEstoque = async (id) => {
    await fetch(`${apiUrl}/estoque/${id}`, {
      method: "DELETE",
    });
    loadEstoque();
  };

  // Abrir modal para editar plantação
  const openEditEstoqueModal = async (id) => {
    editEstoqueId = id;
    modalTitleEstoque.innerText = "Editar Produto";

    // Buscar os dados da plantação para preencher o modal
    const response = await fetch(`${apiUrl}/estoque/${id}`);
    if (response.status === 404) {
      console.error("Produto não encontrado");
      return;
    }
    const estoque = await response.json();

    document.getElementById("item").value = estoque.item;
    document.getElementById("name").value = estoque.name;
    document.getElementById("description").value = estoque.description;
    document.getElementById("brand").value = estoque.brand;

    estoqueModal.style.display = "block";
  };

  // Abrir modal para adicionar nova plantação
  const openAddEstoqueModal = async () => {
    editEstoqueId = null;
    modalTitleEstoque.innerText = "Adicionar Produto";
    estoqueForm.reset();
    await loadCliente(); // Carrega os usuários sem pré-selecionar nenhum
    estoqueModal.style.display = "block";
  };

  // Carregar usuários para o select de responsável
  const loadCliente = async (selectedClienteId = null) => {
    const response = await fetch(`${apiUrl}/estoque`);
    const cliente = await response.json();
    const select = document.getElementById("brand");
    select.innerHTML = ""; // Limpa o select

    cliente.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente._id;
      option.text = cliente.name;
      if (cliente._id === selectedClienteId) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  };

  // Fechar modal ao clicar no "x"
  document.querySelector(".close").addEventListener("click", () => {
    estoqueModal.style.display = "none";
  });

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === estoqueModal) {
      estoqueModal.style.display = "none";
    }
  });

  // Submissão do formulário
  estoqueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const estoqueData = {
      item: document.getElementById("item").value,
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      brand: document.getElementById("brand").value,
    };

    if (editEstoqueId) {
      await updateEstoque(editEstoqueId, estoqueData);
    } else {
      await addEstoque(estoqueData);
    }

    estoqueModal.style.display = "none";
    loadEstoque();
  });

  // Inicializando o carregamento de plantações e eventos
  addEstoqueBtn.addEventListener("click", openAddEstoqueModal);
  loadEstoque();
});
