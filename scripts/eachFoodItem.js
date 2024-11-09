function displayFoodInfo() {
    let params = new URL(window.location.href); 
    let ID = params.searchParams.get("docID"); 
    console.log(ID);

    
    db.collection("foodItems")
        .doc(ID)
        .get()
        .then(doc => {
            thisFood = doc.data();
            foodCode = thisFood.code;
            foodName = doc.data().name;
            FoodDescription = thisFood.description
            Foodprice = thisFood.price

            
            document.getElementById("foodName").innerHTML = foodName;
            let imgEvent = document.querySelector(".food-img");
            imgEvent.src = "../images/" + foodCode + ".jpg";
            document.getElementById("foodDescription").innerHTML = FoodDescription; 
            document.getElementById("foodPrice").innerHTML = Foodprice; 
        });
}
displayFoodInfo();