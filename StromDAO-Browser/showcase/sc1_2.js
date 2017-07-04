$('#go').on('click',function() {
	// Create Instance with external ID 1234
	var node = new document.StromDAOBO.Node({external_id:$('#extid').val(),testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});
	$('#result').show();
	// Fill View (HTML) using JQuery
	$('#account').html(node.wallet.address);
	$('#private_key').val(node.wallet.privateKey);
	$('#dsp_extid').val($('#extid').val());
});
