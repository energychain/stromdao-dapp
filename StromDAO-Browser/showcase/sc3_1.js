var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	$('#go').attr('disabled','disabled');
	$('#result').show();

	node.mpr().then(function(mpr) {
			mpr.storeReading($('#reading').val()).then(function(o) {			
								 console.log(o);		
								 $('#go').removeAttr('disabled');		
			});
	});	
});

node.mpr().then(function(mpr) {
	mpr.readings(node.wallet.address).then(function(o) {
			$('#reading').val(o.power);
	});
});
