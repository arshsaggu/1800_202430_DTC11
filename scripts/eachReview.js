function displaylocalChefInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);


    db.collection("reviews")
        .doc(ID)
        .get()
        .then(doc => {
            thislocalChef = doc.data();
            foodCode = thislocalChef.code;
            localChefName = doc.data().name;
            localChefDescription = thislocalChef.description


            document.getElementById("localChefName").innerHTML = localChefName;
            let imgEvent = document.querySelector(".localChef-img");
            imgEvent.src = "../images/" + foodCode + ".jpg";
            document.getElementById("localChefDescription").innerHTML = localChefDescription; 
        });
}
displaylocalChefInfo();