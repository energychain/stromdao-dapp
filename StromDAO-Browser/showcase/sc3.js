var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	
	$('#result').show();

	node.mpr().then(function(mpr) {
			mpr.readings($('#meterpointaddress').val()).then(function(o) {
				 console.log(o);
					d=new Date((o.time.toString())*1000);
					$('#ts').html(d.toLocaleString());
					$('#power').html(o.power.toString());				
			});
	});	
});

$('#meterpointaddress').val(node.wallet.address);
