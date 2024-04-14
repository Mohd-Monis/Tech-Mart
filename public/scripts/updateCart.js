let pluses = document.getElementsByClassName("plus");
let minuses = document.getElementsByClassName("minus");


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
    productNum.textContent = jsonResponse.productNumber;
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
    if(jsonResponse.productNumber == 0){
        event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
        return;
    }
    productNum.textContent = jsonResponse.productNumber;
}


for(let plus of pluses){
    plus.addEventListener("click",increaseProductQuantity);
}

for(let minus of minuses){
    minus.addEventListener("click",decreaseProductQuantity);
}