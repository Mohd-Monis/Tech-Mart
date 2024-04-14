const buttons = document.querySelectorAll(".addCart");


async function add(event){
    let btn = event.target;
    let id = btn.dataset.productid;
    let csrfToken = btn.dataset.csrftoken
    const request = `../user/add/${id}?_csrf=${csrfToken}`;
    let response = await fetch(request,{
        method:"post"
    })
    let jsonResponse = await response.json();
    let productNum = document.getElementById("product-num");
    productNum.parentNode.style.display = "inline";
    productNum.textContent = jsonResponse.totalItems;
}

for(btn of buttons){
    btn.addEventListener("click",add);
}