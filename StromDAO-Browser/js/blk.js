var node = document.node;

if (typeof web3 !== 'undefined') {

}
var mapping=[];
$('#load_exid').click(function() {
	document.node= new document.StromDAOBO.Node({external_id:$('#extid').val(),testMode:true,rpc:"http://localhost:8540"});
	node = document.node;
	var cadr=node.storage.getItemSync("myblk_"+$('#extid').val());
	console.log("CADR",cadr);
	if(cadr!=null) {
		$('#contract_address').val(cadr);
		withContract();
	} else {
		document.node.directbalancinggroupfactory().then(function(factory) {
		    	console.log(factory.obj.abi);
				var blg_web3_sc = web3.eth.contract(factory.obj.abi);
				var blg_web3 = blg_web3_sc.at("0x0a57238F15BC6b055C60A237d45d4C5EeA516E63");
				blg_web3.build( {from:node.wallet.address,value:"0x0",gasPrice:"0x0",gas:9997819},function(a,b) {					
						//node.storage.setItemSync("blk_"+$('#extid').val(),cadr);
						//$('#contract_address').val(cadr);
						//withContract();
						console.log(a,b);
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
	node.storage.setItemSync("blk_"+node.options.external_id,$('#contract_address').val());
	withContract();
});

if(window.localStorage.getItem("blk_"+node.options.external_id)!=null) {
		$('#contract_address').val(window.localStorage.getItem("blk_"+node.options.external_id));
}
function addFeedin() {
	var mp="";
	if($('#via_address').val().length>0) {
			mp=$('#via_address').val();
	} else {
			mp=$('#selmp').val();
	}
	$('#add_feedin').attr('disabled','disabled');
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.addFeedIn(mp,mp,$('#in_cpe').val(),$('#in_cpd').val()).then(function(o) {
			$('#add_feedin').removeAttr('disabled');
			withContract();
		});
	});
}
$('#add_feedin').click( function() {
	addFeedin();
});
function addFeedout() {
	var mp="";
	if($('#via_address').val().length>0) {
			mp=$('#via_address').val();
	} else {
			mp=$('#selmp').val();
	}
	$('#add_feedout').attr('disabled','disabled');
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.addFeedOut(mp,mp,$('#in_cpe').val(),$('#in_cpd').val()).then(function(o) {
			 $('#add_feedout').removeAttr('disabled');
			 withContract();
		});
	});
}
$('#add_feedout').click( function() {
	addFeedout();
});

function doCharge() {
	$('#charge').attr('disabled','disabled');
	/*
	node.blg($('#contract_address').val()).then(function(blg) {
		blg.charge().then(function(o) {
			
		});
	});
	*/
	var abi=document.blg.obj.abi;
	var blg_web3_sc = web3.eth.contract(abi);
	var blg_web3 = blg_web3_sc.at($('#contract_address').val());
	blg_web3.charge( {from:node.wallet.address,value:"0x0",gasPrice:"0x0",gas:"5499819"},function(a,b) {
		console.log("done",a,b);
	 $('#charge').removeAttr('disabled');
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

function renderConnection(o) {
	blg=document.blg;	
	node=document.node;
	$('#connections').append("<tr><td id='from_"+o+"'></td><td id='to_"+o+"'></td><td id='cpd_"+o+"'></td><td id='cpe_"+o+"'></td></tr>");
	node.directconnection(o).then(function(dcon) {	
			console.log(dcon);
			dcon.from().then( function(from) {
					$('#from_'+o).html("<a href='./mpr.html?c="+from+"'>"+document.node._label(from)+"</a>");
			});
			dcon.to().then(function(to) {
					$('#to_'+o).html("<a href='./mpr.html?c="+to+"'>"+document.node._label(to)+"</a>");
			});
			dcon.cost_per_day().then( function(cpd) {					
					$('#cpd_'+o).html(cpd);
			});
			dcon.cost_per_energy().then(function(cpe) {					
					$('#cpe_'+o).html(cpe);
			});			
	});			
}
function getFeedIns(idx) {
	if(typeof idx =="undefined") idx=0;
	blg=document.blg;	
	node=document.node;
	try {
	blg.feedIn(idx).then(function(o) {	
			renderConnection(o);	
			idx++;
			getFeedIns(idx);
	});	
	} catch(e) {}
}
function getFeedOuts(idx) {
	if(typeof idx =="undefined") idx=0;
	blg=document.blg;	
	node=document.node;
	try {
	blg.feedOut(idx).then(function(o) {	
			renderConnection(o);	
			idx++;
			getFeedOuts(idx);
	});	
	} catch(e) {}
}
function withContract() {
	$('#connections').html("<tr><th>From</th><th>To</th><th>Cost per Day</th><th>Cost Per Energy</th></tr>");
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
		
		getMeterPointList().then( function(meter_points) {
			var html="";
			for (var k in meter_points){
				if (meter_points.hasOwnProperty(k)) {
					 html+="<option value='"+k+"'>"+document.node._label(k)+"</option>";	
				}
			}			
			$("#selmp").html(html);
		});
		getFeedIns();
		getFeedOuts();
	});
}
getMeterPointList=function() {
	var p2 = new Promise(function(resolve2, reject2) { 
		web3.eth.getBlock("latest",function(e,o) {		
					lastblock=o.number
					toBlock=lastblock;
					fromBlock=lastblock-500;
					if(fromBlock<0) fromBlock=0;
					node.wallet.provider.getLogs({address:"0x0000000000000000000000000000000000000008",fromBlock:fromBlock,toBlock:toBlock}).then(
						function(logs) {
							meter_points=[];
							for(var i=0;i<logs.length;i++) {
									var data = logs[i].data;
									if(data.length>64) {
										data=data.substr(2);
										_meter_point ="0x"+ split64(data).substr(26);
										data=data.substr(64);
										_power =web3.toDecimal("0x"+split64(data).substr(26));	
										meter_points[""+_meter_point]=_power;							
										
									}
							}
							resolve2(meter_points);
						}
					);
				});
	});
	return p2;
}
$('#selmp').on('change',function() {
	$('#via_address').val($('#selmp').val());
});
var c=getParameterByName("c");

if((typeof c != "undefined")&&(c.length>40)) { $('#contract_address').val(c); }

//withContract();
