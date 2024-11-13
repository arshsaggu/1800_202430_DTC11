function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function


// Function to get the current day of the week as a string (e.g., "monday", "tuesday")
function getCurrentDay() {
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date();
    return daysOfWeek[today.getDay()];
}

// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote() {
    const day = getCurrentDay()
    db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(dayDoc => {                                                              //arrow notation
            console.log("current document data: " + dayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log("Error calling onSnapshot", error);
        });
}
readQuote();        //calling the function

function writeFoodItems() {
    var foodRef = db.collection("foodItems");

    foodRef.add({
        code: "q",
        name: "Chickpea Salad",
        description: "A fresh and healthy salad packed with protein.",
        chef: "Chef Emma",
        cuisine: "Mediterranean",
        price: 9.99,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    foodRef.add({
        code: "Peruvian-Quinoa-Salad-1-2",
        name: "Quinoa Bowl",
        description: "A nutritious bowl of quinoa with seasonal vegetables.",
        chef: "Chef Alex",
        cuisine: "Peruvian",
        price: 12.99,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("April 1, 2023"))
    });
    foodRef.add({
        code: "chicken-curry",
        name: "Chicken Curry",
        description: "Delicious homemade chicken curry with spices.",
        chef: "Chef Priya",
        cuisine: "Indian",
        price: 15.49,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("May 5, 2023"))
    });
    foodRef.add({
        code: "Easy-Vegetable-Stir-Fry-V1-800x1067",
        name: "Vegetable Stir Fry",
        description: "A colorful mix of seasonal vegetables stir-fried to perfection.",
        chef: "Chef Li",
        cuisine: "Asian",
        price: 11.99,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("June 10, 2023"))
    });
    foodRef.add({
        code: "Umamiology-Spaghetti-Bolognese-RecipeCard16",
        name: "Spaghetti Bolognese",
        description: "Classic spaghetti served with a rich and savory meat sauce.",
        chef: "Chef Marco",
        cuisine: "Italian",
        price: 14.99,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("July 20, 2023"))
    });
    foodRef.add({
        code: "Blog-Chicken-Caesar-Salad-1-scaled",
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.",
        chef: "Chef Julia",
        cuisine: "American",
        price: 8.99,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("August 15, 2023"))
    });
}

function displayFoodCardsDynamically(collection) {
    let cardTemplate = document.getElementById("foodCardTemplate");
    console.log(collection);
    db.collection(collection).get()   // Fetch the collection called "foodItems"
        .then(allFoodItems => {
            console.log(allFoodItems);
            allFoodItems.forEach(doc => { // Iterate through each document in the collection
                var title = doc.data().name;
                var description = doc.data().description;
                var foodCode = doc.data().code;
                var price = doc.data().price;
                var docID = doc.id;  // Document ID for identifying the food item
                let newCard = cardTemplate.content.cloneNode(true); // Clone the template for each card

                // Update the content dynamically
                newCard.querySelector('.card-title').innerHTML = title;
                newCard.querySelector('.card-text').innerHTML = description;
                newCard.querySelector('.card-image').src = `./images/${foodCode}.jpg`;
                newCard.querySelector('a').href = "eachFoodItem.html?docID=" + docID; // Read more link
                newCard.querySelector('.order-btn').addEventListener('click', function (event) {
                    event.preventDefault(); // Prevent the default action (e.g., navigating if href is used)
                    showConfirmationDialog(title, price); // Show the confirmation dialog
                });

                // Append the new card to the container
                document.getElementById(collection + "-go-here").appendChild(newCard);
            });
        })
        .catch(error => {

            console.error("Error fetching food items: ", error);
        });
}

// Function to show the confirmation dialog
function showConfirmationDialog(title, price) {
    // Display the confirmation dialog
    let userConfirmed = window.confirm(`Are you sure you want to order "${title}" for $${price}?`);

    if (userConfirmed) {
        alert("Order successfully placed!");  // Show success message
    } else {

        alert("Order canceled.");  // Show cancellation message
    }
}
displayFoodCardsDynamically("foodItems");


function browseRestaurants() {
    var restaurantsRef = db.collection("localchefs");

    // Add restaurant 1: Momo Hut
    restaurantsRef.add({
        code: "Momo-hut",
        name: "Momo Hut",
        tagline: "Taste the Love in Every Bite!",
        description: "Delicious Himalayan momos with authentic flavors.",
        cuisine: "Nepalese",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for Momo Hut
        docRef.collection('menuItems').add({
            code: "Momo-hut-steamed-momo",
            name: "Steamed Momo",
            description: "Soft dumplings filled with spiced meat or vegetables.",
            price: 7.99
        });
        docRef.collection('menuItems').add({
            code: "Momo-hut-fried-momo",
            name: "Fried Momo",
            description: "Crispy fried dumplings stuffed with your choice of filling.",
            price: 8.99
        });
        docRef.collection('menuItems').add({
            code: "Momo-hut-momo-soup",
            name: "Momo Soup",
            description: "Momos served in a flavorful broth with herbs.",
            price: 9.99
        });
        docRef.collection('menuItems').add({
            code: "Momo-hut-chow-mein",
            name: "Chow Mein",
            description: "Stir-fried noodles with vegetables and meat.",
            price: 10.99
        });
        docRef.collection('menuItems').add({
            code: "Momo-hut-tibetan-tea",
            name: "Tibetan Tea",
            description: "A warm, comforting tea with butter and spices.",
            price: 3.99
        });
        docRef.collection('menuItems').add({
            code: "Momo-hut-momo-platter",
            name: "Momo Platter",
            description: "Assorted momos served with dipping sauces.",
            price: 12.99
        });
    });

    // Add restaurant 2: Mediterranean Feast
    restaurantsRef.add({
        code: "mediterranean-feast",
        name: "Mediterranean Feast",
        tagline: "Savor the Flavors of the Mediterranean!",
        description: "A vibrant dish featuring grilled meats, fresh herbs, and zesty sauces.",
        cuisine: "Mediterranean",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for Mediterranean Feast
        docRef.collection('menuItems').add({
            code: "mediterranean-feast-grilled-lamb",
            name: "Grilled Lamb",
            description: "Succulent lamb skewers marinated in Mediterranean herbs.",
            price: 14.99
        });
        docRef.collection('menuItems').add({
            code: "mediterranean-feast-falafel",
            name: "Falafel",
            description: "Crispy fried chickpea balls served with tahini.",
            price: 7.99
        });
        docRef.collection('menuItems').add({
            code: "mediterranean-feast-hummus-plate",
            name: "Hummus Plate",
            description: "A creamy blend of chickpeas, tahini, and olive oil.",
            price: 5.99
        });
        docRef.collection('menuItems').add({
            code: "mediterranean-feast-greek-salad",
            name: "Greek Salad",
            description: "Fresh cucumbers, tomatoes, olives, and feta cheese.",
            price: 8.99
        });
        docRef.collection('menuItems').add({
            code: "AM01",
            name: "Pita Bread",
            description: "Warm, soft bread served with dipping sauces.",
            price: 2.99
        });
        docRef.collection('menuItems').add({
            code: "mediterranean-feast-baklava",
            name: "Baklava",
            description: "A sweet, flaky pastry filled with nuts and honey.",
            price: 4.99
        });
    });

    // Add restaurant 3: Spice Kitchen
    restaurantsRef.add({
        code: "spice-kitchen",
        name: "Spice Kitchen",
        tagline: "Bringing the Heat to Your Table!",
        description: "Homemade chicken curry with an explosion of spices and flavors.",
        cuisine: "Indian",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for Spice Kitchen
        docRef.collection('menuItems').add({
            code: "spice-kitchen-butter-chicken",
            name: "Butter Chicken",
            description: "Rich, creamy chicken curry cooked in a mild tomato sauce.",
            price: 12.99
        });
        docRef.collection('menuItems').add({
            code: "spice-kitchen-chicken-vindaloo",
            name: "Chicken Vindaloo",
            description: "Spicy and tangy chicken curry with vinegar and spices.",
            price: 13.99
        });
        docRef.collection('menuItems').add({
            code: "spice-kitchen-aloo-gobi",
            name: "Aloo Gobi",
            description: "A vegetarian dish made with spiced potatoes and cauliflower.",
            price: 10.99
        });
        docRef.collection('menuItems').add({
            code: "spice-kitchen-biryani",
            name: "Biryani",
            description: "Fragrant rice with marinated meat, cooked to perfection.",
            price: 14.99
        });
        docRef.collection('menuItems').add({
            code: "spice-kitchen-garlic-naan",
            name: "Garlic Naan",
            description: "Soft flatbread with garlic and herbs.",
            price: 3.99
        });
        docRef.collection('menuItems').add({
            code: "spice-kitchen-samosas",
            name: "Samosas",
            description: "Crispy pastry filled with spiced potatoes and peas.",
            price: 5.99
        });
    });

    // Add restaurant 4: Sushi Haven
    restaurantsRef.add({
        code: "sushi-haven",
        name: "Sushi Haven",
        tagline: "Fresh Flavors Rolled to Perfection!",
        description: "An assortment of handcrafted sushi rolls and sashimi.",
        cuisine: "Japanese",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for Sushi Haven
        docRef.collection('menuItems').add({
            code: "sushi-haven-california-roll",
            name: "California Roll",
            description: "A sushi roll with crab, avocado, and cucumber.",
            price: 9.99
        });
        docRef.collection('menuItems').add({
            code: "sushi-haven-tuna-sashimi",
            name: "Tuna Sashimi",
            description: "Fresh slices of tuna served with soy sauce.",
            price: 12.99
        });
        docRef.collection('menuItems').add({
            code: "sushi-haven-tempura-shrimp-roll",
            name: "Tempura Shrimp Roll",
            description: "Crispy shrimp wrapped in sushi rice and seaweed.",
            price: 11.99
        });
        docRef.collection('menuItems').add({
            code: "sushi-haven-edamame",
            name: "Edamame",
            description: "Steamed soybeans tossed with sea salt.",
            price: 5.99
        });
        docRef.collection('menuItems').add({
            code: "sushi-haven-miso-soup",
            name: "Miso Soup",
            description: "A traditional Japanese soup made with miso and tofu.",
            price: 3.99
        });
        docRef.collection('menuItems').add({
            code: "sushi-haven-dragon-roll",
            name: "Dragon Roll",
            description: "A sushi roll with eel, avocado, and eel sauce.",
            price: 13.99
        });
    });

    // Add restaurant 5: Plant Power
    restaurantsRef.add({
        code: "plant-power",
        name: "Plant Power",
        tagline: "Nourishing Your Body, One Bite at a Time!",
        description: "A colorful vegan bowl with quinoa, roasted vegetables, and tahini sauce.",
        cuisine: "Vegan",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for Plant Power
        docRef.collection('menuItems').add({
            code: "plant-power-quinoa-bowl",
            name: "Quinoa Bowl",
            description: "A healthy bowl with quinoa, roasted veggies, and tahini.",
            price: 10.99
        });
        docRef.collection('menuItems').add({
            code: "plant-power-vegan-tacos",
            name: "Vegan Tacos",
            description: "Soft tacos filled with spiced tempeh, avocado, and veggies.",
            price: 8.99
        });
        docRef.collection('menuItems').add({
            code: "plant-power-sweet-potato-fries",
            name: "Sweet Potato Fries",
            description: "Crispy sweet potato fries served with dipping sauce.",
            price: 4.99
        });
        docRef.collection('menuItems').add({
            code: "plant-power-vegan-burger",
            name: "Vegan Burger",
            description: "A plant-based burger with lettuce, tomato, and avocado.",
            price: 12.99
        });
        docRef.collection('menuItems').add({
            code: "plant-power-raw-vegan-dessert",
            name: "Raw Vegan Dessert",
            description: "A raw, healthy dessert made from nuts and fruits.",
            price: 6.99
        });
        docRef.collection('menuItems').add({
            code: "plant-power-veg-sushi",
            name: "Veg Sushi",
            description: "A sushi roll made with vegetables and avocado.",
            price: 9.99
        });
    });

    // Add restaurant 6: LocalChef (New)
    restaurantsRef.add({
        code: "chefs-corner",
        name: "Chefs Corner",
        tagline: "Cooked Fresh by Locals, for Locals!",
        description: "Discover homemade dishes from your neighborhood chefs.",
        cuisine: "Various",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // Add menu items for LocalChef
        docRef.collection('menuItems').add({
            code: "localchef-local-dish",
            name: "Local Dish",
            description: "Homemade dish from your local chef, full of flavor.",
            price: 10.99
        });
        docRef.collection('menuItems').add({
            code: "localchef-vegan-curry",
            name: "Vegan Curry",
            description: "A rich, flavorful vegan curry with a medley of veggies.",
            price: 9.99
        });
        docRef.collection('menuItems').add({
            code: "localchef-daily-special",
            name: "Daily Special",
            description: "Chef's special of the day, made with seasonal ingredients.",
            price: 12.99
        });
        docRef.collection('menuItems').add({
            code: "localchef-grilled-chicken",
            name: "Grilled Chicken",
            description: "Juicy grilled chicken served with a side of greens.",
            price: 14.99
        });
        docRef.collection('menuItems').add({
            code: "localchef-fresh-salad",
            name: "Fresh Salad",
            description: "A mix of seasonal greens with house-made dressing.",
            price: 6.99
        });
    });
}

function displayRestaurantCardsDynamically(collection) {
    let cardTemplate = document.getElementById("browseChefCardTemplate"); // Retrieve the HTML template for food cards

    db.collection(collection).get()   // Fetch the collection called "foodItems"
        .then(allrestaurantItems => {
            allrestaurantItems.forEach(doc => { // Iterate through each document in the collection
                var title = doc.data().name;       // Get the value of the "name" key
                var description = doc.data().description;  // Get the value of the "description" key
                var foodCode = doc.data().code;    // Get unique code for food items
                var price = doc.data().price;      // Get the price of the food item
                var docID = doc.id;                // Get the document ID
                let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template for a new card
                // Update the title, description, price, and image
                newCard.querySelector('.card-title').innerHTML = title;
                newCard.querySelector('.card-text').innerHTML = description;
                newCard.querySelector('.card-image').src = `./images/${foodCode}.jpg`; //Example: NV01.jpg
                newCard.querySelector('.read-btn').addEventListener('click', function () {
                    window.location.href = "eachLocalChef.html?docID=" + docID;
                });

                newCard.querySelector('.menu-btn').addEventListener('click', function () {
                    window.location.href = "eachMenu.html?docID=" + docID;
                });

                // Attach the new card to the container (e.g., "food-go-here")
                document.getElementById(collection + "-go-here").appendChild(newCard);
            });
        })
        .catch(error => {
            console.error("Error fetching food items: ", error); // Handle errors
        });
}

// Call the function to display food items
displayRestaurantCardsDynamically("localchefs");