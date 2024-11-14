function CurrentOrder() {
    // Listen to the auth state change (This will be triggered when the page loads)
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
           
            alert("User not logged in.");
            return; // Abort the function if the user is not logged in
        }

    })}