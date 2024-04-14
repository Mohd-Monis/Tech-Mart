const fileInput = document.querySelector(".image-upload input");
const imagePreview = document.querySelector(".image-upload img");


function preview(){
    let files = fileInput.files;
    if(!files || !files.length){
        imagePreview.style.display = "none";
        return;
    }

    const pickedFile = files[0];


    imagePreview.src = URL.createObjectURL(pickedFile);
    imagePreview.style.display = "block";
}


fileInput.addEventListener("change",preview)