var api="http://localhost:3000/api/";
var priceAPI="http://localhost:3000/prices/";
var token="";
var auth="";
var account="";
var tarif="";
var meterpoint="";
var smpcf="0xeCb1E8799155A15f62F098603ef79Fc45990f8B4";
var stromkontoproxy="0x19BF166624F485f191d82900a5B7bc22Be569895";

function valueDiv(num) {
		return num/10000000000;
}
function valueDisplay(num) {	
		return valueDiv(num).toLocaleString(undefined,{minimumFractionDigits: 2,  maximumFractionDigits: 2})
}
function mvalueDisplay(num) {	
		return valueDiv(valueDiv(num)).toLocaleString(undefined,{minimumFractionDigits: 6,  maximumFractionDigits: 6})
}
function accountLabel(address) {
	return address.substr(0,10)+"...";
}


function getTarifs() {
	$('#divHistory').hide();
	$('#appAlert').hide();
	$('#tarifInput').show();
	$('#confTarif').click(confTarifs);
}

function confirmTarif() {
		$('#tarifConf').hide();
		$('#log').empty();
		$('#consoleLog').show();
		$('#log').append("<li>Erstelle Clearing Verträge in der Blockchain...</li>");
		$.post(api+"singleclearingfactory/"+smpcf+"/build/"+stromkontoproxy+"/"+account+"/"+Math.round($('#gp').attr("data")/8760)+"/"+account+"/false/?token="+token,{},function(data) {
				$('#log').append("<li>Grundgebühr "+$('#gp').html()+" registriert unter: "+data+"</li>");	
				var sc_gp=JSON.parse(data);		
				$.post(api+"roleLookup/0x0000000000000000000000000000000000000006/setRelation/100/"+sc_gp+"?token="+token,{},function(data) {
						$('#log').append("<li>Relation Grundgebühr zu Stromkonto "+data+"</li>");
						$.post(api+"singleclearingfactory/"+smpcf+"/build/"+stromkontoproxy+"/"+account+"/"+$('#ap').attr("data")+"/"+account+"/false/?token="+token,{},function(data) {
							var sc_ap=JSON.parse(data);
							$('#log').append("<li>Arbeitspreis "+$('#ap').html()+" registriert unter: "+data+"</li>");	
							$.post(api+"roleLookup/0x0000000000000000000000000000000000000006/setRelation/101/"+sc_ap+"?token="+token,{},function(data) {
								$('#log').append("<li>Relation Arbeitspreis zu Stromkonto "+data+"</li>");
							});				
						});
				});	

		});
		
}
function confTarifs() {
	$('#tarifInput').hide();
	$('#tarifConf').show();
	$.get(priceAPI+$('#plz').val()+"/"+$('#ja').val()+"?token="+token,function(data) {
			data=JSON.parse(data);			
			console.log("Tarif Info",data);
			$.each(data.Price,function(a,b) {
				console.log(a,b);
				console.log(b.UpGross);
				$('#cityname').html(b.City);
				$('#ap').html((b.UpGross/100).toLocaleString());
				$('#ap').attr('data',b.UpGross*100000);
				$('#gp').html((b.BpGross*1).toLocaleString());
				$('#gp').attr('data',b.BpGross*100000);
				$('#jp').html((b.Total*1).toLocaleString());
			});
			$('#selTarif').click(confirmTarif);
	});		
}
function getConnection() {
	$.post(api+"roleLookup/0x0000000000000000000000000000000000000006/relations/"+account+"/100?token="+token,{},function(data) {				
				data=JSON.parse(data);
				if(data=="0x0000000000000000000000000000000000000000") {
						$('#appAlert').html("<span class='glyphicon glyphicon-warning-sign'></span>&nbsp;<strong>Kein Tarif zugeordnet</strong>. Bitte wählen Sie einen Tarif aus, der dem Stromkonto zugeordnet werden soll.&nbsp;<span class='glyphicon glyphicon-warning-sign'></span><br/><button class='btn btn-sm btn-danger' id='switchTarif'>weiter &raquo;&raquo;</button>");
						$('#appAlert').show();
						$('#switchTarif').click(function() {
								getTarifs();
						});
				} else {
						tarif_gp=data;
						
						$.post(api+"singleclearing/"+tarif_gp+"/energyCost/?token="+token,{},function(data) {
								$('.gp').html(valueDisplay(JSON.parse(data)*100000*8760));
								$('.gp').attr('data',JSON.parse(data));		
								
								$('.gp').attr('title',tarif_gp);				
						});
						console.log(api+"singleclearing/"+tarif_gp+"/getProvider/?token="+token);
						/*
						$.post(api+"singleclearing/"+tarif_gp+"/provider/?token="+token,{},function(data) {
								console.log("Provider Lookup",data);
								$('.provider').html(accountLabel(data));								
						});
						* */
						$.post(api+"singleclearing/"+tarif_gp+"/state/?token="+token,{},function(data) {
								var state=JSON.parse(data)*1;
								var status="unbekannt";
								if(state==0) status="Warten auf Lieferant";
								if(state==1) status="In Bearbeitung bei Lieferant";
								if(state==2) status="In Belieferung";
								
								$('.state_gp').html(status);							
						});
						$.post(api+"roleLookup/0x0000000000000000000000000000000000000006/relations/"+account+"/101?token="+token,{},function(data) {									
							tarif_ap=JSON.parse(data);
							$.post(api+"singleclearing/"+tarif_ap+"/energyCost/?token="+token,{},function(data) {							
								$('.ap').html((JSON.parse(data)/10000000).toLocaleString());
								$('.ap').attr('data',JSON.parse(data));
								$('.ap').attr('title',tarif_ap);
								$('#tarifInfo').show();
							});
							$.post(api+"singleclearing/"+tarif_ap+"/state/?token="+token,{},function(data) {
								var state=JSON.parse(data)*1;
								var status="unbekannt";
								if(state==0) status="Warten auf Lieferant";
								if(state==1) status="In Bearbeitung bei Lieferant";
								if(state==2) status="In Belieferung";
								
								$('.state_ap').html(status);							
							});
							$.post(api+"singleclearing/"+tarif_ap+"/meterpoint/?token="+token,{},function(data) {	
								var meterpoint = JSON.parse(data);
								$.post(api+"mpr/0x0/readings/"+meterpoint+"/?token="+token,{},function(data) {
											data = JSON.parse(data);
											$('#readingtime').val(new Date(parseInt(data.time._bn,16)*1000).toLocaleString());
											$('#readingpower').val(parseInt(data.power._bn,16));
											if(meterpoint.toLowerCase()!=account.toLowerCase()) {
												$('#readingtime').attr('disabled','disabled');
												$('#readingpower').attr('disabled','disabled');
											}
								});
							});
							$.post(api+"singleclearing/"+tarif_ap+"/last_reading/?token="+token,{},function(data) {							
								$('.readingpower').html(JSON.parse(data));								
							});
							$.post(api+"singleclearing/"+tarif_ap+"/last_time/?token="+token,{},function(data) {							
								$('.readingtime').html(JSON.parse(data));
								$('#meterInfo').show();								
							});
						});
				}
	});	
}
function updateBalance() {
		$.post(api+"stromkonto/0x19BF166624F485f191d82900a5B7bc22Be569895/balancesHaben/"+account+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				$('.haben').attr('data',data);
				$('.haben').html(valueDiv(data).toLocaleString(undefined,{minimumFractionDigits: 2,  maximumFractionDigits: 2}));				
				var saldo=1*$('.haben').attr('data')-1*$('.soll').attr('data');
				$('.saldo').html(valueDisplay(saldo));
		});
		$.post(api+"stromkonto/0x19BF166624F485f191d82900a5B7bc22Be569895/balancesSoll/"+account+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				$('.soll').attr('data',data);
				$('.soll').html(valueDiv(data).toLocaleString(undefined,{minimumFractionDigits: 2,  maximumFractionDigits: 2}));				
				var saldo=1*$('.haben').attr('data')-1*$('.soll').attr('data')
				$('.saldo').html(valueDisplay(saldo));
		});
}
function updateHistory() {
		$('#divHistory').show();
		$('#tarifInput').hide();
		$('#history').removeClass('table-striped');
		var html="<tr><th>Wertstellung</th><th>Buchung</th><th style='text-align:right'>Betrag in €</th></tr>";
		$.post(api+"stromkonto/0x19BF166624F485f191d82900a5B7bc22Be569895/history/"+account+"/1000?token="+token,{},function(data) {
			data=JSON.parse(data);
			data.reverse();
			$.each(data,function(i,render) {
					var dir="";
					var val=render.value;
					var acc="";
					if(render.to.toLowerCase()==account.toLowerCase()) { dir="von"; acc=render.from; } else { dir= "an";  acc=render.to;val*=-1;}
					html+="<tr><td>#"+render.blockNumber+"</td><td>"+dir+" <span title='"+acc+"'>"+accountLabel(acc)+"</span></td><td align='right'>"+valueDisplay(val)+" €</td></tr>";
			});
			if(data.length==0) {
					html+="<tr><td colspan='3'><em>Noch keine Buchungen vorhanden.</em></td></tr>";
			}
			$('#history').html(html);
			$('#history').addClass('table-striped');
		});					
}

function renderAddress	() { 
		$.post(api+"info/"+$('#email').val()+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				account=data;			
				$('.account').attr('title',data);					
				$('.account').html(accountLabel(data));
				updateBalance();
				updateHistory();
				getConnection();
		});
}

function app() {
	renderAddress();
	$('#dsp_account').show();
	$('#dsp_email').html($('#email').val());
	$('#app').show();
	
}

$('#login').click(function() {
	var email=$('#email').val();
	var password=$('#pwd').val();
	if($('#registrieren').is(":visible")) {
			if(password!=$('#pwd2').val()) {
				$('#loginAlert').html("<strong>Passwörter unterschiedlich</strong>, bitte probieren Sie es erneut.");
				return;
			}
	}
	$.post( api+"auth",{extid:email,secret:password},function( data ) {
		data = JSON.parse(data);		
		if(data.state=="create") {
			$('#anmelden').hide();
			$('#registrieren').show();
			$('#pwd').attr('disabled','disabled');
			$('#loginAlert').html("<strong>Stromkonto nicht gefunden</strong>, bitte Passwort bestätigen, um die Registrierung eines neuen Kontos einzuleiten.");
			$('#loginAlert').show();			
		} else {
			auth=data.auth;
			token=data.token;
			if(data.auth=="demo") {
				$('#loginAlert').html("<strong>Passwort ungültig</strong>, bitte erneut probieren, oder im DEMO-Modus fortfahren.");
				$('#loginAlert').show();
				$('#demo').show();			
			} else {				
				$('#loginFrm').hide();
				app();
			}	

		}
	});	
});
$('#demo').click(function() { $('#loginFrm').hide(); $('#app').show(); app();});

