function displayReviews() {
    let params = new URL(window.location.href);
    let chefID = params.searchParams.get("chefID");
    
    // First get chef info
    db.collection("localchefs")
        .doc(chefID)
        .get()
        .then(doc => {
            const chefData = doc.data();
            document.querySelector('h1').textContent = `Reviews for ${chefData.name}`;
        });

    // Then get all reviews for this chef
    db.collection("reviews")
        .where("chefID", "==", chefID)
        .orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
            const reviewsContainer = document.querySelector('.grid');
            reviewsContainer.innerHTML = ''; // Clear existing reviews

            querySnapshot.forEach(doc => {
                const review = doc.data();
                const reviewHTML = `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center gap-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-user-circle">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                            </svg>
                            <div>
                                <h3 class="font-semibold text-lg">${review.userName}</h3>
                                <div class="flex">
                                    ${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}
                                </div>
                            </div>
                        </div>
                        <h4 class="font-bold mb-2">${review.title}</h4>
                        <p class="text-gray-600">${review.text}</p>
                    </div>
                `;
                reviewsContainer.insertAdjacentHTML('beforeend', reviewHTML);
            });
        });
}

displayReviews();