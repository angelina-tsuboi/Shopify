$('#mainCart').click(function(e){
    e.preventDefault()
    checkStorage();
    window.location.href = `/cart?pickUpName=${sessionStorage.getItem('pickUpName')}`
})

$('.add-to-cart').click(function(e){
    e.preventDefault()
    checkStorage();
    $.ajax({url: "/order", type: "POST", data: {
        name: $(this).parents().siblings('.product-content').children('.title').children('.productName').text(),
        image: $(this).parents('.product-image2').children("#images").children(".pic-1").attr("src"),
        price: $(this).parents().siblings('.product-content').children('.price').text(),
        pickUpName: sessionStorage.getItem('pickUpName')
    }, success: function(result){
        console.log(`I am a result ${JSON.stringify(result.response, undefined, 2)}`);
    }});
    window.location.href = `/cart?pickUpName=${sessionStorage.getItem('pickUpName')}`
})


function checkStorage(){
    if(sessionStorage.getItem('pickUpName') == null){
        var name = prompt("Enter pickup name/code: ");
        sessionStorage.setItem('pickUpName', name);
    }
}