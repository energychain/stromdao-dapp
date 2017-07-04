// Create Instance with external ID 1234
var node = new document.StromDAOBO.Node({external_id:"1234",testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/6dc9e073/smart_contracts/"});

// Fill View (HTML) using JQuery
$('#account').html(node.wallet.address);
$('#private_key').val(node.wallet.privateKey);


