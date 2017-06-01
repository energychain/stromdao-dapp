account="0x83F8B15eb816284ddcF2ff005Db7a19196d86ae1";
blk="0x3c08F0a2383C76C730844A64E45429991Fbc2bF8";
address_stromkonto="";
document.balancesheets=[];

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
	if(typeof web3 != "undefined") { 
		web3.net.getPeerCount(function(e,o) {
			$('.peerCount').html(o);
		});
		web3.eth.getBlock("latest",function(e,o) {		
			$('.lastBlock').html(o.number);	
		});
	}
}

function loadBalancesheets(idx,cb) {
	console.log("Loading balance",idx,document.blcnt,document.tobl);
	idx--;
	tobl=document.blcnt-7;
	if(typeof document.tobl != "undefined") {
		tobl=document.tobl;	
	}
	if(idx<0) cb(); else {
	if(idx<tobl)  { 
		loadBalancesheets(idx,cb);
	} else {	
		if((document.blcnt-idx)<document.balancesheets.length+1) loadBalancesheets(idx,cb); else {
			node.blg(blk).then(function(blg) {
				blg.balancesheets(idx).then(function(a,b) {							
					node.stromkonto(a.balanceIn).then(
						function(stromkontoIn) {

								node.stromkonto(a.balanceOut).then(function(stromkontoOut) {
										stromkontoOut.balancesSoll(account).then(function(outSoll) {
											bl = { balanceIn:a.balanceIn, balanceOut:a.balanceOut,blockNumber:(a.blockNumber.toString()*1),stromkontoIn:stromkontoOut,stromkontoOut:stromkontoOut,txSoll:outSoll };
											document.balancesheets.push(bl);
											loadBalancesheets(idx,cb)							
										});
								});
							
					});								
				});
			});
		}
	}
	}
}

function balanceInInfo(bin,bbl,sumBase,sumTx,bl) {
document.node.wallet.provider.getLogs({address:bin,fromBlock:bbl-10,toBlock:bbl}).then(
	function(logs) {			
			var html="";
			total=0;
			for(var i=0;i<logs.length;i++) {
				var data = logs[i].data;
				if(data.length>256) {	
					html="";										
					data=data.substr(2);
					_from ="0x"+ split64(data).substr(26);
					data=data.substr(64);
					_to ="0x"+split64(data).substr(26);
					data=data.substr(64);												
					_value =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_base =node._utils.bigNumberify(split64(data)).toNumber();
					console.log(_base);
					data=data.substr(64);
					_fromSoll =node._utils.bigNumberify(split64(data));
					data=data.substr(64);
					_fromHaben =node._utils.bigNumberify(split64(data));
					data=data.substr(64);
					_toSoll =node._utils.bigNumberify(split64(data));
					data=data.substr(64);
					_toHaben =node._utils.bigNumberify(split64(data));
					data=data.substr(64);
					portion=1;
					total+=_base;
		
										
				}
			}
			for(var i=0;i<logs.length;i++) {
				var data = logs[i].data;
				if(data.length>256) {	
					html="";										
					data=data.substr(2);
					_from ="0x"+ split64(data).substr(26);
					data=data.substr(64);
					_to ="0x"+split64(data).substr(26);
					data=data.substr(64);												
					_value =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_base =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_fromSoll =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_fromHaben =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_toSoll =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					_toHaben =node._utils.bigNumberify(split64(data)).toNumber();
					data=data.substr(64);
					portion=_base/total;
					benergy=Math.round(bl.txSoll/(sumTx/sumBase)*100)/100;
					console.log("BENERGY",benergy);
					html+="<tr><td class='"+_to+" bl_"+bl.blockNumber+" account' data-account='"+_to+"'>"+document.node._label(_to)+"</td><td align='right' title='"+(portion*benergy)+"'>-"+(1*(bl.txSoll*portion).money()).mcurrency()+"</td><td align='right'>"+Math.round(portion*1000)/10+"%</tr>";
					$('#txbl_'+bbl).append(html);	
					$('.price_'+bl.blockNumber).html(((sumTx/sumBase)/100000).toFixed(4));
					$('.energy_'+bl.blockNumber).html((bl.txSoll/(sumTx/sumBase)));
					$('.account').unbind('click');
					$('.account').click(function(a,b) {
						
							$('.account').unbind('click');
							$(a.currentTarget).html("<input type='text' class='form-control adr_edit' value='"+$(a.currentTarget).html()+"' data-account='"+$(a.currentTarget).attr("data-account")+"'>");
							$('.adr_edit').on('keyup',function(a,b) {
								if(a.key=="Enter") {									
									node._saveLabel($(a.currentTarget).val(),$(a.currentTarget).attr('data-account'));
									location.reload();
								}
							});
					});
					if(typeof document.summary == "undefined") {
						document.summary = [];
					}
					if(typeof document.summary[""+_to]== "undefined") {
						document.summary[""+_to]={sumBase:(benergy*portion),sumTx:portion*(bl.txSoll*portion)}
					} else {
						document.summary[""+_to].sumBase+=benergy*portion;
						document.summary[""+_to].sumTx+=1*(bl.txSoll*portion);						
					}
					renderSummary();
				}
			}	
			//$('#txbl_'+bbl).append("<tr><th>Total Energy</th><th>-"+_base+"</td></tr>");
	});
}

function renderSummary() {
	
var html="";
html+="<table class='table table-striped'><tr><th>From/To</th><th style='text-align:right'>Total Energy</th><th style='text-align:right'>Total Cost</th></tr>";
for (var k in document.summary){
    if (document.summary.hasOwnProperty(k)) {
		html+="<tr><td class='account' data-account='"+k+"'>"+document.node._label(k)+"</td><td align='right'>"+(1*document.summary[k].sumBase).round()+"</td><td align='right'>"+(1*document.summary[k].sumTx.money()).mcurrency()+"</td></tr>";         
    }
}
html+="</table>";	
$('#summary').html(html);
$('.account').unbind('click');
					$('.account').click(function(a,b) {
						
							$('.account').unbind('click');
							$(a.currentTarget).html("<input type='text' class='form-control adr_edit' value='"+$(a.currentTarget).html()+"' data-account='"+$(a.currentTarget).attr("data-account")+"'>");
							$('.adr_edit').on('keyup',function(a,b) {
								if(a.key=="Enter") {									
									node._saveLabel($(a.currentTarget).val(),$(a.currentTarget).attr('data-account'));
									location.reload();
								}
							});
					});
}
function getBlockTime(blockNumber,bl) {		
	if(typeof web3 != "undefined") {
		web3.eth.getBlock(blockNumber, function(error, result){
			if(!error) {
						d=new Date(result.timestamp*1000);					
						$('.ts_'+blockNumber).html("#"+blockNumber+"<br/>"+d.toLocaleString());
						if(typeof cb != "undefined") cb();
			}	else {console.log(error);}		
		});
	}
	
	$("#blk_"+blockNumber).html("<table class='table table-condensed' id='txbl_"+blockNumber+"' width='100%' ><tr><th width='33%'>Source</th><th style='text-align:right' width='33%'>Value</th><th style='text-align:right'>%</tr></table>");	
			
	bl.stromkontoIn.sumTx().then(function(sumTx) {
							if(sumTx==0) return;
						
							bl.stromkontoIn.sumBase().then(function(sumBase) {
								balanceInInfo(""+bl.balanceIn,bl.blockNumber,sumBase,sumTx,bl);									
							});
							//setTimeout("balanceInInfo('"+bl.balanceIn+"',"+bl.blockNumber+","+sumBase+","+obj.base+");",500);											
					});
};

function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}

function afterInit() {
	if(getParameterByName("a")) {account=getParameterByName("a");}	
	$('.account').html(document.node._label(account));
	$('.account').attr("data-account",account);
	$('.account').unbind('click');
	$('.account').click(function(a,b) {
		
			$('.account').unbind('click');
			$(a.currentTarget).html("<input type='text' class='form-control adr_edit' value='"+$(a.currentTarget).html()+"' data-account='"+$(a.currentTarget).attr("data-account")+"'>");
			$('.adr_edit').on('keyup',function(a,b) {
				if(a.key=="Enter") {									
					node._saveLabel($(a.currentTarget).val(),$(a.currentTarget).attr('data-account'));
					location.reload();
				}
			});
	});
	uiRefresh();
	setInterval(uiRefresh,5000);
	$('#txLog').empty();
	node = document.node;
	
	node.blg(blk).then(function(blk) {
				blk.stromkontoDelta().then(function(stromkontoDelta) {
						
						node.stromkonto(stromkontoDelta).then(function(stromkonto) {
								stromkonto.balancesSoll(account).then( function(value) {
									$('.soll').html((1*value.money()).mcurrency());
									document.soll=value;
									document.saldo=document.haben-document.soll;
									$('.saldo').html(($('.haben').html()-$('.soll').html()));
								});
								stromkonto.balancesHaben(account).then( function(value) {
									$('.haben').html((value.money()*1).mcurrency());
									document.haben=value;
									document.saldo=document.haben-document.soll;
									$('.saldo').html($('.haben').html()-$('.soll').html());
									
									blk.balancesheets_cnt().then(function(o) {
											document.blcnt=o*1;
											if(typeof document.tobl=="undefined") {
												document.tobl=document.blcnt-3;
											}
											loadBalancesheets(o*1,function() {
												updateLogs();
											 });
										});									
									
								});
								
						});
						address_stromkonto=stromkontoDelta;
						
				});		
	});
}


function updateLogs(fromBlock) {
	document.summary = [];	
	bs=document.balancesheets;
	//bs=bs.reverse();
	var html="<table class='table table-striped'>"
	html+="<tr><th>Settlement</th><th>From/To</th><th style='text-align:right'></th><th style='text-align:right'>Energy</th><th style='text-align:right'>Price</th><th style='text-align:right'>Value</th><th style='text-align:right'>Balance</th></tr>";
	saldo=document.saldo;
	for(var i=0;i<bs.length;i++) {		
		html+="<tr>";
		html+="<td class='ts_"+bs[i].blockNumber+"'>"+bs[i].blockNumber+"</td>";
		html+="<td id='blk_"+bs[i].blockNumber+"'>TBD</td>"																		
		html+="<td align='right'></td>";
		
		// "+((_value*1)/(_base*1))+"
		html+="<td align='right' class='energy_"+bs[i].blockNumber+"'>TBD</td>";
		html+="<td align='right' class='price_"+bs[i].blockNumber+"'>TBD</td>";
		html+="<td align='right'>-"+(1*(bs[i].txSoll*1).money()).mcurrency()+"</td>";
		html+="<td align='right'>"+(1*(saldo*1).money()).mcurrency()+"</td>";		
		html+="</tr>";
		saldo+=bs[i].txSoll;
	}
	html+="<tr class='hidden-print'><td colspan=6><a href='#' onclick='document.tobl-=7;afterInit();' class='btn btn-primary'>more</a></tr>";
	html+="</table>";
	$('#txLog').html(html);	
	for(var i=0;i<bs.length;i++) {	
		getBlockTime(bs[i].blockNumber,bs[i]);
	}

}

afterInit();
