const deleteButtons = document.querySelectorAll("#controls button");
async function deleteProduct(event){
    const button = event.target;
    const productId = button.dataset.productid;
    const csrfToken = button.dataset.csrftoken;
    const response = await fetch('/admin/delete/'+ productId  + "?_csrf=" + csrfToken  , {
        method:"delete",
    })
    if(!response.ok){
        alert("deletion failed")
        return;
    }
    const card = document.querySelector("."+"card" + productId);
    card.style.display = "none";
}


for(const deleteButton of deleteButtons){
    deleteButton.addEventListener("click",deleteProduct);
}