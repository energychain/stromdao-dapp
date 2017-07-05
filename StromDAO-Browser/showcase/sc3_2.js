var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	
	$('#result').show();
	$('#resultTable').html("<tr><th>Block #</th><th>Reading</th></tr>");
	
	node.mpr().then(function(mpr) {					
			mpr.history($('#meterpointaddress').val(),1000).then(function(o) {	
				o=o.reverse();	
				for(var i=0;i<o.length;i++) {
						$('#resultTable').append("<tr><td>"+o[i].blockNumber+"</td><td>"+parseInt(o[i].power,16)+"</td></tr>");
				}
			});
	});	
});

$('#meterpointaddress').val(node.wallet.address);


node.mpr().then(function(mpr) {
	mpr.readings(node.wallet.address).then(function(o) {			
			$('#reading').val(o.power);
	});

});
