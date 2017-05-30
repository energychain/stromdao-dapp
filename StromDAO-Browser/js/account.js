account="0x83F8B15eb816284ddcF2ff005Db7a19196d86ae1";
blk="0xd3bc06dd5e5D6aD87Ab37D4674be32Fa90bA4bd8";
address_stromkonto="";
document.balancesheets=[];

function uiRefresh() {
	web3.net.getPeerCount(function(e,o) {
		$('.peerCount').html(o);
	});
	web3.eth.getBlock("latest",function(e,o) {		
		$('.lastBlock').html(o.number);	
	});
	
}

function loadBalancesheets(idx,cb) {
	
	idx--;
	if(idx<0) cb();
	node.blg(blk).then(function(blg) {
				blg.balancesheets(idx).then(function(a,b) {
							
						node.stromkonto(a.balanceIn).then(function(stromkonto) {
							bl = { balanceIn:a.balanceIn, balanceOut:a.balanceOut,blockNumber:(a.blockNumber.toString()*1),stromkontoIn:stromkonto };
							document.balancesheets.push(bl);
							loadBalancesheets(idx,cb)							
						});					
						;
				});
	});
	
}

function balanceInInfo(bin,bbl,sumBase,obase) {
document.node.wallet.provider.getLogs({address:bin,fromBlock:bbl-1000,toBlock:bbl}).then(
	function(logs) {
			console.log("LOGS",logs);
			var html="";
			for(var i=0;i<logs.length;i++) {
				var data = logs[i].data;
				if(data.length>256) {											
					data=data.substr(2);
					_from ="0x"+ split64(data).substr(26);
					data=data.substr(64);
					_to ="0x"+split64(data).substr(26);
					data=data.substr(64);												
					_value =web3.toDecimal(split64(data));
					data=data.substr(64);
					_base =web3.toDecimal(split64(data));
					data=data.substr(64);
					_fromSoll =web3.toDecimal(split64(data));
					data=data.substr(64);
					_fromHaben =web3.toDecimal(split64(data));
					data=data.substr(64);
					_toSoll =web3.toDecimal(split64(data));
					data=data.substr(64);
					_toHaben =web3.toDecimal(split64(data));
					data=data.substr(64);
					html+="<tr><td>"+_to+"</td><td>"+((_base/sumBase)*obase).money()+"</td></tr>";
					$('#txbl_'+bbl).append(html);											
				}
			}	
	});
}
function getBlockTime(obj,cb) {
	
	blockNumber=obj.blockNumber;
	web3.eth.getBlock(obj.blockNumber, function(error, result){
		if(!error) {
					d=new Date(result.timestamp*1000);					
					$('.ts_'+obj.blockNumber).html("#"+obj.blockNumber+" "+d.toLocaleString());
					if(typeof cb != "undefined") cb();
		}	else {console.log(error);}		
	})
	$("#blk_"+blockNumber).html("<table class='table table-condensed' id='txbl_"+obj.blockNumber+"'><tr><th>Source</th><th>Value</th></tr></table>");	
	for(var i=0;i<document.balancesheets.length;i++) {			
			if(document.balancesheets[i].blockNumber==obj.blockNumber) {
					var bl=document.balancesheets[i];
					bl.stromkontoIn.sumBase().then(function(sumBase) {
							if(sumBase==0) return;
							console.log("sumBase",sumBase);
							setTimeout("balanceInInfo('"+bl.balanceIn+"',"+bl.blockNumber+","+sumBase+","+obj.base+");",500);
					
							//console.log("balanceInInfo('"+bl.balanceIn+"',"+bl.blockNumber+","+sumBase+","+obj.base+");");
																		
					});
			}
	}
};

function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}

function afterInit() {
	uiRefresh();
	setInterval(uiRefresh,5000);
	
	node = document.node;
	
	node.blg(blk).then(function(blk) {
				blk.stromkontoDelta().then(function(stromkontoDelta) {
						
						node.stromkonto(stromkontoDelta).then(function(stromkonto) {
								stromkonto.balancesSoll(account).then( function(value) {
									$('.soll').html(value.money());
									$('.saldo').html(($('.haben').html()-$('.soll').html()));
								});
								stromkonto.balancesHaben(account).then( function(value) {
									$('.haben').html(value.money());
									$('.saldo').html($('.haben').html()-$('.soll').html());
									
									blk.balancesheets_cnt().then(function(o) {
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

	var grep=account.toLowerCase();
	web3.eth.getBlock("latest",function(e,o) {		
			lastblock=o.number
			toBlock=lastblock;
			if((typeof fromBlock=="undefined")||(fromBlock<1)) {
					fromBlock=lastblock-500;
			}			
			if(fromBlock<0) fromBlock=0;
			
			document.node.wallet.provider.getLogs({address:address_stromkonto,fromBlock:fromBlock,toBlock:toBlock}).then(			
			function(logs) {							
					logs=logs.reverse();
					var html="<table class='table table-striped'>"
					html+="<tr><th>Settlement</th><th>From/To</th><th style='text-align:right'>Energy</th><th style='text-align:right'>Value</th><th style='text-align:right'>Balance</th></tr>";
					var inforeq=[];
					for(var i=0;i<logs.length;i++) {
							var data = logs[i].data;
							if(data.length>256) {
								data=data.substr(2);
								_from ="0x"+ split64(data).substr(26);
								data=data.substr(64);
								_to ="0x"+split64(data).substr(26);
								data=data.substr(64);
									
								_value =web3.toDecimal(split64(data));
								data=data.substr(64);
								_base =web3.toDecimal(split64(data));
								data=data.substr(64);
								_fromSoll =web3.toDecimal(split64(data));
								data=data.substr(64);
								_fromHaben =web3.toDecimal(split64(data));
								data=data.substr(64);
								_toSoll =web3.toDecimal(split64(data));
								data=data.substr(64);
								_toHaben =web3.toDecimal(split64(data));
								data=data.substr(64);
								if((_from.toLowerCase()==grep)||(_to.toLowerCase()==grep)||(grep.length<40)) {
									var blockNumber = logs[i].blockNumber;
									if(_from.toLowerCase()==grep) {
										peer=_to;
										saldo=_fromHaben-_fromSoll;
										_value="-"+_value;
									} else {
										peer=_from;
										saldo=_toHaben-_toSoll;
										_value="+"+_value;
									}
									var info={blockNumber:blockNumber,base:_base*1,value:_value*1};
									inforeq.push(info);
									
									html+="<tr>";
									html+="<td class='ts_"+blockNumber+"'>"+blockNumber+"</td>";
									html+="<td id='blk_"+blockNumber+"'>TBD</td>"																		
									html+="<td align='right'>"+_base+"</td>";
									html+="<td align='right'>"+(_value*1).money()+"</td>";
									html+="<td align='right'>"+(saldo*1).money()+"</td>";
									html+="</tr>";

								}
							}
					}
					html+="<tr><td colspan=3><a href='#' onclick='updateLogs("+(fromBlock-500)+");' class='btn btn-primary'>more</a></tr>";
					html+="</table>";
					$('#txLog').html(html);		
					for(var i=0;i<inforeq.length;i++) {						
						getBlockTime(inforeq[i]);						
					}					
		});
	});
}

afterInit();
