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
    
    // Wait for Firebase Auth to initialize
    firebase.auth().onAuthStateChanged((user) => {
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
                    
                    // Check if the review belongs to the current user
                    const isCurrentUserReview = user && review.userID === user.uid;
                    
                    reviewCard.innerHTML = `
                        <div class="flex items-center mb-2">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold">${review.userName}</h3>
                                <div class="text-yellow-400">${'⭐'.repeat(review.rating)}</div>
                            </div>
                            <div class="text-gray-500 text-right">
                                <div>${review.timestamp ? new Date(review.timestamp.toDate()).toLocaleDateString() : ''}</div>
                                ${isCurrentUserReview ? `
                                    <button 
                                        onclick="editReview('${doc.id}', '${review.title}', '${review.text}')"
                                        class="text-md font-thin py-2 px-4 rounded-xl bg-gradient-to-b from-blue-300 to-blue-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-blue-500 transform hover:translate-y-1 transition duration-200 ease-in-out">
                                        Edit
                                    </button>
                                    <button 
                                        onclick="deleteReview('${doc.id}')"
                                        class="text-md font-thin py-2 px-4 rounded-xl bg-gradient-to-b from-orange-300 to-orange-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-orange-500 transform hover:translate-y-1 transition duration-200 ease-in-out">
                                        Delete
                                    </button>
                                ` : ''}
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
    });
}

function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }

    let params = new URL(window.location.href);
    let chefID = params.searchParams.get("docID");

    db.collection("localchefs")
        .doc(chefID)
        .collection("reviews")
        .doc(reviewId)
        .delete()
        .then(() => {
            // Refresh the reviews display
            displayChefReviews();
        })
        .catch((error) => {
            console.error("Error deleting review: ", error);
            alert('Failed to delete review');
        });
}

function editReview(reviewId, currentTitle, currentText) {
    const newTitle = prompt("Edit Review Title:", currentTitle);
    const newText = prompt("Edit Review Text:", currentText);

    if (newTitle && newText) {
        let params = new URL(window.location.href);
        let chefID = params.searchParams.get("docID");

        db.collection("localchefs")
            .doc(chefID)
            .collection("reviews")
            .doc(reviewId)
            .update({
                title: newTitle,
                text: newText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Update timestamp
            })
            .then(() => {
                displayChefReviews(); // Refresh the reviews display
            })
            .catch((error) => {
                console.error("Error updating review: ", error);
                alert('Failed to update review');
            });
    }
}

displaylocalChefInfo();
displayChefReviews();