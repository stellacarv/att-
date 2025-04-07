document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api"; // Atualize para sua API
  const clienteModal = document.getElementById("clienteModal");
  const clienteForm = document.getElementById("clienteForm");
  const addClienteBtn = document.getElementById("addClienteBtn");
  const modalTitle = document.getElementById("modalTitle");
  let editClienteId = null;

  // Carregar clientes
  const loadCliente = async () => {
    const response = await fetch(`${apiUrl}/clientes`);
    const clientes = await response.json();
    const tableBody = document.querySelector("#clienteTable tbody");
    tableBody.innerHTML = "";

    clientes.forEach((cliente) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${cliente.name}</td>
                <td>${cliente.profile}</td>
                <td>
                    <button class="editClienteBtn" data-id="${cliente._id}">Editar</button>
                    <button class="deleteClienteBtn" data-id="${cliente._id}">Apagar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Adicionar eventos de edição e deleção
    document.querySelectorAll(".editClienteBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        openEditClienteModal(e.target.dataset.id)
      );
    });

    document.querySelectorAll(".deleteClienteBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        deleteCliente(e.target.dataset.id)
      );
    });
  };

  // Add Cliente
  const addCliente = async (cliente) => {
    await fetch(`${apiUrl}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    loadCliente();
  };

  // Atualizar cliente
  const updateCliente = async (id, cliente) => {
    await fetch(`${apiUrl}/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    loadCliente();
  };

  // Função para deletar usuário
  const deleteCliente = async (id) => {
    await fetch(`${apiUrl}/clientes/${id}`, {
      method: "DELETE",
    });
    loadCliente();
  };

  // Abrir modal para editar usuário
  const openEditClienteModal = async (id) => {
    editClienteId = id;
    modalTitle.innerText = "Editar Cliente";

    // Buscar os dados do cli para preencher o modal
    const response = await fetch(`${apiUrl}/clientes/${id}`);
    const cliente = await response.json();

    document.getElementById("name").value = cliente.name;
    document.getElementById("profile").value = cliente.profile;
    document.getElementById("password").value = ""; // Não exibir senha

    clienteModal.style.display = "block";
  };

  // Adicionar novo usuário
  const openAddClienteModal = () => {
    editClienteId = null;
    modalTitle.innerText = "Adicionar Cliente";
    clienteForm.reset();
    clienteModal.style.display = "block";
  };

  // Fechar modal ao clicar no "x"
  document.querySelector(".close").addEventListener("click", () => {
    clienteModal.style.display = "none";
  });

  // Fechar modal ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === clienteModal) {
      clienteModal.style.display = "none";
    }
  });

  // Submissão do formulário
  clienteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const clienteData = {
      name: document.getElementById("name").value,
      profile: document.getElementById("profile").value,
      password: document.getElementById("password").value,
    };

    if (editClienteId) {
      await updateCliente(editClienteId, clienteData);
    } else {
      await addCliente(clienteData);
    }

    clienteModal.style.display = "none";
    loadCliente();
  });

  // Carregamento de usuários e eventos
  addClienteBtn.addEventListener("click", openAddClienteModal);
  loadCliente();
});
