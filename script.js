let cartCount = 0;

function loadMenu() {
    console.log("Fetching menu data...");
    
    fetch('./pizza-json')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            const menuSection = document.getElementById('menu');
            menuSection.innerHTML = ""; // تفريغ السيكشن

            if (data.pizzas && data.pizzas.length > 0) {
                // تجميع البيتزا في مجموعات حسب النوع (Category)
                const categories = {};
                data.pizzas.forEach(pizza => {
                    if (!categories[pizza.category]) {
                        categories[pizza.category] = [];
                    }
                    categories[pizza.category].push(pizza);
                });

                for (const categoryName in categories) {
                    
                    let displayTitle = categoryName.toLowerCase().includes("pizza") 
                                       ? categoryName 
                                       : categoryName + " Pizza";

                    menuSection.innerHTML += `<h1 class="category-title">${displayTitle}</h1>`;
                    
                    categories[categoryName].forEach(pizza => {
                        menuSection.innerHTML += `
                            <div class="pizza-card">
                                <img src="${pizza.image}" alt="${pizza.name}">
                                <h2>${pizza.name}</h2>
                                <p>${pizza.ingredients}</p>
                                <div class="pizza-price">
                                    <span class="size-btn">S<br> ${pizza.prices.S} L.E</span>
                                    <span class="size-btn">M<br> ${pizza.prices.M} L.E</span>
                                    <span class="size-btn">L<br> ${pizza.prices.L} L.E</span>
                                </div>
                                <button class="add-to-cart">Add To Cart</button>
                            </div>
                        `;
                    });
                }
                

                rebindEvents(); 
            } else {
                menuSection.innerHTML = "<h1>No pizzas found in database.</h1>";
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            document.getElementById('menu').innerHTML = "<h1>Error loading data from server</h1>";
        });
}

function rebindEvents() {
    const cartText = document.getElementById("cart-count");
    const cartMessage = document.getElementById("cart-message");

    document.querySelectorAll(".size-btn").forEach(span => {
        span.addEventListener("click", function () {
            const parentCard = span.closest(".pizza-price");
            parentCard.querySelectorAll(".size-btn").forEach(s => s.classList.remove("selected"));
            span.classList.add("selected");
        });
    });

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const card = button.closest('.pizza-card');
            const pizzaName = card.querySelector('h2').textContent;
            const selectedSpan = card.querySelector('.size-btn.selected');

            if (selectedSpan) {
                const fullText = selectedSpan.innerText;
                const sizeName = fullText.charAt(0);

                cartCount++;
                cartText.textContent = "Cart: " + cartCount;

                cartMessage.textContent = pizzaName + " (Size: " + sizeName + ") added to cart!";
                cartMessage.classList.add("show");

                setTimeout(() => cartMessage.classList.remove("show"), 1500);

                button.textContent = "Added!";
                setTimeout(() => button.textContent = "Add To Cart", 1000);
            } else {
                alert("Please select a size (S, M, or L) first!");
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", loadMenu);