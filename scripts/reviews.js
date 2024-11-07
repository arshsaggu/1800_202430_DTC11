function displayAllReviews() {
    db.collection("reviews")
        .orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
            const reviewsContainer = document.getElementById("reviews-go-here");
            reviewsContainer.innerHTML = '';
            
            querySnapshot.forEach(doc => {
                const review = doc.data();
                const reviewCard = `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center gap-4 mb-4">
                            <div>
                                <h3 class="font-semibold text-lg">${review.userName}</h3>
                                <div class="text-orange-500">
                                    ${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}
                                </div>
                            </div>
                        </div>
                        <h4 class="font-bold mb-2">${review.title}</h4>
                        <p class="text-gray-600 mb-2">${review.text}</p>
                        <div class="text-sm text-gray-500">
                            <p>${review.timestamp ? new Date(review.timestamp.toDate()).toLocaleDateString() : ''}</p>
                        </div>
                    </div>
                `;
                reviewsContainer.insertAdjacentHTML('beforeend', reviewCard);
            });
        })
        .catch(error => {
            console.error("Error getting reviews: ", error);
        });
}

displayAllReviews();