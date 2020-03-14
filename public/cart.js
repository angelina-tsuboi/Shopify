let charge = parseInt($("#totalMoney").text().slice(1));
charge <= 0 ? $("#chargeForm").hide() : $("#chargeForm").show();

$(".removeButton").click(function(){
    $.ajax({url: "/removeOrder", type: "POST", data: {
        orderId: $(this).parents("tr").children(".border-0").children(".p-2").children("#productInfoStore").children("#productId").html()
    }, success: function(result){
        console.log(`I am a result ${JSON.stringify(result.response, undefined, 2)}`);
    }});
    location.reload()
})

