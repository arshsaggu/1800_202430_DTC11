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
            localChefDescription = thislocalChef.description


            document.getElementById("localChefName").innerHTML = localChefName;
            let imgEvent = document.querySelector(".localChef-img");
            imgEvent.src = "../images/" + foodCode + ".jpg";
            document.getElementById("localChefDescription").innerHTML = localChefDescription; 
        });
}

function displayChefReviews() {
    let params = new URL(window.location.href);
    let chefID = params.searchParams.get("docID");
    
    const reviewsSection = document.getElementById('reviews-section');
    
    db.collection("localchefs")
        .doc(chefID)
        .collection("reviews")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                reviewsSection.innerHTML = '<p class="text-center text-gray-500 mt-4">No reviews yet</p>';
                return;
            }

            reviewsSection.innerHTML = ''; // Clear existing reviews
            
            querySnapshot.forEach((doc) => {
                const review = doc.data();
                const reviewCard = document.createElement('div');
                reviewCard.className = 'bg-white rounded-lg shadow-md p-4 mb-4';
                
                reviewCard.innerHTML = `
                    <div class="flex items-center mb-2">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold">${review.userName}</h3>
                            <div class="text-yellow-400">${'⭐'.repeat(review.rating)}</div>
                        </div>
                        <div class="text-gray-500">
                            ${review.timestamp ? new Date(review.timestamp.toDate()).toLocaleDateString() : ''}
                        </div>
                    </div>
                    <h4 class="font-bold mb-2">${review.title}</h4>
                    <p class="text-gray-700">${review.text}</p>
                `;
                
                reviewsSection.appendChild(reviewCard);
            });
        })
        .catch((error) => {
            console.error("Error getting reviews: ", error);
            reviewsSection.innerHTML = '<p class="text-center text-red-500">Error loading reviews</p>';
        });
}

displaylocalChefInfo();
displayChefReviews();