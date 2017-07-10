var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/9147b186/smart_contracts"});

var totalPV=0;
var tokensPV=0;
var myPV=0;
var whPV=0;

var totalStorage=1250;
var tokensStorage=0;
var myStorage=0;
var whStorage=0;

var totalNet=0;
var tokensNet=0;
var myNet=0;
var whNet=0;

var mpa="0x60364DaA7baf66384A39Be376e90123d58f26F37";
var mpb="0x9c8074F5e37f2B19F85CaDe0D8e55D487a4fA84B";
var mpc="0xd41109023A302372C57A93b5c1bdBe8C50431a35";
function updateTotals() {
		console.log(tokensNet);
		$('#totalI').html((totalPV+totalStorage+totalNet).toFixed(2));
		$('#totalPV').html(totalPV.toFixed(2));
		$('#totalStorage').html(totalStorage.toFixed(2));
		$('#totalNet').html(totalNet.toFixed(2));
		
		$('#totalLokal').html(((whPV+whStorage)/1000).toFixed(0));
		$('#totalFern').html((whNet/1000).toFixed(0));
				
		
		$('#sharePV').html((100*(myPV/tokensPV)).toFixed(2));
		$('#shareStorage').html((100*(myStorage/tokensStorage)).toFixed(2));
		$('#shareNet').html((100*(myNet/tokensNet)).toFixed(2));
		
		$('#shareLokal').html((((myPV+myStorage)/(tokensPV+tokensStorage))*100).toFixed(2) );
		$('#shareFern').html((100*(myNet/tokensNet)).toFixed(2));
		var costt=(totalPV*(myPV/tokensPV))+(totalStorage*(myStorage/tokensStorage))+(totalNet*(myNet/tokensNet));
		$('#costT').html((costt).toFixed(2));
		$('#costPV').html((totalPV*(myPV/tokensPV)).toFixed(2));
		$('#costStorage').html((totalStorage*(myStorage/tokensStorage)).toFixed(2));
		$('#costNet').html((totalNet*(myNet/tokensNet)).toFixed(2));
		
		$('#costLokal').html((((myPV+myStorage)/(tokensPV+tokensStorage))*((whPV+whStorage)/1000)).toFixed(0));
		$('#costFern').html(((myNet/tokensNet)*(whNet/1000)).toFixed(0));
		
		$('#totalH').html((((whPV+whStorage)/1000)+(whNet/1000)).toFixed(0));
		var costinfra=(((myPV+myStorage)/(tokensPV+tokensStorage))*((whPV+whStorage)/1000))+((myNet/tokensNet)*(whNet/1000));
		$('#costH').html((costinfra).toFixed(0));
		$('#costInfra').html(costt.toFixed(2));
		$('#costNone').html((costinfra*0.25).toFixed(2));
		$('#costSave').html(((costinfra*0.25)-costt).toFixed(2));	
		
		$('#costZins').html(((((costinfra*0.25)-costt)/(costinfra*0.25))*100).toFixed(2));
		
}

node.mpr().then(function(mpr) {
		mpr.readings("0x0170870D7ab8C2be0d99Df5AC8c162A6758BF91c").then(function(r) {
				// Zählerstand - Anfangszählerstand * 0.0004 Einspeisevergütung (0,0004 Ct/Wh)
				var feedIn=(parseInt(r.power,16)-88925584)*0.0004;				
				totalPV=1000-feedIn;		
				updateTotals();		
		});		
});

node.mpr().then(function(mpr) {
		mpr.readings("0xAb93aA1C714FeB6D3B16DeF77cB9D25b291E5c9C").then(function(r) {
				// Zählerstand - Anfangszählerstand * 0.0004 Einspeisevergütung (0,0004 Ct/Wh)				
				whPV=(parseInt(r.power,16)-31980705)/100;	
				updateTotals();		
		});		
});

node.mpr().then(function(mpr) {
		mpr.readings("0xCb7d13eBE504aD913052387fE4258EdD80284973").then(function(r) {
				// Zählerstand - Anfangszählerstand 		
				whStorage=(parseInt(r.power,16)-32575807)*1;				
				updateTotals();		
		});		
});

node.mpr().then(function(mpr) {
		mpr.readings(mpa).then(function(r) {
				
				$('#readingTime').html(new Date(r.time*1000).toLocaleString());
				$('#reading').html(parseInt(r.power,16));
				whStorage=(parseInt(r.power,16)-32575807)*1;				
				updateTotals();		
		});		
});
node.mpr().then(function(mpr) {
		mpr.readings("0x8eF4a8464df18D025115AdfA811a28eb723deeA6").then(function(r) {
				// Zählerstand - Anfangszählerstand * 0.0025 Variable Stromkosten (0,00025 Ct/Wh)
				var feedIn=(parseInt(r.power,16)-99977057)*0.000025;				
				var now = new Date();
				var start = new Date(now.getFullYear(), 0, 0);
				var diff = now - start;
				var poy = 86400000*365;	
				whNet=(parseInt(r.power,16)-99977057)/(diff/poy)
				totalNet=feedIn/(diff/poy);							
				updateTotals();
		});		
});


node.erc20token('0x3b2A4d9D8e3CA2F375bdF0F8c5AfF1a0964F1Ea9').then(function(cutoken) {	
	cutoken.balanceOf(mpa).then(function(share) {
		tokensPV+=parseInt(share,16);
		myPV=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf(mpb).then(function(share) {
		tokensPV+=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf(mpc).then(function(share) {
		tokensPV+=parseInt(share,16);
		updateTotals();
	});
});

node.erc20token('0x22b2a6650227FEA5ef0565feA9c9268132379B57').then(function(cutoken) {	
	cutoken.balanceOf(mpa).then(function(share) {
		tokensStorage+=parseInt(share,16);
		myStorage=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf(mpb).then(function(share) {
		tokensStorage+=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf(mpc).then(function(share) {
		tokensStorage+=parseInt(share,16);
		updateTotals();
	});
});
//0xd41109023A302372C57A93b5c1bdBe8C50431a35
//0x60364DaA7baf66384A39Be376e90123d58f26F37
node.erc20token('0x20e476AeeA53E8127A388e668667719DB95A2d94').then(function(cutoken) {	
	cutoken.balanceOf(mpa).then(function(share) {
		tokensNet+=parseInt(share,16);
		myNet=parseInt(share,16);		
		updateTotals();
	});
	cutoken.balanceOf(mpb).then(function(share) {
		tokensNet+=parseInt(share,16);
		updateTotals();
	});
	cutoken.balanceOf(mpc).then(function(share) {
		tokensNet+=parseInt(share,16);
		updateTotals();
	});
});

