
let cart = [];

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    displayCart();
}

function displayCart() {

    let cartItems = document.getElementById("cart-items");
    let total = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "Your cart is empty.";
    }

    cart.forEach(function(item, index) {

        total += item.price;

        cartItems.innerHTML += `
            <p>
                ${item.name} - ₹${item.price}
                <button onclick="removeItem(${index})">Remove</button>
            </p>
        `;
    });

    document.getElementById("total").innerText =
        "Total: ₹" + total;
}

function removeItem(index) {

    cart.splice(index, 1);

    displayCart();
}

function placeOrder() {

    if (cart.length === 0) {
        alert("Please add food to your cart!");
        return;
    }

    let payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!payment) {
        alert("Please select a payment method!");
        return;
    }

    let token = "CAN" + Math.floor(1000 + Math.random() * 9000);

    let total = cart.reduce(function(sum, item) {
        return sum + item.price;
    }, 0);

    let paymentStatus;
    let orderItems = cart.map(function(item) {
    return {
        name: item.name,
        price: item.price
    };
});

    if (payment.value === "Online Payment") {

        let paid = confirm(
            "Demo Payment\nAmount: ₹" + total +
            "\nClick OK to simulate successful payment."
        );

        if (!paid) {
            alert("Payment cancelled. Order not placed.");
            return;
        }

        paymentStatus = "Paid (Demo Payment)";

    } else {

        paymentStatus = "Pending - Pay at Counter";

    }

    document.getElementById("token-number").innerText = token;

    document.getElementById("payment-status").innerText =
        "Payment Status: " + paymentStatus;

    document.getElementById("order-confirmation").style.display =
        "block";
        let newOrder = {
    token: token,
    items: orderItems,
    total: total,
    payment: payment.value,
    paymentStatus: paymentStatus,
    status: "Placed"
};

let orders = JSON.parse(localStorage.getItem("orders")) || [];

orders.push(newOrder);

localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    displayCart();

    document.querySelectorAll(
        'input[name="payment"]'
    ).forEach(function(input) {
        input.checked = false;
    });

    document.getElementById("order-confirmation")
        .scrollIntoView({ behavior: "smooth" });

}


function studentLogin() {

    let name = document.getElementById("studentName").value;
    let usn = document.getElementById("studentUSN").value;
    let dept = document.getElementById("studentDept").value;

    if (name === "" || usn === "" || dept === "") {
        alert("Please fill all the details!");
        return;
    }

    document.getElementById("studentWelcome").innerText =
        "Welcome, " + name + "! Happy ordering.";

    alert("Login successful!");

    document.getElementById("login-section").style.display = "none";
}

function displayOrders() {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let container = document.getElementById("orders-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "No orders available.";
        return;
    }

    orders.forEach(function(order, index) {

        let orderCard = document.createElement("div");

        orderCard.className = "food-card";

        let items = order.items.map(function(item) {
            return item.name + " - ₹" + item.price;
        }).join(", ");

        orderCard.innerHTML = `
            <h3>Token: ${order.token}</h3>
            <p>Items: ${items}</p>
            <p>Total: ₹${order.total}</p>
            <p>Payment: ${order.payment}</p>
            <p>Payment Status: ${order.paymentStatus}</p>
            <p>Order Status: ${order.status}</p>

            <button onclick="updateOrderStatus(${index})">
                Update Status
            </button>
        `;

        container.appendChild(orderCard);

    });
}


function updateOrderStatus(index) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let statuses = ["Placed", "Preparing", "Ready", "Collected"];

    let currentIndex = statuses.indexOf(orders[index].status);

    if (currentIndex < statuses.length - 1) {

        orders[index].status = statuses[currentIndex + 1];

        localStorage.setItem("orders", JSON.stringify(orders));

        displayOrders();

    } else {

        alert("Order already collected!");

    }

}
displayOrders();

function trackOrder() {

    let token = document.getElementById("trackToken").value.trim();

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let order = orders.find(function(item) {
        return item.token === token;
    });

    let result = document.getElementById("tracking-result");

    if (!order) {
        result.innerHTML = "<p>Order not found! Please check your token.</p>";
        return;
    }

    result.innerHTML = `
        <h3>Order Found!</h3>
        <p>Token: ${order.token}</p>
        <p>Order Status: <strong>${order.status}</strong></p>
        <p>Payment Status: ${order.paymentStatus}</p>
        ${order.status === "Ready"
            ? "<h3>Your food is ready! Please collect it.</h3>"
            : ""}
    `;

}

function checkReadyOrders() {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let notified = JSON.parse(
        localStorage.getItem("notifiedOrders")
    ) || [];

    orders.forEach(function(order) {

        if (
            order.status === "Ready" &&
            !notified.includes(order.token)
        ) {

            alert(
                "Good news! Your order " +
                order.token +
                " is ready for collection!"
            );

            notified.push(order.token);

        }

    });

    localStorage.setItem(
        "notifiedOrders",
        JSON.stringify(notified)
    );

}
if (document.getElementById("tracking-section")) {
    checkReadyOrders();
    setInterval(checkReadyOrders, 3000);
}
