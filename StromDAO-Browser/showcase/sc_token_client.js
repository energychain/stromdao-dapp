var tkn="0x8263026C63a95E312478203D54A56202D8B4a8eb";
var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@9147b186/smart_contracts"});

$('#address').html(node.wallet.address);


function updateBalance() {
	node.erc20token(tkn).then(function(token) {		
			token.balanceOf(node.wallet.address).then(function(b) {
					$('#balance').html(parseInt(b,16));
					if(parseInt(b,16)*1==0) {
						$('.pay').attr('disabled','disabled');
					} else {
						$('.pay').removeAttr('disabled');
					}
			});
	});
}

$('.pay').on('click',function(a,b) {
	$(a.currentTarget).attr('disabled','disabled');
	node.erc20token(tkn).then(function(token) {		
			token.transfer(tkn,1).then(function(h) {
					$('#history').append("<li><strong>"+h+"</strong><br/> "+$(a.currentTarget).html()+"</li>");
					updateBalance();	
					$(a.currentTarget).removeAttr('disabled');			
			});
	});	
});
setInterval("updateBalance();",10000);
updateBalance();
