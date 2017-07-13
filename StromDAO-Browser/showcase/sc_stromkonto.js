var mp="0x83F8B15eb816284ddcF2ff005Db7a19196d86ae1";
var smpc="0x2F516D1e3dcB330BB44c00cb919ab5081075C77E";
var node = new document.StromDAOBO.Node({external_id:'1234',testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://raw.githubusercontent.com/energychain/StromDAO-BusinessObject/master/smart_contracts"});
var ldcnt=0;
var lables={};
	
/*
 3992 0x4caB5660420BECAF280553b8c5634668379b81E0 UST
 6880 0x9B6084a9a35Fc638A67Fd43d6c73B9325263D2f5 EEG
 2050 0xE4Dd81107246BC8366a28b2F346c1F3C0146526d Stromsteuer
 1660 0xC3d7291E403703Ae8BbF1d924C854c60B617D611 Konzessionsabgabe
  410 0xAc67A65B42186284e3c1748927Ce2590ad51390b KWK Umlage
  410 0x5be5c47D592f1eaE734c2f297a396bb5DE2610d5 §19 Umlage
 9598 0x6011229E95916A766DC525b68866CB082be4b252 Erzeugung, Transport und Logistik
 */


function addAccounts(settlement,idx) {
	settlement.accounts(idx).then(function(account) {
			node.stringstorage(account).then(
				function(str) {				
					str.str().then(function(label) {
						$('#breakdown').append("<tr><td title='"+account+"'>"+label+"</td><td align='right'><span id='shares_"+account+"'></span> €/kWh </td></tr>");
						$('#breakdownTotal').append("<tr><td title='"+account+"'>"+label+"</td><td align='right'><span id='total_"+account+"' class='subtotal'></span> € </td></tr>");
						lables[account.toLowerCase()]=label;
						if(label.length>1) {							
							settlement.share(account).then(function(share) {
									$('#shares_'+account).html((share/100000).toFixed(6));								
									$('#total_'+account).attr("data",share/100000);			
									idx++;
									addAccounts(settlement,idx);
									updateTotals();	
							});
							updateLables();
						}
				});	
			});	
	});	
} 

function updateLables() {
	$.each( lables, function( key, value ) {		
		$('.lbl_'+key).html(value);	  
	});	
}

function updateTotals() {
	if($('#costPower').attr('data')!=0) {
		var energy=(($('#soll').attr('data2')/$('#costPower').attr('data'))/100000000);
		$('#energy').html(energy.toFixed(3));
		$.each($('.subtotal'),function(key,value) {
					$(value).html((energy*$(value).attr('data')).toFixed(6));			
		});
	}
	
}
function updateBalance() {
	node.mpr().then(function(mpr) {		
			mpr.readings(mp).then(function(reading) {
					$('#lastTime').html(new Date(reading.time*1000).toLocaleString());
					$('#lastPower').html((reading.power/1000).toFixed(3));
			});
	});
	node.singleclearing(smpc).then(function(settlement) {		
		settlement.last_reading().then(function(reading) {
			$('#settlementPower').html((reading/1000).toFixed(3));
			
		});
		settlement.last_time().then(function(time) {
			$('#settlementTime').html(new Date(time*1000).toLocaleString());			
		});
		settlement.total_shares().then(function(cost) {
			$('#costPower').attr('data',cost);
			$('#costPower').html((cost/100000).toFixed(6));	
			updateTotals();		
		});
		
		if(ldcnt==0) {
			ldcnt++;
			$('#breakdown').html("");
			addAccounts(settlement,0);
		} 		
	}); 
	node.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			sko.balancesSoll(smpc).then(function(haben) {
				
				haben=haben/10000000000000;
				$('#haben').html((haben).toFixed(6));
				$('#haben').attr('data',haben);			
				$('#saldo').html((( $('#haben').attr('data')- $('#soll').attr('data') )).toFixed(6));				
				updateTotals();
			});
			sko.balancesHaben(smpc).then(function(soll) {				
				$('#soll').attr('data2',soll);
				soll=soll/10000000000000;
				$('#soll').attr('data',soll);
				$('#soll').html((soll).toFixed(6));
				
				$('#saldo').html((( $('#haben').attr('data')- $('#soll').attr('data') )).toFixed(6));				
			});						
			sko.history(smpc,1000).then(function(o) {	
				$('#history').html("<tr><th>Buchungslauf</th><th>Von</th><th>An</th><th>Betrag</th>");
				o=o.reverse();	
				var blk="";
				var blk_label="";
				var l=0;
				for(var i=0;(i<o.length)&&(l<5);i++) {
						if(o[i].blockNumber!=blk) {
							blk=o[i].blockNumber;
							blk_label="#"+blk;
							l++;
						} else {
							blk_label="";
						}
						if(l<5) {
						$('#history').append("<tr><td>"+blk_label+"</td><td title='"+o[i].to+"' class='lbl_"+o[i].to.toLowerCase()+"'>"+o[i].to.substr(0,10)+"...</td><td title='"+o[i].from+"' class='lbl_"+o[i].from.toLowerCase()+"'>"+o[i].from.substr(0,10)+"...</td><td align='right'>"+(parseInt(o[i].value,16)/10000000000000).toFixed(6)+" € </td></tr>");						
					}
				}
				updateLables();
			});
	});
}
$('#mp').html(mp);
$('#smpc').html(smpc);
lables[smpc.toLowerCase()]="Kundenkonto";
setInterval("updateBalance();",10000);
updateBalance();
	
