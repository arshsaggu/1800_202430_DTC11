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
                    
