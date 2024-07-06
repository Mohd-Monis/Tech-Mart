let pluses = document.getElementsByClassName("plus");
let minuses = document.getElementsByClassName("minus");
let NoItems = document.getElementById("NoItems");
const card = document.querySelectorAll(".Card")[0];
const displayempty = document.querySelectorAll("main h5")[0];

async function increaseProductQuantity(event){

    let id = event.target.dataset.productid;
    let csrfToken = event.target.dataset.csrftoken;
    let response = await fetch(
        `../user/add/${id}?_csrf=${csrfToken}`,{
            method:"post",
        }
    )
    let jsonResponse = await response.json();
    let productNum = document.getElementById(`product-num-${id}`);
    productNum.textContent = jsonResponse.curr_product_num;
 
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = jsonResponse.total;
}

async function decreaseProductQuantity(event){

    let id = event.target.dataset.productid;
    let csrfToken = event.target.dataset.csrftoken;
    let response = await fetch(
        `../user/reduce/${id}?_csrf=${csrfToken}`,{
            method:"post",
        }
    )
    let jsonResponse = await response.json();
    let productNum = document.getElementById(`product-num-${id}`);
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = jsonResponse.total;
    // if(jsonResponse.productNumber == 0){
    //     card.style.display = "none";
    //     displayempty.style.display = "block";
    //     return;
    // }
    let parent = event.target.parentNode.parentNode.parentNode.parentNode;
    let wholeParent = parent.parentNode;
    console.log(jsonResponse);
    if(jsonResponse.curr_product_num == 0){
        console.log(parent);
        parent.style.display = "none";
    }
    if(jsonResponse.total_product_num == 0){
        wholeParent.style.display = "none";
        NoItems.style.display = "block";
    }
    productNum.textContent = jsonResponse.curr_product_num;
}


for(let plus of pluses){
    plus.addEventListener("click",increaseProductQuantity);
}

for(let minus of minuses){
    minus.addEventListener("click",decreaseProductQuantity);
}