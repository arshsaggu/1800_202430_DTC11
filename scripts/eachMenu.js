function manageRestaurantAndSearch() {
    const params = new URL(window.location.href).searchParams;
    const docID = params.get("docID");
    const query = document.getElementById("searchInput")?.value.toLowerCase().trim();
    const resultsDiv = document.getElementById("searchResults");

    function handleOrder(menuItemName, menuItemPrice, menuItemCode) {
        const user = firebase.auth().currentUser;

        if (!user) {
            alert("User not logged in.");
            return;
        }

        const userId = user.uid;
        swal.fire({
            title: "Order Confirmation",
            text: "Would you like to place an order?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#FFA726",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            
       
        }).then((result) => {
            if (result.isConfirmed) {
                // Show delivery confirmation dialog
                swal.fire({
                    title: "Delivery Confirmed",
                    text: "Thank you, enjoy your order!",
                    icon: "success",
                    confirmButtonColor: "#FFA726",
                    confirmButtonText: "OK",
                }).then(() => {

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
                    swal.fire({
                        title: "View Order?",
                        text: "would you like to view your order",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        confirmButtonColor: "#FFA726",
                       
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "orders.html";
                        }
                    });
                })
                .catch(error => {
                    console.error("Error placing order: ", error);
                    alert("Failed to place order. Please try again.");
                    alert("Failed to place order. Please try again.");
                });
                });
            } else {

                swal.fire({
                    title: "Order Confirmation",
                    text: "Place an order whenever you are ready",
                    icon: "info",
                    confirmButtonColor: "#FFA726",
                    confirmButtonText: "OK",
                });
            }
        });
    }

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

                document.getElementById("menuName").innerHTML = restaurantName;
                document.getElementById("menuDescription").innerHTML = restaurantDescription;
                document.querySelector(".menuName-img").src = "../images/" + restaurantCode + ".jpg";

                return doc.ref.collection("menuItems").get();
            })
            .then(menuItems => {
                menuItems.forEach(menuItem => {
                    const menuItemData = menuItem.data();
                    const menuItemName = menuItemData.name;
                    const menuItemDescription = menuItemData.description;
                    const menuItemPrice = menuItemData.price;
                    const menuItemCode = menuItemData.code;

                    const menuItemCard = document.createElement("div");
                    menuItemCard.classList.add("menu-item-card");
                    menuItemCard.innerHTML = `
                        <img src="../images/${menuItemCode}.jpg" alt="${menuItemName}" class="menu-item-image">
                        <h2 class="mt-2 mb-2 font-semibold text-3xl">${menuItemName}</h2>
                        <p class = "text-lg">${menuItemDescription}</p>
                        <p class = "font-semibold">$${menuItemPrice}</p>
                        <button class="order-btn mt-4 text-sm py-2 px-4 rounded-xl bg-gradient-to-b from-orange-300 to-orange-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-orange-500 transform hover:translate-y-1 transition duration-200 ease-in-out ml-4"
                        style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">ORDER NOW</button>
                    `;
                    menuItemCard.querySelector(".order-btn").addEventListener("click", () => {
                        handleOrder(menuItemName, menuItemPrice, menuItemCode);
                    });
                    document.getElementById("menuItemsContainer").appendChild(menuItemCard);
                });
            })
            .catch(error => console.error("Error fetching restaurant data: ", error));
    }
    else if (query) {
        console.log("Searching chefs and menu items for query:", query);
        resultsDiv.innerHTML = "";

        if (!query) {
            resultsDiv.innerHTML = "<p>Please enter a search query.</p>";
            return;
        }

        let searchResults = new Map();

        db.collection("localchefs").get()
            .then(async allChefs => {
                for (const doc of allChefs.docs) {
                    const chef = doc.data();
                    const chefId = doc.id;

                    const menuItemsSnapshot = await doc.ref.collection("menuItems").get();
                    const matchingDishes = [];

                    menuItemsSnapshot.forEach(menuItemDoc => {
                        const dish = menuItemDoc.data();
                        // Only match items that start with the search query
                        if (dish.name.toLowerCase().startsWith(query)) {
                            matchingDishes.push({
                                name: dish.name,
                                description: dish.description,
                                price: dish.price,
                            });
                        }
                    });

                    // Only add chef to results if they have matching dishes
                    if (matchingDishes.length > 0) {
                        searchResults.set(chefId, {
                            id: chefId,
                            name: chef.name,
                            cuisine: chef.cuisine,
                            dishes: matchingDishes
                        });
                    }
                }

                // Display results
                if (searchResults.size === 0) {
                    resultsDiv.innerHTML = "<p>No results found</p>";
                    return;
                }

                resultsDiv.innerHTML = ""; // Clear previous results
                searchResults.forEach(chef => {
                    const chefCard = document.createElement("div");
                    chefCard.classList.add("chef-card", "p-4", "bg-white", "rounded-lg", "shadow-md", "mb-4");
                    chefCard.style.cursor = "pointer";
                    chefCard.innerHTML = `
                        <h2 class="text-xl font-bold text-orange-500">${chef.name}</h2>
                        <p class="text-sm text-gray-500">Cuisine: ${chef.cuisine}</p>
                        <div class="mt-2">
                            ${chef.dishes.map(dish => `
                                <div class="dish-item border-b border-gray-200 py-2">
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
                console.error("Search error:", error);
            });
    } else {
        console.log("No valid operation performed. Ensure either a docID or search query is provided.");
    }
}

document.getElementById("searchButton")?.addEventListener("click", manageRestaurantAndSearch);
window.onload = manageRestaurantAndSearch;

document.getElementById("searchInput")?.addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        document.getElementById("searchResults").innerHTML = "";
    }
});