var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@9147b186/smart_contracts"});

function updateTotals() {
	var totalShares=1*$('#shareA').attr('data')+1*$('#shareB').attr('data')+1*$('#shareC').attr('data');
	var cost=1000-$('#feedIn').attr('data');
	$('#shareA').html((100*($('#shareA').attr('data')*1/totalShares)).toFixed(2)+"%");
	$('#shareB').html((100*($('#shareB').attr('data')*1/totalShares)).toFixed(2)+"%");
	$('#shareC').html((100*($('#shareC').attr('data')*1/totalShares)).toFixed(2)+"%");
	
	$('#costA').html((($('#shareA').attr('data')*1/totalShares)*cost).toFixed(2));
	$('#costB').html((($('#shareB').attr('data')*1/totalShares)*cost).toFixed(2));
	$('#costC').html((($('#shareC').attr('data')*1/totalShares)*cost).toFixed(2));
	console.log(($('#shareA').attr('data')*1/totalShares)*cost);
}

node.mpr().then(function(mpr) {
		mpr.readings("0x0170870D7ab8C2be0d99Df5AC8c162A6758BF91c").then(function(r) {
				// Zählerstand - Anfangszählerstand * 0.0004 Einspeisevergütung (0,0004 Ct/Wh)
				var feedIn=(parseInt(r.power,16)-88925584)*0.0004;
				$('#feedIn').html(feedIn.toFixed(2));
				$('#feedIn').attr('data',feedIn)				
		});		
});



node.erc20token('0x3b2A4d9D8e3CA2F375bdF0F8c5AfF1a0964F1Ea9').then(function(cutoken) {	
	cutoken.balanceOf("0x60364DaA7baf66384A39Be376e90123d58f26F37").then(function(share) {
		$('#shareA').attr('data',parseInt(share,16));
		updateTotals();
	});
	cutoken.balanceOf("0x9c8074F5e37f2B19F85CaDe0D8e55D487a4fA84B").then(function(share) {
		$('#shareB').attr('data',parseInt(share,16));
		updateTotals();
	});
	cutoken.balanceOf("0xd41109023A302372C57A93b5c1bdBe8C50431a35").then(function(share) {
		$('#shareC').attr('data',parseInt(share,16));
		updateTotals();
	});
});


