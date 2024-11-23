function manageRestaurantAndSearch() {
    const params = new URL(window.location.href).searchParams;
    const docID = params.get("docID"); // Get the "docID" parameter from the URL
    const query = document.getElementById("searchInput")?.value.toLowerCase().trim(); // Get and trim the search query
    const resultsDiv = document.getElementById("searchResults");

    function handleOrder(menuItemName, menuItemPrice, menuItemCode) {
        const user = firebase.auth().currentUser;

        if (!user) {
            alert("User not logged in.");
            return;
        }

        const userId = user.uid; // Retrieve the user's unique ID

        const userConfirmed = window.confirm(`Are you sure you want to order "${menuItemName}" for $${menuItemPrice}?`);

        if (userConfirmed) {
            alert("Order successfully placed!");

            const orderRef = db.collection("orders").doc(userId).collection("userOrders");

            orderRef.add({
                title: menuItemName,
                price: menuItemPrice,
                status: "pending",
                foodCode: menuItemCode, 
                orderTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
                .then(() => {
                    console.log("Order added to Firestore successfully.");

                    let viewOrder = window.confirm(`Would you like to view your order`);

                    if (viewOrder) {

                        window.location.href = "orders.html"
                    }
                })
                .catch(error => {
                    console.error("Error placing order: ", error);
                    alert("Failed to place order. Please try again.");
                });
        } else {
            alert("Order canceled.");
        }
    }

    // If a docID exists in the URL, display the restaurant menu
    if (docID) {
        console.log("Displaying restaurant menu for ID:", docID);

        db.collection("localchefs")
            .doc(docID)
            .get()
            .then(doc => {
                const thisRestaurant = doc.data();
                const restaurantName = thisRestaurant.name;
                const restaurantDescription = thisRestaurant.description;
                const restaurantCuisine = thisRestaurant.cuisine;
                const restaurantCode = thisRestaurant.code;

                // Update the HTML with restaurant info
                document.getElementById("menuName").innerHTML = restaurantName;
                document.getElementById("menuDescription").innerHTML = restaurantDescription;
                document.querySelector(".menuName-img").src = "../images/" + restaurantCode + ".jpg";

                // Fetch and display menu items
                return doc.ref.collection("menuItems").get();
            })
            .then(menuItems => {
                menuItems.forEach(menuItem => {
                    const menuItemData = menuItem.data();
                    const menuItemName = menuItemData.name;
                    const menuItemDescription = menuItemData.description;
                    const menuItemPrice = menuItemData.price;
                    const menuItemCode = menuItemData.code;

                    // Create and append menu item card
                    const menuItemCard = document.createElement("div");
                    menuItemCard.classList.add("menu-item-card");
                    menuItemCard.innerHTML = `
                        <img src="../images/${menuItemCode}.jpg" alt="${menuItemName}" class="menu-item-image">
                        <h2 class="mt-2 mb-2 text-3xl">${menuItemName}</h2>
                        <p>${menuItemDescription}</p>
                        <p>Price: $${menuItemPrice}</p>
                        <button class="order-btn mt-4 text-sm py-2 px-4 rounded-xl bg-gradient-to-b from-orange-300 to-orange-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-orange-500 transform hover:translate-y-1 transition duration-200 ease-in-out ml-4"
                        style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Order Now</button>
                    `;
                    menuItemCard.querySelector(".order-btn").addEventListener("click", () => {
                        handleOrder(menuItemName, menuItemPrice, menuItemCode);
                    });
                    document.getElementById("menuItemsContainer").appendChild(menuItemCard);
                });
            })
            .catch(error => console.error("Error fetching restaurant data: ", error));
    }

    // If a search query is provided, perform the search
    else if (query) {
        console.log("Searching chefs and menu items for query:", query);
        resultsDiv.innerHTML = ""; // Clear previous search results

        db.collection("localchefs").get()
            .then(allChefs => {
                const promises = [];

                allChefs.forEach(doc => {
                    const chef = doc.data();
                    const chefId = doc.id;

                    const menuItemsPromise = doc.ref.collection("menuItems").get()
                        .then(menuItemsSnapshot => {
                            const matchingDishes = [];

                            menuItemsSnapshot.forEach(menuItemDoc => {
                                const dish = menuItemDoc.data();
                                if (dish.name.toLowerCase().startsWith(query)) {
                                    matchingDishes.push({
                                        name: dish.name,
                                        description: dish.description,
                                        price: dish.price,
                                    });
                                }
                            });

                            return matchingDishes.length > 0
                                ? { id: chefId, name: chef.name, cuisine: chef.cuisine, dishes: matchingDishes }
                                : null;
                        });

                    promises.push(menuItemsPromise);
                });

                return Promise.all(promises);
            })
            .then(filteredChefs => {
                const filteredResults = filteredChefs.filter(chef => chef !== null);

                if (filteredResults.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found</p>";
                    return;
                }

                filteredResults.forEach(chef => {
                    const chefCard = document.createElement("div");
                    chefCard.classList.add("chef-card", "p-4", "bg-white", "rounded-lg", "shadow-md", "mb-4");
                    chefCard.innerHTML = `
                        <h2 class="text-xl font-bold text-orange-500">${chef.name}</h2>
                        <p class="text-sm text-gray-500">Cuisine: ${chef.cuisine}</p>
                        <div class="mt-2">
                            ${chef.dishes.map(dish => `
                                <div class="dish-item">
                                    <p class="text-lg font-semibold">${dish.name} - $${dish.price}</p>
                                    <p class="text-sm text-gray-700">${dish.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    chefCard.addEventListener("click", () => {
                        window.location.href = `eachMenu.html?docID=${chef.id}`;
                    });
                    resultsDiv.appendChild(chefCard);
                });
            })
            .catch(error => {
                resultsDiv.innerHTML = `<p>Error fetching chefs: ${error.message}</p>`;
            });
    } else {
        console.log("No valid operation performed. Ensure either a docID or search query is provided.");
    }
}

// Call the function on page load or trigger based on user action
document.getElementById("searchButton")?.addEventListener("click", manageRestaurantAndSearch);
window.onload = manageRestaurantAndSearch;
