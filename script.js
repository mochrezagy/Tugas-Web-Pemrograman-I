
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".product button");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateTransactionPage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // tombol beli
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productElement = button.closest(".product");
      const productName =
        productElement.querySelector(".description").textContent;
      const productPrice = parseFloat(
        productElement
          .querySelector(".new-price")
          .textContent.replace(/Rp|\./g, "")
      );

      if (!button.classList.contains("counter")) {
        // tambahkan produk ke keranjang
        button.innerHTML = `
          <button class="decrease">-</button>
          <span class="count">1</span>
          <button class="increase">+</button>
        `;
        button.classList.add("counter");

        cart.push({ name: productName, price: productPrice, quantity: 1 });
        updateTransactionPage();

        // tombol (+) dan (-)
        const decreaseBtn = button.querySelector(".decrease");
        const increaseBtn = button.querySelector(".increase");
        const countSpan = button.querySelector(".count");

        decreaseBtn.addEventListener("click", () => {
          const product = cart.find((item) => item.name === productName);
          if (product.quantity > 1) {
            product.quantity--;
            countSpan.textContent = product.quantity;
          } else {
            cart = cart.filter((item) => item.name !== productName);
            button.classList.remove("counter");
            button.innerHTML = "Beli";
          }
          updateTransactionPage();
        });

        increaseBtn.addEventListener("click", () => {
          const product = cart.find((item) => item.name === productName);
          product.quantity++;
          countSpan.textContent = product.quantity;
          updateTransactionPage();
        });
      }
    });
  });

  // render keranjang
  function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartContainer || !totalPriceElement) return;

    cartContainer.innerHTML = `
      <table border="1" width="100%" cellspacing="0" cellpadding="10" style="text-align:center; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="cart-table-body"></tbody>
      </table>
    `;

    const tableBody = document.getElementById("cart-table-body");
    let totalPrice = 0;

    cart.forEach((item, index) => {
      const totalItemPrice = item.price * item.quantity;
      totalPrice += totalItemPrice;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>Rp${item.price.toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>Rp${totalItemPrice.toLocaleString()}</td>
        <td>
          <button onclick="removeItem(${index})" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    totalPriceElement.textContent = `Rp${totalPrice.toLocaleString()}`;

    // input alamat
    const checkoutSection = document.getElementById("checkout-section");
    checkoutSection.innerHTML = `
      <label for="address">Masukkan Alamat Pengiriman:</label><br>
      <textarea id="address" rows="4" style="width: 60%; height: 100px; resize: none;"></textarea><br>
      <button id="checkout-button">Checkout</button>

    `;
  }

  // hapus item
  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateTransactionPage();
  };

  // checkout
const checkoutSection = document.getElementById("checkout-section");

if (checkoutSection) {
  checkoutSection.addEventListener("click", (e) => {
    if (e.target.id === "checkout-button") {
      const addressInput = document.getElementById("address");
      const address = addressInput?.value.trim() || "";

      if (address === "") {
        alert("Alamat pengiriman belum diisi!");
        return;
      }

      if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
      }

      let total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newWindow = window.open("", "_blank");
      newWindow.document.write(`
        <html>
          <head>
            <title>Transaksi Berhasil</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                text-align: center;
                padding: 50px;
              }
              .success-message {
                font-size: 20px;
                color: #00b14f;
                font-weight: bold;
              }
              .total {
                margin-top: 20px;
                font-size: 18px;
                color: #333;
              }
              .address {
                margin-top: 20px;
                margin-bottom: 20px;                      
                font-size: 16px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="success-message">Transaksi Berhasil!</div>
            <div class="total">Silahkan siapkan uang tunai sebesar <strong>Rp${total.toLocaleString()}</strong> sesuai pesanan.</div>
            <div class="address">Alamat Pengiriman: <strong>${address}</strong></div>
            <button onclick="window.close()" style="background-color: #00b14f; color: white; padding: 10px 20px; border: none; cursor: pointer;">
              <a href="page.html" style="text-decoration: none; color: white;">Kembali Belanja</a>
            </button>
          </body>
        </html>
      `);

      cart = [];
      updateTransactionPage();
    }
  });
}

  // Render keranjang awal
  renderCart();
});
