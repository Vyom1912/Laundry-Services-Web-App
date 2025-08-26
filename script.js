const burger = document.querySelector(".resp");
const navLinks = document.querySelector(".nav-links");
burger.addEventListener("click", () => {
  navLinks.classList.toggle("respDisplay");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("respDisplay");
  });
});
// ----------------------------------------
// number counter animation
// ----------------------------------------
const achiNumber = document.querySelectorAll(".achi-count");
let speed = 200;
achiNumber.forEach((myCount) => {
  const target_count = +myCount.dataset.count;
  let init_count = +myCount.innerText;
  let equalSpeed = Math.max(1, Math.floor(target_count / speed));
  //   let equalSpeed = Math.floor(target_count / speed);

  const updateCounterNumber = () => {
    init_count = init_count + equalSpeed;
    myCount.innerText = init_count;
    if (init_count < target_count) {
      myCount.innerHTML = Math.floor(init_count);
      setTimeout(updateCounterNumber, 1);
    }
  };
  updateCounterNumber();
});
// ----------------------------------------
// services section
// ----------------------------------------
(function () {
  const addBtns = document.querySelectorAll(".service-add-btn");
  const cartTable = document.querySelector(".service-cart-table");
  const cartTotalBox = document.querySelector(".service-cart-total");
  const bookBtn = document.querySelector(".service-cart-btn .button");

  // Save original cart markup so we can restore it later
  const originalCartHTML = cartTable.innerHTML;
  const originalTotalHTML = cartTotalBox.innerHTML;

  let total = 0;

  // Utility: parse "₹2,800.00" -> 2800
  const parsePrice = (txt) =>
    parseFloat((txt || "").replace(/[^\d.]/g, "")) || 0;

  // Utility: get the live total element (because it can be re-created)
  const totalEl = () => document.querySelector(".total-price");

  // Get clean service name (without icon & price)
  function getServiceInfo(btn) {
    const row = btn.closest(".service-list-row");
    const nameEl = row.querySelector(".service-name").cloneNode(true);
    nameEl.querySelectorAll("i, .service-price").forEach((el) => el.remove());
    const name = nameEl.textContent.trim().replace(/\s+/g, " ");
    const price = parsePrice(row.querySelector(".service-price").textContent);
    return { name, price };
  }

  function setTotal(newTotal) {
    total = Math.max(0, +newTotal.toFixed(2));
    const t = totalEl();
    if (t) t.textContent = `₹${total.toFixed(2)}`;
  }

  function updateNumberingAndEmptyState() {
    const rows = cartTable.querySelectorAll(
      ".service-cart-table-row:not(.header)"
    );
    rows.forEach((r, i) => {
      let noCell = r.querySelector(".sr-no");
      if (!noCell) {
        noCell = document.createElement("div");
        noCell.className = "sr-no";
        r.insertBefore(noCell, r.firstElementChild);
      }
      noCell.textContent = i + 1; // 1,2,3...
    });

    const emptyMsg = cartTable.querySelector(".empty-message");
    if (emptyMsg) emptyMsg.style.display = rows.length ? "none" : "block";
  }

  function restoreCartIfNeeded() {
    // If the cart header is missing (we showed a thank-you), rebuild the cart UI
    if (!cartTable.querySelector(".header")) {
      cartTable.innerHTML = originalCartHTML;
      cartTotalBox.innerHTML = originalTotalHTML;
      total = 0;
      setTotal(0);
    }
  }

  // ===== Add/Remove items =====
  addBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      restoreCartIfNeeded();

      const { name, price } = getServiceInfo(btn);
      const existing = cartTable.querySelector(
        `.service-cart-table-row[data-index="${idx}"]`
      );

      if (btn.classList.contains("added")) {
        // Remove from cart
        btn.classList.remove("added");
        btn.innerHTML = `Add Item <i class="fa-solid fa-circle-plus"></i>`;
        if (existing) {
          existing.remove();
          setTotal(total - price);
        }
      } else {
        // Add to cart
        btn.classList.add("added");
        btn.innerHTML = `Remove Item <i class="fa-solid fa-circle-minus"></i>`;
        const row = document.createElement("div");
        row.className = "service-cart-table-row";
        row.dataset.index = idx; // link this cart row to the service button
        row.style.display = "grid"; // ensure grid layout
        row.innerHTML = `
            <div class="sr-no cart-data"></div>
            <div class="service-name cart-data">${name}</div>
            <div class="service-price cart-data">₹${price.toFixed(2)}</div>
          `;
        cartTable.appendChild(row);
        setTotal(total + price);
      }

      updateNumberingAndEmptyState();
    });
  });

  // ===== Book Now (no <form>, just a button) =====
  if (bookBtn) {
    bookBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const name =
        document
          .querySelector('.service-person-info input[placeholder="Full Name"]')
          ?.value.trim() || "";
      const email =
        document
          .querySelector('.service-person-info input[placeholder="Email id"]')
          ?.value.trim() || "";
      const phone =
        document
          .querySelector(
            '.service-person-info input[placeholder="Phone Number"]'
          )
          ?.value.trim() || "";

      if (!name || !email || !phone) {
        alert("Please fill out your Name, Email, and Phone number.");
        return;
      }

      const itemRows = cartTable.querySelectorAll(
        ".service-cart-table-row:not(.header)"
      );
      if (itemRows.length === 0) {
        alert("Please add at least one service to your cart.");
        return;
      }

      // Optional: collect payload (debug/log)
      const items = Array.from(itemRows).map((r) => ({
        name: r.querySelector(".service-name")?.textContent?.trim() || "",
        price: r.querySelector(".service-price")?.textContent?.trim() || "",
      }));
      console.log("Booking payload:", {
        name,
        email,
        phone,
        items,
        total: totalEl()?.textContent || "₹0.00",
      });

      // Reset buttons (so you can add again later)
      addBtns.forEach((btn) => {
        btn.classList.remove("added");
        btn.innerHTML = `Add Item <i class="fa-solid fa-circle-plus"></i>`;
      });

      // Clear inputs
      document
        .querySelectorAll(".service-person-info input")
        .forEach((inp) => (inp.value = ""));

      // Show thank-you message (replace the cart contents),
      // but keep add buttons alive; next add will restore the cart
      cartTable.innerHTML = `
          <h3>Thank you For Booking the Service</h3>
          <p style="margin-top:8px;">We will get back to you soon!</p>
        `;
      cartTotalBox.innerHTML = ""; // hide total until user adds again
    });
  }

  // Init
  updateNumberingAndEmptyState();
  setTotal(0);
})();
// ----------------------------------
// subscribe

const form = document.getElementById("subForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop form from refreshing page

  if (fullName.value.trim() && email.value.trim()) {
    console.log("Data submitted:", {
      name: fullName.value,
      email: email.value,
    });

    // clear inputs
    fullName.value = "";
    email.value = "";

    // show success message
    successMsg.style.display = "block";

    // hide message after 3 seconds
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 5000);
  }
});
