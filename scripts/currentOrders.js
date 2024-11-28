// Function to display the current order
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
                    const orderImg = orderData.foodCode;
                    const title = orderData.title;

                    // Create the current order card dynamically
                    const orderCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="./images/${orderImg}.jpg" class="card-img-top p-2" alt="Current Order">
                                <div class="card-body">
                                    <h5 class="card-title text-xl font-bold">${title}</h5>
                                    <p class="card-text">Status: ${status}</p>
                                    <p class="card-text">Estimated delivery: ${orderTime}</p>
                                    <p class="card-text">Total Price: $${totalPrice}</p>
                                     <button class="confirm-btn mt-4 text-sm py-2 px-4 rounded-xl bg-gradient-to-b from-orange-300 to-orange-400 text-white w-20 md:w-auto h-10 shadow-md hover:shadow-lg border-b-4 border-orange-500 transform hover:translate-y-1 transition duration-200 ease-in-out ml-4" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Confirm Delivery</button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.getElementById("currentOrderSection").innerHTML = orderCard;

                    // Now, we can query the confirm button because the card is added to the DOM
                    const confirmButton = document.querySelector(".confirm-btn");
                    if (confirmButton) {
                        confirmButton.addEventListener("click", () => {
                            confirmOrder(orderId);
                        });
                    }

                } else {
                    document.getElementById("currentOrderSection").innerHTML = `
                        <h2 class="text-center">You have no current orders.</h2>
                    `;
                }
            })
            .catch(error => {
                console.error("Error fetching current order: ", error);
                alert("Failed to fetch your current order. Please try again.");
            });
    });
}

function confirmOrder(orderId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("User not logged in.");
        return;
    }

    const userId = user.uid;

    // Ask the user to confirm delivery
    swal.fire({
        title: "Delivery Confirmation",
        text: "Has your order been delivered?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#FFA726",
        confirmButtonText: "Yes!",
        cancelButtonText: "No!",
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            
            swal.fire({
                title: "Delivery Confirmed",
                text: "Thank you, enjoy your order!",
                icon: "success",
                confirmButtonColor: "#FFA726",
                confirmButtonText: "OK",
            }).then(() => {
                
                const orderRef = db.collection("orders").doc(userId).collection("userOrders").doc(orderId);

                orderRef.get().then(doc => {
                    if (doc.exists) {
                        const orderData = doc.data();

                        // Add the order data to the "pastOrders" collection
                        const pastOrderRef = db.collection("orders").doc(userId).collection("pastOrders").doc(orderId);

                        pastOrderRef.set(orderData).then(() => {
                            
                            orderRef.delete().then(() => {
                               
                                document.getElementById("currentOrderSection").innerHTML = `
                                    <h2 class="text-center">You have no current orders.</h2>
                                `;

                                 
                                PastOrders();
                            }).catch(error => {
                                console.error("Error removing current order: ", error);
                                alert("Failed to remove current order.");
                            });
                        }).catch(error => {
                            console.error("Error adding to past orders: ", error);
                            alert("Failed to move to past orders.");
                        });
                    }
                });
            });
        } else {
            swal.fire({
                title: "Delivery Confirmation",
                text: "Please confirm that your order has been delivered when it arrives.",
                icon: "info",
                confirmButtonColor: "#FFA726",
                confirmButtonText: "OK",
            });
        }
    });
}


// Function to get past orders
function PastOrders() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("User not logged in.");
            return; 
        }

        const userId = user.uid;
        const pastOrderRef = db.collection("orders").doc(userId).collection("pastOrders");
        pastOrderRef.orderBy("orderTime", "desc").limit(3).get()
            .then(snapshot => {
                let pastOrdersHTML = '';

                snapshot.forEach(doc => {
                    const orderData = doc.data();
                    const orderId = doc.id;
                    const title = orderData.title;
                    const status = orderData.status;
                    const orderImg = orderData.foodCode;
                    const orderTime = orderData.orderTime.toDate().toLocaleString();
                    const totalPrice = orderData.price;

                    pastOrdersHTML += `
                <div class="col-md-4 mb-4">
                            <div class="card">
                                <img src="./images/${orderImg}.jpg" class="card-img-top p-2" alt="Current Order">
                                <div class="card-body">
                                    <h5 class="card-title text-xl font-bold">${title}</h5>
                                    <p class="card-text">Status: Delivered</p>
                                    <p class="card-text">Time Delivered: ${orderTime}</p>
                                    <p class="card-text">Total Price: $${totalPrice}</p>

                                </div>
                            </div>
                        </div>
            `;

                });

                // put the past orders into the pastOrdersSection
                document.getElementById("pastOrdersSection").innerHTML = pastOrdersHTML;
            }).catch(error => {
                console.error("Error fetching past orders: ", error);
                alert("Failed to fetch past orders.");
            });
    }
    )
}
// Wait for the DOM content to load before initializing
document.addEventListener('DOMContentLoaded', function () {
    CurrentOrder();
    PastOrders();
});
