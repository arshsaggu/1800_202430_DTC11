function displaylocalChefInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);


    db.collection("localchefs")
        .doc(ID)
        .get()
        .then(doc => {
            thislocalChef = doc.data();
            foodCode = thislocalChef.code;
            localChefName = doc.data().name;


            document.getElementById("localChefName").innerHTML = localChefName;
            let imgEvent = document.querySelector(".localChef-img");
            imgEvent.src = "../images/" + foodCode + ".jpg";
        });
}
displaylocalChefInfo();