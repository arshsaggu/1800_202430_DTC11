function getHikeName(id) {
	  db.collection("reviews")
	    .doc(id)
	    .get()
	    .then((thisHike) => {
	      var hikeName = thisHike.data().name;
	      document.getElementById("review").innerHTML = hikeName;
			});
}

getHikeName(hikeDocID);
// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        }
    });
});

function writeReview() {
    let userName = document.getElementById("userName").value;
    let userComment = document.getElementById("userComment").value;
    
    // Get the star rating
    const stars = document.querySelectorAll('.star');
    let rating = 0;
    stars.forEach((star) => {
        if (star.textContent === '★') {
            rating++;
        }
    });

    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;

        // Write the review to Firestore
        db.collection("reviews").add({
            userID: userID,
            userName: userName,
            comment: userComment,
            rating: rating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "reviews.html"; // Redirect to reviews page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
}

function populateReviews() {
    let reviewsContainer = document.querySelector('.grid');
    
    db.collection("reviews")
        .orderBy("timestamp", "desc")
        .get()
        .then((allReviews) => {
            allReviews.forEach((doc) => {
                const review = doc.data();
                
                // Create review card
                const reviewCard = document.createElement('div');
                reviewCard.className = 'bg-white p-6 rounded-lg shadow-lg';
                
                // Create star rating HTML
                let starRating = "";
                for (let i = 0; i < review.rating; i++) {
                    starRating += '★';
                }
                for (let i = review.rating; i < 5; i++) {
                    starRating += '☆';
                }
                
                // Populate review card
                reviewCard.innerHTML = `
                    <div class="flex items-center gap-4 mb-4">
                        <h3 class="font-bold text-lg">${review.userName}</h3>
                    </div>
                    <div class="text-orange-500 mb-2">${starRating}</div>
                    <p class="text-gray-700">${review.comment}</p>
                    <div class="text-gray-500 text-sm mt-2">
                        ${review.timestamp ? new Date(review.timestamp.toDate()).toLocaleString() : ''}
                    </div>
                `;
                
                reviewsContainer.appendChild(reviewCard);
            });
        });
}

// Initialize based on current page
if (window.location.pathname.includes('reviews.html')) {
    populateReviews();
}