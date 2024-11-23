// Constants and Types
const MENU_CATEGORIES = {
    HOT: "hot",
    ICE: "ice",
};

const CURRENCY_FORMAT = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const MENU_DATA = {
    [MENU_CATEGORIES.HOT]: [
        {
            name: "Espresso",
            price: 25000,
            description:
                "Satu shot kopi murni yang kuat dan intense banget, bikin melek seketika!",
            image:
                "https://media.gettyimages.com/id/1360415100/photo/close-up-of-coffee-cup-on-table-linz-austria.jpg?s=612x612&w=0&k=20&c=-30dPmiDi9qHlYQJBuDLRhloLshrwffdyD7cVzzt03M=",
        },
        {
            name: "Cappuccino",
            price: 35000,
            description: "Perpaduan sempurna antara espresso, susu, dan buih lembut.",
            image:
                "https://media.gettyimages.com/id/1466623971/photo/cappuccino-in-a-blue-ceramic-mug-on-a-wooden-table-side-view.jpg?s=612x612&w=0&k=20&c=FLE46XFNWBNLiH_haPeWllBmiQdLcqRnUUBlsovGs9s=",
        },
        {
            name: "Latte",
            price: 35000,
            description: "Espresso smooth dengan susu kukus dan buih ringan.",
            image:
                "https://media.gettyimages.com/id/1143558350/photo/iced-coffee.jpg?s=612x612&w=0&k=20&c=DDENGCXQSMo8llqzPWGf1IbzN3gY2oBTDo8cjV_Nvcw=",
        },
        {
            name: "Mocha",
            price: 40000,
            description: "Perpaduan kopi dan coklat yang manis, cocok buat pecinta coklat.",
            image:
                "https://media.gettyimages.com/id/1324007808/photo/dalgona-coffee-with-coffee-beans-on-table.jpg?s=612x612&w=0&k=20&c=rMYdqfDabwczSHdceHnrCNwawEhTQy4N7hPqzJErl5c=",
        },
    ],
    [MENU_CATEGORIES.ICE]: [
        {
            name: "Es Kopi",
            price: 30000,
            description: "Kopi dingin klasik khas Indonesia. Segar maksimal!",
            image:
                "https://media.gettyimages.com/id/564207259/photo/cold-brew-coffee.jpg?s=612x612&w=0&k=20&c=lLlEdQ4bMy9XOZN0TMvrkjMnETASLIvAkdFDmi5f-tg=",
        },
        {
            name: "Cold Brew",
            price: 40000,
            description: "Kopi halus tanpa asam, diracik selama 12 jam.",
            image:
                "https://media.gettyimages.com/id/1500695297/photo/cold-brew-black-coffee-with-ice.jpg?s=612x612&w=0&k=20&c=KA08osP_fOH2eS499O-2uht785iaXEo2z51TOtGlg8Q=",
        },
        {
            name: "Es Kopi Susu",
            price: 40000,
            description: "Kopi susu dingin khas Indonesia yang creamy abis!",
            image:
                "https://media.gettyimages.com/id/1143558350/photo/iced-coffee.jpg?s=612x612&w=0&k=20&c=DDENGCXQSMo8llqzPWGf1IbzN3gY2oBTDo8cjV_Nvcw=",
        },
        {
            name: "Frappuccino",
            price: 45000,
            description: "Kopi blended dingin dengan krim dan topping. Yummy!",
            image:
                "https://media.gettyimages.com/id/1312309024/photo/eisgetr%C3%A4nk-mit-kaffee.jpg?s=612x612&w=0&k=20&c=aFgEYFRX5eQwMu6rkDF18U3NC9AWXBFsxaqb5X_Wucw=",
        },
    ],
};

// Cart Store with Publisher/Subscriber Pattern
class CartStore {
    #items = [];
    #subscribers = new Set();

    subscribe(callback) {
        this.#subscribers.add(callback);
        return () => this.#subscribers.delete(callback);
    }

    #notify() {
        this.#subscribers.forEach((callback) => callback(this.#items));
    }

    addItem(item) {
        const existingItem = this.#items.find((i) => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.#items.push({ ...item, quantity: 1 });
        }
        this.#notify();
    }

    updateQuantity(index, delta) {
        const item = this.#items[index];
        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            this.#items.splice(index, 1);
        } else {
            item.quantity = newQuantity;
        }
        this.#notify();
    }

    clear() {
        this.#items = [];
        this.#notify();
    }

    getTotal() {
        return this.#items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

    getCount() {
        return this.#items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getItems() {
        return [...this.#items];
    }
}

// UI Controller
class CoffeeShopUI {
    #cart;
    #elements = {};
    #isMenuVisible = false;

    constructor(cart) {
        this.#cart = cart;
        this.#initializeElements();
        this.#setupEventListeners();
        this.#setupCartSubscription();
        this.#renderInitialUI();
    }

    #initializeElements() {
        const ids = [
            "menuToggle",
            "navbar",
            "cartCount",
            "cartListModal",
            "cartTotalModal",
            "toast",
            "orderForm",
            "cartModal",
            "itemModal",
            "cartModalCloseBtn",
            "modalItemName",
            "modalItemImage",
            "modalItemDescription",
            "modalItemPrice",
            "modalAddToCartBtn",
            "modalCloseBtn"
        ];

        ids.forEach((id) => {
            this.#elements[id] = document.getElementById(id);
        });
    }

    #setupEventListeners() {
        this.#elements.menuToggle.addEventListener("click", () =>
            this.#toggleMenu()
        );
        this.#elements.cartModal.addEventListener("click", (e) => {
            if (e.target === this.#elements.cartModal) this.#closeCartModal();
        });
        this.#elements.itemModal.addEventListener("click", (e) => {
            if (e.target === this.#elements.itemModal) this.#closeItemModal();
        });
        this.#elements.orderForm.addEventListener("submit", (e) =>
            this.#handleOrder(e)
        );
        this.#elements.modalCloseBtn?.addEventListener("click", () => {
            this.#closeItemModal();
        });
        this.#elements.cartModalCloseBtn?.addEventListener("click", () => {
            this.#closeCartModal();
        });

        window.addEventListener("resize", () => this.#handleResize());
    }

    #setupCartSubscription() {
        this.#cart.subscribe(() => {
            this.#updateCartUI();
        });
    }

    #renderInitialUI() {
        this.#renderMenuSections();
        this.#createFeaturedCards();
        this.#updateCartUI();
    }

    #renderMenuSections() {
        Object.entries(MENU_DATA).forEach(([category, items]) => {
            const sectionId =
                category === MENU_CATEGORIES.HOT ? "hotCoffee" : "iceCoffee";
            const container = document.querySelector(`#${sectionId} ul`);
            container.innerHTML = this.#generateMenuItems(items);
        });
    }

    #generateMenuItems(items) {
        return items
            .map(
                (item) => `
  <li class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onclick="app.showItemModal('${item.name}', ${item.price}, '${item.description
                    }', '${item.image}')">
    <span class="font-medium">${item.name}</span>
    <span class="text-coffee font-bold">${CURRENCY_FORMAT.format(
                        item.price
                    )}</span>
  </li>
`
            )
            .join("");
    }

    #createFeaturedCards() {
        document.querySelectorAll(".menu-card").forEach((card) => {
            const { name, price, desc, image } = card.dataset;
            const imageUrl = image || "https://g-dramnwrswer.vusercontent.net/placeholder.svg?height=320&width=400";

            card.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="w-full h-48 object-cover">
    <div class="p-4">
      <h3 class="font-bold text-xl mb-2">${name}</h3>
      <p class="text-gray-600 mb-4 h-20">${desc}</p>
      <div class="flex justify-between items-center">
        <span class="text-coffee font-bold">${CURRENCY_FORMAT.format(
                price
            )}</span>
        <button 
          class="bg-coffee text-white px-4 py-2 rounded-lg hover:bg-coffee-dark transition-colors"
          onclick="app.showItemModal('${name}', ${price}, '${desc}', '${imageUrl}')"
        >
          View Detail
        </button>
      </div>
    </div>
  `;
        });
    }

    #updateCartUI() {
        this.#elements.cartCount.textContent = this.#cart.getCount();
        this.#updateCartModal();
    }

    #updateCartModal() {
        const items = this.#cart.getItems();
        this.#elements.cartListModal.innerHTML = items
            .map(
                (item, index) => `
  <li class="flex justify-between items-center p-2 border-b">
    <span>${item.name}</span>
    <div class="flex items-center">
      <button onclick="app.updateQuantity(${index}, -1)" 
              class="px-2 hover:bg-gray-100 rounded">-</button>
      <span class="mx-2">${item.quantity}</span>
      <button onclick="app.updateQuantity(${index}, 1)" 
              class="px-2 hover:bg-gray-100 rounded">+</button>
    </div>
    <span class="text-coffee">${CURRENCY_FORMAT.format(
                    item.price * item.quantity
                )}</span>
  </li>
`
            )
            .join("");

        this.#elements.cartTotalModal.textContent = `Total: ${CURRENCY_FORMAT.format(
            this.#cart.getTotal()
        )}`;
    }

    showItemModal(name, price, description, image) {
        const {
            modalItemName,
            modalItemImage,
            modalItemDescription,
            modalItemPrice,
            modalAddToCartBtn,
            itemModal,
        } = this.#elements;

        modalItemName.textContent = name;
        modalItemImage.src = image;
        modalItemImage.alt = name;
        modalItemDescription.textContent = description;
        modalItemPrice.textContent = CURRENCY_FORMAT.format(price);

        modalAddToCartBtn.onclick = () => {
            this.#cart.addItem({ name, price });
            this.#showToast(`${name} ditambahkan ke keranjang!`);
            this.#closeItemModal();
        };

        itemModal.classList.remove("hidden");
    }

    updateQuantity(index, delta) {
        this.#cart.updateQuantity(index, delta);
    }

    toggleCartModal() {
        this.#elements.cartModal.classList.toggle("hidden");
        this.#updateCartModal();
    }

    #closeCartModal() {
        this.#elements.cartModal.classList.add("hidden");
    }

    #closeItemModal() {
        this.#elements.itemModal.classList.add("hidden");
    }

    #handleOrder(e) {
        e.preventDefault();
        if (this.#cart.getCount() === 0) {
            this.#showToast("Keranjang masih kosong!");
            return;
        }

        this.#cart.clear();
        this.#closeCartModal();
        this.#showToast("Order berhasil dibuat!");
        e.target.reset();
    }

    #toggleMenu() {
        this.#isMenuVisible = !this.#isMenuVisible;
        this.#elements.navbar.classList.toggle("hidden");
    }

    #handleResize() {
        if (window.innerWidth >= 768) {
            this.#elements.navbar.classList.remove("hidden");
        } else if (!this.#isMenuVisible) {
            this.#elements.navbar.classList.add("hidden");
        }
    }

    #showToast(message) {
        const toast = this.#elements.toast;
        toast.textContent = message;
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 3000);
    }
}

// Initialize Application
let app;
document.addEventListener("DOMContentLoaded", () => {
    const cart = new CartStore();
    app = new CoffeeShopUI(cart);
});