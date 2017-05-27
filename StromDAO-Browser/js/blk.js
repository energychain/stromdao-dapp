var node = document.node;

if (typeof web3 !== 'undefined') {

}
var mapping=[];
$('#load_exid').click(function() {
	document.node= new document.StromDAOBO.Node({external_id:$('#extid').val(),testMode:true,rpc:"http://localhost:8540"});
	node = document.node;
	var cadr=node.storage.getItemSync("blk_"+$('#extid').val());
	console.log("CADR",cadr);
	if(cadr!=null) {
		$('#contract_address').val(cadr);
		withContract();
	} else {
			node.directbalancinggroupfactory().then(function(factory) {
					factory.build().then(function(cadr) {
						node.storage.setItemSync("blk_"+$('#extid').val(),cadr);
						$('#contract_address').val(cadr);
						withContract();
					});
			});
	}
	 
});

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
						function getBlockTime(blockNumber) {
						web3.eth.getBlock(blockNumber, function(error, result){
							if(!error) {
										d=new Date(result.timestamp*1000);
										$('.ts_'+blockNumber).html(d.toLocaleString());
										
							}			
						})};
function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}


function afterInit() {
	uiRefresh();
	setInterval(uiRefresh,5000);
}
afterInit();


$('#load_contract').click( function() {
	withContract();
});

function addFeedin() {
	/*
	var blg_web3_sc = web3.eth.contract(document.blg.obj.abi);
	var blg_web3 = blg_web3_sc.at($('#contract_address').val());
	blg_web3.addFeedIn($('#in_account').val(),$('#in_mp').val(),$('#in_cpe').val(),$('#in_cpd').val(),function() {$('#in_account').val();});
*/
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.addFeedIn($('#in_account').val(),$('#in_mp').val(),$('#in_cpe').val(),$('#in_cpd').val()).then(function(o) {
			 $('#in_account').val("");
		});
	});
}
$('#add_feedin').click( function() {
	addFeedin();
});
function addFeedout() {
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.addFeedOut($('#out_account').val(),$('#out_mp').val(),$('#out_cpe').val(),$('#out_cpd').val()).then(function(o) {
			 $('#out_account').val("");
		});
	});
}
$('#add_feedout').click( function() {
	addFeedout();
});

function doCharge() {
	$('#charge').attr('disabled','disabled');
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.charge().then(function(o) {
			 $('#charge').removeAttr('disabled');
		});
	});
}
$('#charge').click( function() {
	doCharge();
});

function fillBalances(cnt) {
	var blg=document.blg;	
	for(var i=cnt-1;i>=0;i--) {
		blg.balancesheets(i).then(function(a,b) {
				$('#in'+a.idx).attr('href',"./stromkonto.html?c="+a.balanceIn);				
				$('#in'+a.idx).html(document.node._label(a.balanceIn));
					document.node.stromkonto(a.balanceIn).then(function(stromkonto) {
							stromkonto.sumBase().then(function(o) {
								$('#inBase'+a.idx).html(o);
							});
							stromkonto.sumTx().then(function(o) {
								$('#inTx'+a.idx).html(o);
							});
					});
				$('#out'+a.idx).attr('href',"./stromkonto.html?c="+a.balanceOut);
				$('#out'+a.idx).html(document.node._label(a.balanceOut));
					document.node.stromkonto(a.balanceOut).then(function(stromkonto) {
							stromkonto.sumBase().then(function(o) {
								$('#outBase'+a.idx).html(o);
							});
							stromkonto.sumTx().then(function(o) {
								$('#outTx'+a.idx).html(o);
							});
					});					
			});
	}
}
function withContract() {
		node.blg($('#contract_address').val()).then( function(blg) {	
		document.blg=blg;		
		$('#hasContract').show();
		blg.stromkontoIn().then(function(o) {
				$('#stromkontoIn').attr("href","./stromkonto.html?c="+o);

		});
		blg.stromkontoDelta().then(function(o) {
				$('#stromkontoDelta').attr("href","./stromkonto.html?c="+o);

		});
		blg.stromkontoOut().then(function(o) {
				$('#stromkontoOut').attr("href","./stromkonto.html?c="+o);

		});
		blg.balancesheets_cnt().then(function(o) {				
				$('#balance_cnt').html(o.toString());
				var html="<table class='table table-striped'>";
				html+="<tr><th>Seq.</th><th>In BalanceSheet</th><th>In Energy</th><th>-Cash</th><th>Out BalanceSheet</th><th>Out Energy</th><th>+Cash</th></tr>";
				for(var i=(o.toString()*1-1);i>0;i--) {
					html+="<tr><td>#"+i+"</td>";
					html+="<td><a href='#' id='in"+i+"'></a></td>";
					html+="<td><span id='inBase"+i+"'></span></td>";
					html+="<td><span id='inTx"+i+"'></span></td>";
					html+="<td><a href='#' id='out"+i+"'></a></td>";
					html+="<td><span id='outBase"+i+"'></span></td>";
					html+="<td><span id='outTx"+i+"'></span></td>";
					html+="</tr>";
				}
				html+="</table>";
				$('#balances').html(html);
				fillBalances(o.toString()*1);
		});
		
	});
}

var c=getParameterByName("c");

if((typeof c != "undefined")&&(c.length>40)) { $('#contract_address').val(c); }

//withContract();
