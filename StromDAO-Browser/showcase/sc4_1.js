var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	$('#go').attr('disabled','disabled');
	$('#result').show();

	node.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(stromkonto) {			
			stromkonto.addTx($('#from').val(),$('#to').val(),$('#value').val(),$('#value').val()).then(function(o) {
				$('#txhash').html(o);
				$('#go').removeAttr('disabled');					
			});
	});	
});

$('#to').val(node.wallet.address);
$('#from').val(node.nodeWallet.address);
