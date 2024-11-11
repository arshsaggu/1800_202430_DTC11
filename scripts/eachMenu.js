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

                        menuItemCard.innerHTML = `
                            <img src="../images/${menuItemCode}.jpg" alt="${menuItemName}" class="menu-item-image">
                            <h3>${menuItemName}</h3>
                            <p>${menuItemDescription}</p>
                            <p>Price: $${menuItemPrice}</p>
                        `;
                        console.log(menuItemCode, menuItemName, menuItemDescription, menuItemPrice);
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

displayRestaurantMenu();  // Call the function to load data
