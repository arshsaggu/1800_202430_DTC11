function displayRestaurantMenu() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");  // Get the "docID" parameter from the URL
    console.log(ID);

    db.collection("localchefs")  // Access the "localchefs" collection
        .doc(ID)  // Get the document using docID
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
            let imgEvent = document.querySelector(".menuName-img");
            imgEvent.src = "../images/" + restaurantCode + ".jpg";  // Set the restaurant image

            // Fetch and display menu items
            db.collection("localchefs")
                .doc(ID)
                .collection("menuItems")
                .get()
                .then(menuItems => {
                    menuItems.forEach(menuItem => {
                        const menuItemData = menuItem.data();
                        const menuItemName = menuItemData.name;
                        const menuItemDescription = menuItemData.description;
                        const menuItemPrice = menuItemData.price;
                        const menuItemCode = menuItemData.code; // Get the unique code for the menu item

                        // Create a div for each menu item
                        const menuItemCard = document.createElement("div");
                        menuItemCard.classList.add("menu-item-card");

                        // Add content to the menu item card
                        menuItemCard.innerHTML = `
                            <img src="../images/${menuItemCode}.jpg" alt="${menuItemName}" class="menu-item-image">
                            <h2 class = "mt-2 mb-2 text-2xl">${menuItemName}</h3>
                            <p>${menuItemDescription}</p>
                            <p>Price: $${menuItemPrice}</p>
                            <button
                        class="order-btn mt-4 text-sm py-2 px-4 rounded-xl bg-gradient-to-b from-orange-300 to-orange-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-orange-500 transform hover:translate-y-1 transition duration-200 ease-in-out ml-4"
                        style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                        Order Now
                    </button>
                        `;

                        // Get the "Order Now" button and add a click event
                        const orderBtn = menuItemCard.querySelector(".order-btn");
                        orderBtn.addEventListener("click", function () {
                            handleOrder(menuItemName, menuItemPrice);
                        });

                        // Append the menu item to the container
                        document.getElementById("menuItemsContainer").appendChild(menuItemCard);
                    });
                })
                .catch(error => {
                    console.error("Error fetching menu items: ", error);
                });
        })
        .catch(error => {
            console.error("Error fetching restaurant data: ", error);
        });
}

function handleOrder(menuItemName, menuItemPrice) {
    // Check if user is logged in
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("User not logged in.");
        return;
    }

    const userId = user.uid; // Retrieve the user's unique ID

    // Display the confirmation dialog
    const userConfirmed = window.confirm(`Are you sure you want to order "${menuItemName}" for $${menuItemPrice}?`);

    if (userConfirmed) {
        // Show success message
        alert("Order successfully placed!");

        // Reference to the user's orders in Firestore
        const orderRef = db.collection("orders").doc(userId).collection("userOrders");

        // Add the order to Firestore
        orderRef.add({
            title: menuItemName,
            price: menuItemPrice,
            status: "pending", // Order status
            orderTime: firebase.firestore.FieldValue.serverTimestamp(), // Add server timestamp
        })
            .then(() => {
                console.log("Order added to Firestore successfully.");
            })
            .catch(error => {
                console.error("Error placing order: ", error);
                alert("Failed to place order. Please try again.");
            });
    } else {
        // If the user cancels the order
        alert("Order canceled.");
    }
}


displayRestaurantMenu();  // Call the function to load data
