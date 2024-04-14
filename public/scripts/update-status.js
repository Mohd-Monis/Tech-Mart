let statusForms = document.getElementsByClassName("status-form");

let statusbuttons = document.getElementsByClassName("status");

async function updateStatus(event){
    event.preventDefault();
    let data = event.target.dataset;
    let csrf = data.csrftoken;
    let orderid = data.orderid;
    let status = event.target.querySelector("select").value
    console.log("child selected is: ")
    console.log(event.target.querySelector("select"))
    console.log("target status is: ")
    console.log(status);
    console.log
    const request = `/admin/update-order-status?_csrf=${csrf}`;
    console.log("tried to update");
    let statusValue = event.target.parentNode.querySelector(".StatusValue");
    console.log(statusValue);
    statusValue.textContent = status;
    await fetch(request,{
        method:"post",
        headers:{
            'Content-Type' : "application/json"
        },
        body: await JSON.stringify({
            orderId:orderid,
            status: status,
        })
    });

}


for(form of statusForms){
    form.addEventListener("submit",updateStatus);
}

