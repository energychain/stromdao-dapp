$('#go').on('click',function() {
	// Create Instance with external ID 1234 and existing private Key (relink)
	var node = new document.StromDAOBO.Node({external_id:'1234',privateKey:$('#pk').val(),testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.jsdelivr.net/gh/energychain/StromDAO-BusinessObject@6dc9e073/smart_contracts/"});
	$('#result').show();
	// Fill View (HTML) using JQuery
	$('#account').html(node.wallet.address);
	$('#private_key').val(node.wallet.privateKey);
	$('#dsp_extid').val($('#extid').val());
});
