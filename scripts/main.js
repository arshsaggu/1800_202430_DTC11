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
    let cardTemplate = document.getElementById("foodCardTemplate"); // Retrieve the HTML template for food cards
console.log(collection)
    db.collection(collection).get()   // Fetch the collection called "foodItems"
        .then(allFoodItems => {
          console.log(allFoodItems)  
          allFoodItems.forEach(doc => { // Iterate through each document in the collection
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
                newCard.querySelector('a').href = "eachFoodItem.html?docID=" + docID;
                // Attach the new card to the container (e.g., "food-go-here")
                document.getElementById(collection + "-go-here").appendChild(newCard);
            });
        })
        .catch(error => {
            console.error("Error fetching food items: ", error); // Handle errors
        });
}

// Call the function to display food items
displayFoodCardsDynamically("foodItems");



function browseRestaurants() {
    var restaurantsRef = db.collection("localchefs");

    restaurantsRef.add(
        {
            code: "Momo-hut",
            name: "Momo Hut",
            tagline: "Taste the Love in Every Bite!",
            description: "Delicious Himalayan momos with authentic flavors.",
            cuisine: "Nepalese",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }),
        restaurantsRef.add({
            code: "mediterranean-feast",
            name: "Mediterranean Feast",
            tagline: "Savor the Flavors of the Mediterranean!",
            description: "A vibrant dish featuring grilled meats, fresh herbs, and zesty sauces.",
            cuisine: "Mediterranean",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }),
        restaurantsRef.add({
            code: "spice-kitchen",
            name: "Spice Kitchen",
            tagline: "Bringing the Heat to Your Table!",
            description: "Homemade chicken curry with an explosion of spices and flavors.",
            cuisine: "Indian",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }),
        restaurantsRef.add({
            code: "sushi-haven",
            name: "Sushi Haven",
            tagline: "Fresh Flavors Rolled to Perfection!",
            description: "An assortment of handcrafted sushi rolls and sashimi.",
            cuisine: "Japanese",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }),
        restaurantsRef.add({
            code: "plant-power",
            name: "Plant Power",
            tagline: "Nourishing Your Body, One Bite at a Time!",
            description: "A colorful vegan bowl with quinoa, roasted vegetables, and tahini sauce.",
            cuisine: "Vegan",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        }),
        restaurantsRef.add({
            code: "taco-fiesta",
            name: "Taco Fiesta",
            tagline: "Tacos Done Your Way!",
            description: "Customizable taco kits with fresh ingredients and bold flavors.",
            cuisine: "Mexican",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        })
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
                newCard.querySelector('a').href = "eachLocalChef.html?docID=" + docID;
                
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