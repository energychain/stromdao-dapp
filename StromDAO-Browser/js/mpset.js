var node = document.node;

if (typeof web3 !== 'undefined') {

}
var mapping=[];

function getParameterByName( name ){
   var regexS = "[\\?&]"+name+"=([^&#]*)", 
  regex = new RegExp( regexS ),
  results = regex.exec( window.location.search );
  if( results == null ){
    return "";
  } else{
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}


function uiRefresh() {
	web3.net.getPeerCount(function(e,o) {
		$('.peerCount').html(o);
	});
	web3.eth.getBlock("latest",function(e,o) {		
		$('.lastBlock').html(o.number);	
	});
	
}

function renderMeterPoint(idx) {	
document.mpset.meterpoints(idx).then(function(mp) {
		var html="";
		html+="<tr>";
		html+="<td class='account' data-account='"+mp+"'>"+document.node._label(mp)+"</td>";
		html+="<td id='power_"+mp+"' align='right'></td>";
		html+="<td id='delta_"+mp+"' align='left'></td>";
		html+="<td id='time_"+mp+"' align='right'></td>";	
		html+="</tr>";
		$('#mptable').append(html);
		document.mpr.readings(mp).then(function(reading) {
			$('#power_'+mp).html(reading.power.toString());
			$('#delta_'+mp).html('<span class="label label-default" id="powerd_'+mp+'"></span>');
			$('#power_'+mp).attr('data-reading',reading.power.toString());
			$('#time_'+mp).html(new Date(reading.time.toString()*1000).toLocaleString());	
			if(document.node.storage.getItemSync("mprset")) {			
				document.node.mprset(document.node.storage.getItemSync("mprset")).then(function(mprset) {
						mprset.mpr(mp).then(function(o) {		
								if(o.toString()>0) {
								$('#powerd_'+mp).html("+"+($('#power_'+mp).attr('data-reading')-o.toString()));
								}
						});
						
					
				});
				// TODO: Add MPRSet to BO
			}		
		});
		
		$('.account').click(function(a,b) {
							
		$('.account').unbind('click');
		$(a.currentTarget).html("<input type='text' class='form-control adr_edit' value='"+$(a.currentTarget).html()+"' data-account='"+$(a.currentTarget).attr("data-account")+"'>");
		$('.adr_edit').on('keyup',function(a,b) {
			if(a.key=="Enter") {									
				document.node._saveLabel($(a.currentTarget).val(),$(a.currentTarget).attr('data-account'));
				//location.reload();
			}
			});		
		});
		
		idx++;
		renderMeterPoint(idx);	
});
	
}

function renderMeterPoints() {
	document.node.storage.setItemSync("mpset",$('#contract_address').val());
	var html="";
	html+="<table id='mptable' class='table table-striped'>";
	html+="<tr><th>Address</th><th style='text-align:right'>Reading</th><th>&nbsp;</th><th style='text-align:right'>Time</th></tr>";
	html+="</table>";
	$('#appcontent').html(html);
	document.node.mpr(document.node.options.defaultReading).then(function(mpr) {
		document.mpr=mpr;
		renderMeterPoint(0);
		$('#withContract').show();
	});
}
$('#add_mp').click(function() {
	$('#add_mp').attr('disabled','disabled');
	document.mpset.addMeterPoint($('#mp_address').val()).then(function(O) {
		location.reload();
	});
});
$('#load_contract').click(function() {
	document.node.mpset($('#contract_address').val()).then(function(mpset) {
			document.mpset=mpset;
			renderMeterPoints();
	});		
});
$('#new_contract').click(function() {
	$('#new_contract').attr('disabled','disabled');
	document.node.mprsetfactory().then(function(mpsetf) {
			mpsetf.build().then(function(mpset) {
					$('#contract_address').val(mpset);
					document.mpset=mpset;
					renderMeterPoints();
				});			
	});
		
})
$('#settle').click(function() {	
	var previous=document.node.storage.getItemSync("mprset");
	document.node.mprdecoratefactory().then(function(decf) {
			decf.build($('#contract_address').val(),previous,$('#settle').attr('data-address')).then(function(deco) {
				document.node.storage.setItemSync("decorator",deco);
				document.node.storage.setItemSync("mprset",$('#settle').attr('data-address'));	
				location.href="./settlement.html?a="+$('#settle').attr('data-address')+"&b="+deco;
			});
	});
	
});
$('#create_snapshot').click(function() {
		$('#create_snapshot').attr("disabled","disabled");
		document.node.mprsetfactory().then(function(mprsf) {
				mprsf.build($('#contract_address').val(),document.node.options.defaultReading).then(function(o) {	
						if(document.node.storage.getItemSync("mprset")) {
							$('#settle').attr('data-address',o);
							$('#settle').show();
						}												
				});			
		});
});
if(getParameterByName("a")) {
	$('#contract_address').val(getParameterByName("a"));
} else {
		if(document.node.storage.getItemSync("mpset")) {
			$('#contract_address').val(document.node.storage.getItemSync("mpset"));
		}
}
setInterval("uiRefresh();",5000);
uiRefresh();
