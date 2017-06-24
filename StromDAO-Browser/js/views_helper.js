document.node= new document.StromDAOBO.Node({external_id:$('#extid').val(),testMode:true});
node = document.node;

args = f => f.toString ().replace (/[\r\n\s]+/g, ' ').
              match (/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/).
              slice (1,3).
              join ('').
              split (/\s*,\s*/);
              
function introspect(o) {

names=Object.getOwnPropertyNames(o);
	
var html="";

for(var i=0;i<names.length;i++) {	
	if((names[i]!="obj")&&(names[i]!="test")) {
		var x= Object.getOwnPropertyDescriptor(o,names[i]);	
		html+="<h2>"+names[i]+"</h2>";
		html+='<div class="form-group">';
		a=args(x.value);
		for(var j=0;j<a.length;j++) {
			html+='<label for="'+names[i]+'_'+j+'">'+a[j]+"</label>";
			html+='<input type="text" class="form-control" id="'+names[i]+'_'+j+'" >';
			html+="<br/>&nbsp;";
		}
		html+='<div class="panel panel-default" id="pnl_'+names[i]+'" style="display:none">';
		html+='<div class="panel-body"><div id="ret_'+names[i]+'"></div>';    
		html+='</div>';
		html+='</div>';

		html+="<br/><button id='execute_"+names[i]+"' data-fn='"+names[i]+"' data-arg-cnt='"+a.length+"' class='btn btn-danger execution'>execute</button>";
		html+="</div><hr/>";
	}
}
document.introspected=o;

document.renderX=function() {

		//$('#'+document.xname).html(document.xhtml);
}


$('#intro').html(html);
$('.execution').on('click',function(a,b) {
	$(a.currentTarget).attr('disabled','disabled');
	var fname=$(a.currentTarget).attr('data-fn');	
	var fcnt=$(a.currentTarget).attr('data-arg-cnt');
	console.log(fname,fcnt);
	args = [];
	for(var i=0;i<fcnt;i++) {
		args.push($("#"+fname+"_"+i).val());		
	}	
	var context=document.getElementById("ret_"+fname);
	console.log(args);
	document.introspected[fname].apply(window,args).then(function (x) {
			$('#pnl_'+fname).show();
			$(a.currentTarget).removeAttr('disabled');
			var html="<ul>";
			if(typeof x == "object") {
			for (var property in x) {
			 if(isNaN(property)) {
			  html += '<li><strong>'+property + '</strong>: ' + x[property]+'</li>';
				}
			}	
			html+="</ul>";	
			} else {html=x;}
			context.innerHTML=html;
			
							
	});
});
}

function populateObject() {
	names=Object.getOwnPropertyNames(node);
	var html="";
	for(var i=0;i<names.length;i++) {
			if(names[i].indexOf('_')) {
			html+="<li>";
			html+="<a href='#' class='csel' data-class='"+names[i]+"'>"+names[i]+"</a>";
			html+="</li>";
		}
	}
	$('#classSelector').html(html);
	$('.csel').on('click',function(a,b) {
			c=$(a.currentTarget).attr("data-class");
			$('#cname').html(c);
			cargs=[];
			if($('#entity_contract').val().length==42) {
				cargs.push($('#entity_contract').val());
			}
			node[c].apply(window,cargs).then(function(x) {
					introspect(x);
			});
		
	});

}
populateObject();
$('#account').html(node.wallet.address);
