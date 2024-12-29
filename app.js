// Inisialisasi Data
let products = JSON.parse(localStorage.getItem("products")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Render semua data awal
renderProducts();
renderCategories();
renderSuppliers();
renderTransactions();

// Fungsi menyimpan ke LocalStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ========================== PRODUK ==========================
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("productName").value;
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);

  const product = {
    id: Date.now(),
    name,
    category,
    price,
    stock,
  };

  products.push(product);
  saveData("products", products);
  renderProducts();
  this.reset();
});

function renderProducts() {
  const tableBody = document.querySelector("#productTable tbody");
  tableBody.innerHTML = "";
  products.forEach((product) => {
    const row = `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Hapus</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  // Update opsi produk pada transaksi
  updateTransactionOptions();
}

function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);
  saveData("products", products);
  renderProducts();
}

// ========================== KATEGORI ==========================
document.getElementById("categoryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value;

  const category = {
    id: Date.now(),
    name,
  };

  categories.push(category);
  saveData("categories", categories);
  renderCategories();
  this.reset();
});

function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  const categorySelect = document.getElementById("productCategory");
  categoryList.innerHTML = "";
  categorySelect.innerHTML = '<option value="" disabled selected>Pilih Kategori</option>';

  categories.forEach((category) => {
    const item = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${category.name}
        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Hapus</button>
      </li>
    `;
    categoryList.innerHTML += item;
    categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
  });
}

function deleteCategory(id) {
  categories = categories.filter((category) => category.id !== id);
  saveData("categories", categories);
  renderCategories();
}

// ========================== SUPPLIER ==========================
document.getElementById("supplierForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("supplierName").value;
  const contact = document.getElementById("supplierContact").value;
  const address = document.getElementById("supplierAddress").value;

  const supplier = {
    id: Date.now(),
    name,
    contact,
    address,
  };

  suppliers.push(supplier);
  saveData("suppliers", suppliers);
  renderSuppliers();
  this.reset();
});

function renderSuppliers() {
  const supplierList = document.getElementById("supplierList");
  supplierList.innerHTML = "";
  suppliers.forEach((supplier) => {
    const item = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${supplier.name} (${supplier.contact})
        <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})">Hapus</button>
      </li>
    `;
    supplierList.innerHTML += item;
  });
}

function deleteSupplier(id) {
  suppliers = suppliers.filter((supplier) => supplier.id !== id);
  saveData("suppliers", suppliers);
  renderSuppliers();
}

// ========================== TRANSAKSI ==========================
document.getElementById("transactionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const productId = parseInt(document.getElementById("transactionProduct").value);
  const quantity = parseInt(document.getElementById("transactionQuantity").value);
  const payment = parseFloat(document.getElementById("transactionPayment").value);

  const product = products.find((product) => product.id === productId);
  if (product && product.stock >= quantity) {
    const totalPrice = product.price * quantity;
    const change = payment - totalPrice;
    const status = change >= 0 ? "Lunas" : "Belum Lunas";

    if (change < 0) {
      alert("Uang yang dibayarkan kurang!");
      return;
    }

    const transaction = {
      id: Date.now(),
      product: product.name,
      quantity,
      totalPrice,
      payment,
      change,
      status,
    };

    // Update stok produk
    product.stock -= quantity;

    // Simpan transaksi
    transactions.push(transaction);
    saveData("transactions", transactions);
    saveData("products", products);

    // Render ulang data
    renderTransactions();
    renderProducts();
  } else {
    alert("Stok tidak mencukupi atau produk tidak ditemukan!");
  }

  this.reset();
});

function renderTransactions() {
  const tableBody = document.querySelector("#transactionTable tbody");
  tableBody.innerHTML = "";
  transactions.forEach((transaction) => {
    const row = `
      <tr>
        <td>${transaction.id}</td>
        <td>${transaction.product}</td>
        <td>${transaction.quantity}</td>
        <td>${transaction.totalPrice}</td>
        <td>${transaction.payment}</td>
        <td>${transaction.change}</td>
        <td><span class="badge bg-${transaction.status === "Lunas" ? "success" : "danger"}">${transaction.status}</span></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${transaction.id})">Hapus</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveData("transactions", transactions);
  renderTransactions();
}



function updateDashboard() {
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalCategories").textContent = categories.length;
  document.getElementById("totalSuppliers").textContent = suppliers.length;
  document.getElementById("totalTransactions").textContent = transactions.length;
}
updateDashboard();



document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const activeTab = document.querySelector(".tab-pane.active").id;

  let rows;
  if (activeTab === "products") {
    rows = document.querySelectorAll("#productTable tbody tr");
  } else if (activeTab === "categories") {
    rows = document.querySelectorAll("#categoryList .list-group-item");
  } else if (activeTab === "suppliers") {
    rows = document.querySelectorAll("#supplierList .list-group-item");
  } else if (activeTab === "transactions") {
    rows = document.querySelectorAll("#transactionTable tbody tr");
  }

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchValue) ? "" : "none";
  });
});



function editProduct(id) {
  const product = products.find((product) => product.id === id);
  if (product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;

    // Simpan perubahan
    document.getElementById("productForm").onsubmit = function (e) {
      e.preventDefault();
      product.name = document.getElementById("productName").value;
      product.category = document.getElementById("productCategory").value;
      product.price = parseFloat(document.getElementById("productPrice").value);
      product.stock = parseInt(document.getElementById("productStock").value);

      saveData("products", products);
      renderProducts();
      this.reset();
      document.getElementById("productForm").onsubmit = addProduct; // Kembali ke fungsi tambah
    };
  }
}



function validateForm(inputs) {
  for (let input of inputs) {
    if (input.value.trim() === "") {
      alert("Semua kolom harus diisi!");
      input.focus();
      return false;
    }
  }
  return true;
}





if (!validateForm(this.elements)) return;










