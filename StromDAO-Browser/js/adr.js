storage=window.localStorage;
var html="";
for (var k in storage){
	if (storage.hasOwnProperty(k)) {
		if(k.indexOf("abel_")>-1) {
		 html+="<div class='form-inline' style='margin-top:10px;'>";	
			html+="<label for='"+k+"'>"+k+"</label><br/>";
			html+="<input type='text' class='form-control' name='"+k+"'  id='"+k+"' value='"+storage[k]+"'>";
			html+="<button id='btn_"+k+"' class='btn btn-default update'>update</button>";
		 html+="</div>";
		}
	}
}		


$('#adrbook').html(html);
$('.update').click(function(o) { 
	window.localStorage.setItem('label_'+o.target.id.substr(10),$('#label_'+o.target.id.substr(10)).val());
	location.reload();
});
