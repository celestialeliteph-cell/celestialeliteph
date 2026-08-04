console.log("Celestial Elite Loaded!");


const phoneInput = document.getElementById("customer-phone");

if (phoneInput) {

    phoneInput.addEventListener("input", function () {

        // Numbers only
        this.value = this.value.replace(/\D/g, "");

        // Maximum 11 digits
        if (this.value.length > 11) {
            this.value = this.value.slice(0, 11);
        }

    });

}


// ===============================
// QUANTITY BUTTON
// ===============================

const minusButtons = document.querySelectorAll(".minus");
const plusButtons = document.querySelectorAll(".plus");

minusButtons.forEach(button => {
    button.addEventListener("click", () => {

        let input = button.parentElement.querySelector("input");
        let value = parseInt(input.value) || 0;

        if (value > 0) {
            input.value = value - 1;
        }

    });
});

plusButtons.forEach(button => {

    button.addEventListener("click", () => {

        let input = button.parentElement.querySelector("input");

        let value = parseInt(input.value) || 0;
        input.value = value + 1;

    });

});



// =========================================
// SCROLL REVEAL ANIMATION
// =========================================

const reveals = document.querySelectorAll(".reveal");


function reveal() {

    reveals.forEach((element) => {

        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 120;


        if (revealTop < windowHeight - revealPoint) {

            element.classList.add("active");

        }

    });

}


// Run on page load
reveal();


// Run while scrolling
window.addEventListener("scroll", reveal);



// =========================================
// NAVBAR SCROLL EFFECT
// =========================================

const navbar = document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if(navbar){

        if(window.scrollY > 50){

            navbar.classList.add("active");

        }else{

            navbar.classList.remove("active");

        }

    }

});

// ===============================
// SHOPPING CART + LOCAL STORAGE
// ===============================



// CART OPEN
const cartSidebar = document.getElementById("cart-sidebar");

document.addEventListener("click", function(e){

    const cartButton = e.target.closest("#cart-btn");

    if(cartButton && cartSidebar){

        cartSidebar.classList.add("active");

    }

});

// CART CLOSE (X BUTTON)
document.addEventListener("click", function(e){

    const closeButton = e.target.closest("#close-cart");

    if(closeButton && cartSidebar){

        cartSidebar.classList.remove("active");

    }

});

// CLOSE CART WHEN CLICKING OUTSIDE
document.addEventListener("click", function(e){

    if(
        cartSidebar &&
        cartSidebar.classList.contains("active") &&
        !e.target.closest(".cart-sidebar") &&
        !e.target.closest("#cart-btn")
    ){

        cartSidebar.classList.remove("active");

    }

});

// ADD TO CART
const addCartButtons = document.querySelectorAll(".add-cart");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display cart immediately
updateCart();
updateOrderMessage();

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productCard = button.closest(".product-card");

        const name = productCard.querySelector("h3")?.textContent || "Unknown Product";

        const price = parseInt(
    productCard.querySelector(".price")?.textContent.replace("₱","")
) || 0;

        const quantity = parseInt(
    productCard.querySelector(".quantity input")?.value
) || 0;

        if(quantity <= 0){
            showToast("Please select a quantity first.");
            return;

        }

        // Check if product already exists
        const existing = cart.find(item => item.name === name);

        if(existing){

            existing.quantity += quantity;

        }else{

            cart.push({
                name,
                price,
                quantity
            });

        }

        saveCart();
productCard.querySelector(".quantity input").value = 0;
showToast(`${name} added to cart`);

if(cartSidebar){
    cartSidebar.classList.add("active");
}

    });

});

function updateCart(){

    if(!cartItems || !cartTotal || !cartCount){

        return;

    }

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;
    
    
    if(cart.length === 0){

    cartItems.innerHTML = `


        <div class="empty-cart">


            <h3>Your cart is empty</h3>

            <p>
                Add your favorite fragrance<br>
                and start shopping.
            </p>

        </div>

    `;

}

    


    if(cart.length > 0){

    cart.forEach((item,index)=>{

        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <h4>${item.name}</h4>

                <p>₱${item.price} × ${item.quantity}</p>

                <button class="remove-item" data-index="${index}">
                    Remove
                </button>

            </div>
        `;

    });

}


cartTotal.textContent = "₱" + total;
cartCount.textContent = count;

    

}

if(cartItems){

cartItems.addEventListener("click", function(e){

    if(e.target.classList.contains("remove-item")){

        const index = Number(e.target.dataset.index);

        cart.splice(index,1);

        saveCart();

        showToast("Item removed from cart.");

    }

});

}





function saveCart(){

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();

    updateOrderMessage();

}

function updateOrderMessage(){

    const messageBox = document.getElementById("order-message");

    if(!messageBox) return;

    if(cart.length === 0){
    messageBox.value = "";
    return;
}

    let orderText = "Order Details:\n\n";
    let total = 0;

    cart.forEach(item=>{

        let subtotal = item.price * item.quantity;

        orderText += `${item.name} x${item.quantity} - ₱${subtotal}\n`;

        total += subtotal;

    });

    orderText += `\nTotal: ₱${total}`;

    messageBox.value = orderText;

}




// ===============================
// TOAST NOTIFICATION
// ===============================

const toast = document.getElementById("toast");


function showToast(message){

    if(!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


// ===============================
// GENERATE ORDER ID
// ===============================

function generateOrderID(){

    let date = new Date();

    let year = date.getFullYear().toString().slice(-2);
    let month = String(date.getMonth()+1).padStart(2,"0");
    let day = String(date.getDate()).padStart(2,"0");

    let random = Math.random()
    .toString(36)
    .substring(2,6)
    .toUpperCase();


    return `CE-${year}${month}${day}-${random}`;

}



// ===============================
// REQUEST YOUR FRAGRANCE BUTTON
// ===============================


const checkoutBtn = document.getElementById("checkout-btn");

if(checkoutBtn){

checkoutBtn.addEventListener("click",()=>{


let name = document.getElementById("customer-name")?.value.trim() || "";
let email = document.getElementById("customer-email")?.value.trim() || "";
let phone = document.getElementById("customer-phone")?.value.trim() || "";


// CHECK EMPTY CART
if(cart.length === 0){

    showToast("Your cart is empty.");

    return;

}

// CHECK FORM FIRST
if(name === "" || email === "" || phone === ""){

    showToast("Please complete the fill up form first before proceeding with your fragrance request.");

    const contactSection = document.getElementById("contact");

if(contactSection){
    contactSection.scrollIntoView({
        behavior:"smooth"
    });
}

    return;

}


// PHONE VALIDATION
if (!/^09\d{9}$/.test(phone)) {

    showToast("Please enter a valid Philippine mobile number.");

    const phoneField = document.getElementById("customer-phone");

    if(phoneField){
        phoneField.focus();
    }

    return;

}

// Disable 
checkoutBtn.disabled = true;
checkoutBtn.textContent = "Sending...";

let orderID = generateOrderID();

    

const orderIdInput = document.getElementById("order-id");

if (orderIdInput) {
    orderIdInput.value = orderID;
}

let orderText = 
`Hello Celestial Elite! ✨
I would like to request my fragrance order.

Order ID: ${orderID}

Order Details:
`;


let total = 0;


cart.forEach(item=>{

    let subtotal = item.price * item.quantity;

    orderText += 
`• ${item.name}
  Quantity: ${item.quantity}
  Subtotal: ₱${subtotal}

`;

    total += subtotal;

});


orderText += 
`TOTAL: ₱${total}\n\n`;


orderText += 
"Customer Information:\n\n";


orderText += `Name: ${name}\n`;
orderText += `Email: ${email}\n`;
orderText += `Contact: ${phone}`;


   let messengerURL =
"https://m.me/61572153625118?text=" +
encodeURIComponent(orderText);

// Open Messenger
const messenger = window.open(messengerURL, "_blank");

if (messenger) {
     // Clear cart
    cart = [];
    saveCart();

const nameField = document.getElementById("customer-name");
const emailField = document.getElementById("customer-email");
const phoneField = document.getElementById("customer-phone");

if(nameField) nameField.value = "";
if(emailField) emailField.value = "";
if(phoneField) phoneField.value = "";

    if (orderIdInput) {
        orderIdInput.value = "Will be generated automatically";
    }

    const messageBox = document.getElementById("order-message");
    if (messageBox) {
        messageBox.value = "";
    }

    if(cartSidebar){

    cartSidebar.classList.remove("active");

}

showToast("Thank you! Your fragrance request has been sent.");

    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Request Your Fragrance";

} else {

    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Request Your Fragrance";

    showToast("Unable to open Messenger. Please allow pop-ups and try again.");

}
}); 

} 


// ===============================
// IMAGE ZOOM SLIDER
// ===============================


let zoomImages = [];

let zoomIndex = 0;



function openZoom(image){

    const modal = document.getElementById("image-modal");

    const zoomImage = document.getElementById("zoom-image");


    if(!modal || !zoomImage){

        return;

    }


    zoomImages = image.dataset.images.split(",");


    zoomImages = zoomImages.map(img => img.trim());


    zoomIndex = 0;


    zoomImage.src = zoomImages[zoomIndex];


    modal.classList.add("active");

}





function closeZoom(){

    const modal = document.getElementById("image-modal");

    if(modal){

        modal.classList.remove("active");

    }

}





function nextImage(){

    if(zoomImages.length === 0) return;

    zoomIndex++;

    if(zoomIndex >= zoomImages.length){

        zoomIndex = 0;

    }

    const zoomImage = document.getElementById("zoom-image");

    if(zoomImage){

        zoomImage.src = zoomImages[zoomIndex];

    }

}


function prevImage(){

    if(zoomImages.length === 0) return;

    zoomIndex--;

    if(zoomIndex < 0){

        zoomIndex = zoomImages.length - 1;

    }

    const zoomImage = document.getElementById("zoom-image");

    if(zoomImage){

        zoomImage.src = zoomImages[zoomIndex];

    }

}


// ===============================
// CLOSE IMAGE WHEN CLICKING BACKGROUND
// ===============================

const modal = document.getElementById("image-modal");

if(modal){

    modal.addEventListener("click", function(e){

        if(e.target === modal){

            closeZoom();

        }

    });

}


// ===============================
// CLOSE IMAGE USING ESC KEY
// ===============================

document.addEventListener("keydown", function(e){

    if(e.key !== "Escape") return;

    const modal = document.getElementById("image-modal");

    if(modal && modal.classList.contains("active")){
        closeZoom();
    }else if(cartSidebar && cartSidebar.classList.contains("active")){
        cartSidebar.classList.remove("active");
    }

});