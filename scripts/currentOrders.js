function CurrentOrder() {
    // Listen to the auth state change (This will be triggered when the page loads)
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
           
            alert("User not logged in.");
            return; // Abort the function if the user is not logged in
        }

        const userId = user.uid; 
        // Reference to the user's 'userOrders' sub-collection
        const orderRef = db.collection("orders").doc(userId).collection("userOrders");

        orderRef.orderBy("orderTime", "desc").limit(1).get()
            .then(snapshot => {
                if (!snapshot.empty) {
               
                    const orderData = snapshot.docs[0].data();
                    const orderId = snapshot.docs[0].id; 
                    const status = orderData.status;
                    const orderTime = orderData.orderTime.toDate().toLocaleString(); 
                    const totalPrice = orderData.price;
                    const title = orderData.title;
                    

                    // Create the current order card dynamically
                    const orderCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="./images/mediterranean-feast.jpg" class="card-img-top p-2" alt="Current Order">
                                <div class="card-body">
                                    <h5 class="card-title text-xl font-bold">${title}</h5>
                                    <p class="card-text">Status: ${status}</p>
                                    <p class="card-text">Estimated delivery: ${orderTime}</p>
                                    <p class="card-text">Total Price: $${totalPrice}</p>
                                    <a href="track_order.html?orderId=${orderId}" class="rounded bg-orange-500 p-2 mt-3 d-inline-block">Track</a>
                                </div>
                            </div>
                        </div>
                    `;

                    
                    document.getElementById("currentOrderSection").innerHTML = orderCard;
                } else {
                   
                    document.getElementById("currentOrderSection").innerHTML = `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title text-xl font-bold">No current order</h5>
                                    <p class="card-text">You don't have any orders in preparation right now.</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error("Error fetching current order: ", error);
                alert("Failed to fetch your current order. Please try again.");
            });
    });
}

// Wait for the DOM content to load before initializing
document.addEventListener('DOMContentLoaded', function () {
    
    CurrentOrder();
});
