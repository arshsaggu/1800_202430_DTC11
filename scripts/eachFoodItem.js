function displayFoodInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("foodItems")
        .doc(ID)
        .get()
        .then(doc => {
            thisFood = doc.data();
            foodCode = thisFood.code;
            foodName = doc.data().name;

            // only populate title, and image
            document.getElementById("foodName").innerHTML = foodName;
            let imgEvent = document.querySelector(".food-img");
            imgEvent.src = "../images/" + foodCode + ".jpg";
        });
}
displayFoodInfo();