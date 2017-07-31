var api="http://localhost:3000/api/";
var coldAPI=api+"cold/";
var priceAPI="https://demo.stromdao.de/prices/";

var api="https://demo.stromdao.de/api/";
var coldAPI=api+"cold/";
var priceAPI="https://demo.stromdao.de/prices/";

var token="";
var auth="";
var account="";
var tarif="";
var meterpoint="";
var smpcf="";
var stromkontoproxy="";
var names=[];
var tarifConditions=[];
var consensWiz=false;
var provider_ap="";
var provider_gp="";

$.ajaxSetup({
  timeout: 25000
});

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
	if(typeof names[address] == "undefined") {
		$.get(api+"roleLookup/0x0000000000000000000000000000000000000006/getName/"+address+"/?token="+token,{},function(data) {				
			data=JSON.parse(data);
			names[address]=data;
			$('.'+address).html(data);
		});
		return address.substr(0,10)+"...";
	} else {
		return names[address];
	}
	
}

function renderAddress	() { 
		$.post(api+"info/"+$('#email').val()+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				account=data;			
				$('.account').attr('title',data);					
				$('.account').html(accountLabel(data));
				ensureSkoP();
		});
}

$('#activate').click(function(){
	$.post(api+"singleclearing/"+$('#smpc').val()+"/activate//?token="+token,{},function(data) {			
		dspSMPC();	
	}); 
});
$('#deactivate').click(function(){
	$.post(api+"singleclearing/"+$('#smpc').val()+"/deactivate//?token="+token,{},function(data) {			
		dspSMPC();	
	}); 
});
function dspSMPC() {
	$('#opensmpc').attr('disabled','disabled');
	$.post(api+"singleclearing/"+$('#smpc').val()+"/energyCost/?token="+token,{},function(data) {							
								$('.ap').html((JSON.parse(data)/10000000).toLocaleString());
								$('.ap').attr('data',JSON.parse(data));								
								$('#smpcInfo').show();
	});
	$.post(api+"singleclearing/"+$('#smpc').val()+"/owner/?token="+token,{},function(data) {							
								$('#smpcOwner').html(JSON.parse(data));
								$('#smpcOwner').attr('data',JSON.parse(data));																
	});
	$.get(api+"singleclearing/"+$('#smpc').val()+"/meterpoint/?token="+token,{},function(data) {	
			meterpoint = JSON.parse(data);
			$('#mpid').val(meterpoint);
			$.post(api+"mpr/0x0/readings/"+meterpoint+"/?token="+token,{},function(data) {
						data = JSON.parse(data);
						$('#readingtime').val(new Date(parseInt(data.time._bn,16)*1000).toLocaleString());
						$('#readingpower').val(parseInt(data.power._bn,16));
						$('#readingtime').attr('disabled','disabled');
						$('#readingpower').attr('disabled','disabled');
						$('.meterInfo').show();
			});
			$('#asignmeter').click( function() {
				$('#asignmeter').attr('disabled','disabled');
				$.post(api+"singleclearing/"+$('#smpc').val()+"/setMeterPoint/"+$('#mpid').val()+"/?token="+token,{},function(data) {
					
					
				});
			}) 
	});
	$.post(api+"singleclearing/"+$('#smpc').val()+"/state/?token="+token,{},function(data) {
								var state=JSON.parse(data)*1;
								var status="unbekannt";
								if(state==0) status="Warten auf Zuordnung";
								if(state==1) {
									status="In Bearbeitung";
									$('#activate').show();
									$('#deactivate').hide();
									$('#addShareHolder').click(function() {
										$('#addShareHolder').attr('disabled','disabled');
										// Stromsteuer
										$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0x389d9b105de68Ae30F640e7A6e98cA716A9eF966/2050/?token="+token,{},function(data) {
											// UST 19
											$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0xb9E709A3dCfBD571afe0098c7292D420A16C057A/"+Math.round(($('.ap').attr('data')*1)-(($('.ap').attr('data')*1)/1.19))+"/?token="+token,{},function(data) {
												$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0xd859A0bB5D1eB191942045c5c1C64A51C780E0F6/410/?token="+token,{},function(data) {
													$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0x3f371CB09ac4D455c4649AE7E8ef1aba8F1C3161/6880/?token="+token,{},function(data) {
														// Konzessionsabgabe											
														$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0xa447C0A8f77d95Dd0486cbB2A0Dc664A46AeaaB7/1660/?token="+token,{},function(data) {												
															$.post(api+"singleclearing/"+$('#smpc').val()+"/setAccount/0xC7E6D42c77A801A2c89ED695d0557478B7800189/410/?token="+token,{},function(data) {});															
														});	
														// §19 Umlage
														
										});		
												});				
											});																						
											// KWK Umlage
											
										});
										// EEG Umlage 2017
													
									});
									$('#asignmeter').show();
								}
								if(state==2) { 
									status="In Belieferung";
									$('#activate').hide();
									$('#deactivate').show();
									$.post(api+"singleclearing/"+$('#smpc').val()+"/clearing/?token="+token,{},function(data) {
												
									});
									$('#asignmeter').hide();
								}
								if(state==0) { 
									$('#assign').show(); 
									$('#assign').removeAttr('disabled');
									$('#assign').click(function() {
										$('#assign').attr('disabled','disabled');
										$.post(api+"singleclearing/"+$('#smpc').val()+"/becomeProvider/"+stromkontoproxy+"/?token="+token,{},function(data) {
												$.post(api+"stromkontoproxy/"+stromkontoproxy+"/modifySender/"+$('#smpc').val()+"/?token="+token,{},function(data) {
													dspSMPC();
												});
										});										
									});
									} else { $('#assign').hide();}
								$('.state_ap').html(status);	
								$('#costSplit').show();						
	});
}
$('#opensmpc').click( function() {
	dspSMPC();
});

function updateBalance() {
		$.post(api+"stromkonto/"+stromkontoproxy+"/balancesHaben/"+account+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				$('.haben').attr('data',data);
				$('.haben').html(valueDiv(data).toLocaleString(undefined,{minimumFractionDigits: 2,  maximumFractionDigits: 2}));				
				var saldo=1*$('.haben').attr('data')-1*$('.soll').attr('data');
				$('.saldo').html(valueDisplay(saldo));
		});
		$.post(api+"stromkonto/"+stromkontoproxy+"/balancesSoll/"+account+"?token="+token,{},function(data) {				
				data=JSON.parse(data);
				$('.soll').attr('data',data);
				$('.soll').html(valueDiv(data).toLocaleString(undefined,{minimumFractionDigits: 2,  maximumFractionDigits: 2}));				
				var saldo=1*$('.haben').attr('data')-1*$('.soll').attr('data')
				$('.saldo').html(valueDisplay(saldo));
		});
}
function ensureSkoP() {
	$.get(api+"roleLookup/0x0000000000000000000000000000000000000006/relations/"+account+"/10?token="+token,{},function(data) {				
		data=JSON.parse(data);
		if((data=="0x0000000000000000000000000000000000000000")||(data==account)) {
			$.get(api+"stromkontoproxyfactory/0x0/build/?token="+token,{},function(data) {
				data=JSON.parse(data);
				stromkontoproxy=data;
				$.get(api+"roleLookup/0x0000000000000000000000000000000000000006/setRelation/10/"+stromkontoproxy+"?token="+token,{},function(data) {	
					updateBalance();
				});	
			});	
		} else {			
			stromkontoproxy=data;
			updateBalance();
		}
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

