var tkn="0x8263026C63a95E312478203D54A56202D8B4a8eb";
var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@9147b186/smart_contracts"});

function updateBalance() {
	node.erc20token(tkn).then(function(token) {		
			token.totalSupply().then(function(b) {
					//console.log(b);
					$('#sold').html(b);
					$('#unused').html($('#sold').html()*1-$('#used').html());
			});
			token.balanceOf(tkn).then(function(b) {
				$('#used').html(b);
				$('#unused').html($('#sold').html()*1-$('#used').html());
			});
	});
}

setInterval("updateBalance();",10000);
updateBalance();
