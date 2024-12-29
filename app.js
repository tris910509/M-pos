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

  const product = products.find((product) => product.id === productId);
  if (product && product.stock >= quantity) {
    const transaction = {
      id: Date.now(),
      product: product.name,
      quantity,
      total: product.price * quantity,
    };

    product.stock -= quantity; // Update stok produk
    transactions.push(transaction);
    saveData("transactions", transactions);
    saveData("products", products);
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
        <td>${transaction.total}</td>
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

function updateTransactionOptions() {
  const transactionProduct = document.getElementById("transactionProduct");
  transactionProduct.innerHTML = '<option value="" disabled selected>Pilih Produk</option>';
  products.forEach((product) => {
    transactionProduct.innerHTML += `<option value="${product.id}">${product.name}</option>`;
  });
}
