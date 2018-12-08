var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	
	$('#result').show();
	$('#resultTable').html("<tr><th>Block #</th><th>From</th><th>To</th><th>Value</th></tr>");

	node.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(stromkonto) {			
			stromkonto.history($('#meterpointaddress').val(),1000).then(function(o) {	
				o=o.reverse();	
				for(var i=0;i<o.length;i++) {
						$('#resultTable').append("<tr><td>"+o[i].blockNumber+"</td><td title='"+o[i].from+"'>"+o[i].from.substr(0,10)+"...</td><td title='"+o[i].to+"'>"+o[i].to.substr(0,10)+"...</td><td>"+parseInt(o[i].value,16)+"</td></tr>");
				}
			});
	});	
});

$('#meterpointaddress').val(node.wallet.address);
