var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/9147b186/smart_contracts"});

totalShares=0;

function updateTotals() {
	console.log("TShares",totalShares);
	var cost=$('#feedIn').attr('data')*1;
	$('#shareA').html((100*($('#shareA').attr('data')*1/totalShares)).toFixed(2)+"%");
	$('#shareB').html((100*($('#shareB').attr('data')*1/totalShares)).toFixed(2)+"%");
	$('#shareC').html((100*($('#shareC').attr('data')*1/totalShares)).toFixed(2)+"%");
	
	$('#costA').html((($('#shareA').attr('data')*1/totalShares)*cost).toFixed(2));
	$('#costB').html((($('#shareB').attr('data')*1/totalShares)*cost).toFixed(2));
	$('#costC').html((($('#shareC').attr('data')*1/totalShares)*cost).toFixed(2));	
}

// 

node.mpr().then(function(mpr) {
		mpr.readings("0x8eF4a8464df18D025115AdfA811a28eb723deeA6").then(function(r) {
				// Zählerstand - Anfangszählerstand * 0.0025 Variable Stromkosten (0,00025 Ct/Wh)
				var feedIn=(parseInt(r.power,16)-99977057)*0.000025;				
				var now = new Date();
				var start = new Date(now.getFullYear(), 0, 0);
				var diff = now - start;
				var poy = 86400000*365;	
				feedIn=(feedIn/(diff/poy));
				$('#feedIn').html(feedIn.toFixed(2));
				$('#feedIn').attr('data',feedIn)				
				updateTotals();
		});		
});

node.erc20token('0x20e476AeeA53E8127A388e668667719DB95A2d94').then(function(cutoken) {	
	cutoken.balanceOf("0x60364DaA7baf66384A39Be376e90123d58f26F37").then(function(share) {
		$('#shareA').attr('data',parseInt(share,16));
		totalShares+=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf("0x9c8074F5e37f2B19F85CaDe0D8e55D487a4fA84B").then(function(share) {
		$('#shareB').attr('data',parseInt(share,16));
		totalShares+=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf("0xd41109023A302372C57A93b5c1bdBe8C50431a35").then(function(share) {
		$('#shareC').attr('data',parseInt(share,16));
		totalShares+=parseInt(share,16);
		updateTotals();
	});
});


