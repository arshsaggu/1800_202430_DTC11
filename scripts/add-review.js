// Handle star rating
const stars = document.querySelectorAll('.star');
let rating = 0;

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        rating = index + 1;
        updateStars();
    });
});

function updateStars() {
    stars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
    });
}

// Handle form submission
document.getElementById('review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const params = new URL(window.location.href);
    const chefID = params.searchParams.get("chefID");
    
    const reviewData = {
        chefID: chefID,
        title: document.getElementById('title').value,
        text: document.getElementById('review-text').value,
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userID: firebase.auth().currentUser.uid,
        userName: firebase.auth().currentUser.displayName || "Anonymous"
    };

    db.collection("reviews").add(reviewData)
        .then(() => {
            window.location.href = `reviews.html?chefID=${chefID}`;
        })
        .catch((error) => {
            console.error("Error adding review: ", error);
            alert("Error submitting review. Please try again.");
        });
});