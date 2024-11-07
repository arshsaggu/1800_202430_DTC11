function addPastOrders() {
    var ordersRef = db.collection("orders");

    ordersRef.doc("4321").set({
        orderId: "4321",
        status: "Completed",
        deliveryDate: firebase.firestore.Timestamp.fromDate(new Date("2024-10-01")),
        items: [
            { itemName: "Antipasto Chickpea Salad", quantity: 1, price: 15.99 }
        ],
        totalPrice: 15.99,
        imageUrl: "./images/Antipasto-chickpea-salad_8.jpg",
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });

    ordersRef.doc("8765").set({
        orderId: "8765",
        status: "Completed",
        deliveryDate: firebase.firestore.Timestamp.fromDate(new Date("2024-09-29")),
        items: [
            { itemName: "Chicken Caesar Salad", quantity: 1, price: 12.99 }
        ],
        totalPrice: 12.99,
        imageUrl: "./images/Blog-Chicken-Caesar-Salad-1-scaled.jpg",
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });

    ordersRef.doc("5432").set({
        orderId: "5432",
        status: "Completed",
        deliveryDate: firebase.firestore.Timestamp.fromDate(new Date("2024-09-27")),
        items: [
            { itemName: "Vegetable Stir Fry", quantity: 1, price: 10.50 }
        ],
        totalPrice: 10.50,
        imageUrl: "./images/Easy-Vegetable-Stir-Fry-V1-800x1067.jpg",
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });
}

addPastOrders();



const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');


function loadOrderDetails(orderId) {
    const orderRef = db.collection("orders").doc(orderId);

    orderRef.get().then((doc) => {
        if (doc.exists) {
            const order = doc.data();
            
            document.getElementById('orderDetails').innerHTML = `
               <div class="flex d-flex justify-content-center align-items-center" style="height: 100vh;">
                <img src="${order.imageUrl}" alt="Order Image" class="img-fluid p-2" style="max-width: 500px; height: auto;" />
                </div>

                <h3 class="p-2 font-bold underline" >Order: #${order.orderId}</h3>
                ${order.items.map(item => `
                        <p>${item.itemName}</p>
                    `).join('')}
                <p class="p-2">Status: ${order.status}</p>
                <p class="p-2">Delivered on: ${order.deliveryDate.toDate().toLocaleDateString()}</p>
                <p class="p-2">Total Price: $${order.totalPrice}</p>
            `;
        } else {
            document.getElementById('orderDetails').innerHTML = `<p>Order not found!</p>`;
        }
    }).catch((error) => {
        console.error("Error getting order:", error);
        document.getElementById('orderDetails').innerHTML = `<p>Error loading order details.</p>`;
    });
}


loadOrderDetails(orderId);
