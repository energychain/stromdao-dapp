var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	
	$('#result').show();

	node.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(stromkonto) {			
			stromkonto.balancesHaben($('#meterpointaddress').val()).then(function(o) {
				$('#equity').html(o);	
				$('#balance').html($('#equity').html()-$('#liability').html());
			});
			stromkonto.balancesSoll($('#meterpointaddress').val()).then(function(o) {
				$('#liability').html(o);
				$('#balance').html($('#equity').html()-$('#liability').html());
			});			
	});	
});

$('#meterpointaddress').val(node.wallet.address);
