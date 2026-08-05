console.log("Celestial Elite Loaded!");


// ===============================
// GOOGLE APPS SCRIPT
// ===============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLKqiLLZ45F9YRLFR-m1UR7p6ZaabVxrFnh7GCPiY1oIMI1AEVB0kN1k3CTb9qAY5pmA/exec";


// ===============================
// PHONE VALIDATION
// ===============================

const phoneInput = document.getElementById("customer-phone");

if(phoneInput){

    phoneInput.addEventListener("input", function(){

        this.value = this.value.replace(/\D/g,"");

        if(this.value.length > 11){
            this.value = this.value.slice(0,11);
        }

    });

}



// ===============================
// QUANTITY BUTTON
// ===============================

const minusButtons = document.querySelectorAll(".minus");
const plusButtons = document.querySelectorAll(".plus");


minusButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        let input = button.parentElement.querySelector("input");

        let value = parseInt(input.value) || 0;


        if(value > 0){

            input.value = value - 1;

        }

    });

});



plusButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        let input = button.parentElement.querySelector("input");

        let value = parseInt(input.value) || 0;

        input.value = value + 1;

    });

});




// ===============================
// SCROLL REVEAL
// ===============================

const reveals = document.querySelectorAll(".reveal");


function reveal(){

    reveals.forEach(element=>{

        let windowHeight = window.innerHeight;

        let revealTop = element.getBoundingClientRect().top;

        let revealPoint = 120;


        if(revealTop < windowHeight - revealPoint){

            element.classList.add("active");

        }

    });

}


reveal();

window.addEventListener("scroll",reveal);




// ===============================
// NAVBAR EFFECT
// ===============================

const navbar = document.querySelector(".navbar");


window.addEventListener("scroll",()=>{


    if(navbar){

        if(window.scrollY > 50){

            navbar.classList.add("active");

        }else{

            navbar.classList.remove("active");

        }

    }


});




// ===============================
// CART SYSTEM
// ===============================


const cartSidebar = document.getElementById("cart-sidebar");

const cartItems = document.querySelector(".cart-items");

const cartCount = document.getElementById("cart-count");

const cartTotal = document.getElementById("cart-total");

const addCartButtons = document.querySelectorAll(".add-cart");



let cart = JSON.parse(localStorage.getItem("cart")) || [];





// OPEN CART

document.addEventListener("click",e=>{


    if(e.target.closest("#cart-btn")){


        if(cartSidebar){

            cartSidebar.classList.add("active");

        }

    }



});





// CLOSE CART

document.addEventListener("click",e=>{


    if(e.target.closest("#close-cart")){


        if(cartSidebar){

            cartSidebar.classList.remove("active");

        }

    }


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

            <p>Add your favorite fragrance<br>and start shopping.</p>

        </div>

        `;


    }



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



    cartTotal.textContent = "₱"+total;

    cartCount.textContent = count;



}



function saveCart(){

    localStorage.setItem("cart",JSON.stringify(cart));

    updateCart();

    updateOrderMessage();

}



updateCart();


// ===============================
// ADD TO CART
// ===============================

addCartButtons.forEach(button=>{

    button.addEventListener("click",()=>{


        const productCard = button.closest(".product-card");


        const name = productCard.querySelector("h3")?.textContent.trim() || "Unknown";


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




        const existing = cart.find(item=>item.name === name);



        if(existing){

            existing.quantity += quantity;


        }else{


            cart.push({

                name:name,

                price:price,

                quantity:quantity

            });


        }




        saveCart();



        productCard.querySelector(".quantity input").value = 0;


        showToast(name+" added to cart");



        if(cartSidebar){

            cartSidebar.classList.add("active");

        }



    });


});






// ===============================
// REMOVE CART ITEM
// ===============================


if(cartItems){


    cartItems.addEventListener("click",e=>{


        if(e.target.classList.contains("remove-item")){


            let index = Number(e.target.dataset.index);


            cart.splice(index,1);


            saveCart();


            showToast("Item removed from cart.");


        }



    });


}







// ===============================
// ORDER MESSAGE DISPLAY
// ===============================


function updateOrderMessage(){


    const messageBox = document.getElementById("order-message");


    if(!messageBox){

        return;

    }



    if(cart.length === 0){

        messageBox.value = "";

        return;

    }



    let text = "Order Details:\n\n";


    let total = 0;



    cart.forEach(item=>{


        let subtotal = item.price * item.quantity;



        text += `${item.name} x${item.quantity} - ₱${subtotal}\n`;



        total += subtotal;



    });



    text += `\nTotal: ₱${total}`;



    messageBox.value = text;



}







// ===============================
// TOAST
// ===============================


const toast = document.getElementById("toast");



function showToast(message){


    if(!toast){

        return;

    }



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
// CHECKOUT SYSTEM
// ===============================


const checkoutBtn = document.getElementById("checkout-btn");



if(checkoutBtn){


checkoutBtn.addEventListener("click",async()=>{



    let name =
    document.getElementById("customer-name")?.value.trim() || "";



    let email =
    document.getElementById("customer-email")?.value.trim() || "";



    let phone =
    document.getElementById("customer-phone")?.value.trim() || "";





    if(cart.length === 0){

        showToast("Your cart is empty.");

        return;

    }





    if(name === "" || email === "" || phone === ""){


        showToast("Please complete the fill up form first.");


        document.getElementById("contact")?.scrollIntoView({

            behavior:"smooth"

        });



        return;


    }





    if(!/^09\d{9}$/.test(phone)){


        showToast("Invalid Philippine mobile number.");


        return;


    }






    checkoutBtn.disabled = true;


    checkoutBtn.textContent = "Sending...";





    let orderID = generateOrderID();



    let total = 0;

    let products = "";





    cart.forEach(item=>{


        let subtotal = item.price * item.quantity;


        products += `${item.name} x${item.quantity} - ₱${subtotal}\n`;


        total += subtotal;



    });







    let orderText = `Hello Celestial Elite! ✨

I would like to request my fragrance order.

Order ID:
${orderID}


Products:

${products}


TOTAL:
₱${total}


Customer Information:

Name: ${name}

Email: ${email}

Contact: ${phone}`;





    let messengerURL =
    "https://m.me/61572153625118?text="+
    encodeURIComponent(orderText);





    let orderData = {


        orderId:orderID,

        customer:name,

        email:email,

        phone:phone,

        products:products,

        total:total,

        messenger:messengerURL


    };





    try {

    await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(orderData)
    });

    showToast("Order saved successfully!");

    cart = [];
    saveCart();

    window.location.href =
"order-confirmation.html?order=" +
encodeURIComponent(orderText);

} catch(error) {

    console.error(error);

    showToast("Google Sheet connection failed.");

}




    checkoutBtn.disabled=false;

    checkoutBtn.textContent="Request Your Fragrance";





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



    zoomImages = zoomImages.map(img=>img.trim());



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


    if(zoomImages.length === 0){

        return;

    }



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


    if(zoomImages.length === 0){

        return;

    }



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
// CLOSE IMAGE BACKGROUND CLICK
// ===============================


const modal = document.getElementById("image-modal");



if(modal){


    modal.addEventListener("click",function(e){


        if(e.target === modal){


            closeZoom();


        }


    });


}








// ===============================
// ESC KEY CLOSE
// ===============================


document.addEventListener("keydown",function(e){



    if(e.key !== "Escape"){

        return;

    }




    const modal = document.getElementById("image-modal");



    if(modal && modal.classList.contains("active")){


        closeZoom();


    }
    else if(cartSidebar && cartSidebar.classList.contains("active")){


        cartSidebar.classList.remove("active");


    }



});





console.log("SCRIPT END OK");