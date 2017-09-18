$(document).ready(function() {
	// if user clicked on button close the dialog	
	$('a.button').click(function () {		
		$('#dialog-overlay, #dialog-box').hide();		
		return false;
	});
	
	// if user resize the window, call the same function again
	// to make sure the overlay fills the screen and dialogbox aligned to center	
	$(window).resize(function () {
		
		//only do it if the dialog box is not hidden
		if (!$('#dialog-box').is(':hidden')) popup();		
	});	
	
$.getJSON("xx.json", function(s_data){
	var table1 = document.createElement("table");
	var col = [];
	var a_data = s_data.relation;
	for (var a = 0; a < a_data.length -2 ; a++){
		var tr2 = table1.insertRow(-1);
		for (var b = 0; b < a_data.length;b++){
		 var tabCell =  tr2.insertCell(-1);
         tabCell.innerHTML = a_data[b][a];
		}
	}
 	 var divContainer1 = document.getElementById("showData1");
        divContainer1.innerHTML = "";
        divContainer1.appendChild(table1);	

});
	
	
	
//Hypotheses table Started
$.getJSON("bb.json", function(data){
  var table_hyp = data.hypotheses.table_hypotheses;
	var row_hyp = data.hypotheses.row_hypotheses;
	var cell_hyp = data.hypotheses.cell_hypotheses;
  var table = document.createElement("table");

	//for table Hypotheses
	var t_group = {};
	for (var e in table_hyp){
		var item1 =  table_hyp[e];
		 if(!t_group[e]) {
        t_group[e] = [];
    }
		if (item1.created_by_task == "table_classification"){
    	t_group[e].push({
			table_id: e,
			table_type: item1.table_type,
			source: item1.source, 
			created_by_task: item1.created_by_task
	});
		 }
		if (item1.created_by_task == "orientation_detection"){
    	t_group[e].push({
			table_id: e,
			table_orientation: item1.table_orientation,
			source: item1.source, 
			created_by_task: item1.created_by_task
	});
		 }
		if (item1.created_by_task == "language_detection"){
    	t_group[e].push({
			table_id: e,
			lang: item1.lang,
			confidence: item1.confidence,
			created_by_task: item1.created_by_task
	});
		 }
		
	}
	
	for (var f in row_hyp){
		var item1=  row_hyp[f];
		 if(!t_group[f]) {
        t_group[f] = [];
    }
		if (item1.created_by_task == "table_segmenation"){
    	t_group[f].push({
			table_id: f,
			header_row: item1.header_row,
			source: item1.source, 
			created_by_task: item1.created_by_task
	});
		 }
	}
	
	console.log(t_group)
	
	var btn3 = document.createElement("input");
	var btn4 = document.createElement("input");
	var btn5 = document.createElement("input");
	var btn6 = document.createElement("input");
	var btn7 = document.createElement("input");
	
	btn3.type = "button";
	btn3.value = "LD";
	btn3.onclick = function(){t_popup(btn3.value,t_group)}
	btn4.type = "button";
	btn4.value = "TC";
	btn4.onclick = function(){t_popup(btn4.value,t_group)}
	btn5.type = "button";
	btn5.value = "OD";
	btn5.onclick = function(){t_popup(btn5.value,t_group)}
	btn6.type = "button";
	btn6.value = "TS";
	btn6.onclick = function(){t_popup(btn6.value,t_group)}
	table.innerHTML = "Table Hypotheses buttons: ";
	table.appendChild(btn3);
	table.appendChild(btn4);
	table.appendChild(btn5);
	table.appendChild(btn6);
	
//for cell Hypotheses
  var groups = [];
	
  for (var i in cell_hyp){
    var item = cell_hyp[i];
   
    if(!groups[item.original_value]) {
        groups[item.original_value] = [];
    }
    if (item.created_by_task == "entity_linking"){
    groups[item.original_value].push({
      confidence: item.confidence,
      based_on_hypotheses: item.based_on_hypotheses,
      language: item.language,
      created_by_task: item.created_by_task,
      refers_to_column: item.refers_to_column,
      original_value: item.original_value,
      refers_to_row: item.refers_to_row 
      });
  }
     if (item.created_by_task == "table_normalization"){
      groups[item.original_value].push({
      data_type: item.data_type,
      hypothesis_count: item.hypothesis_count,
      task_id: item.task_id, 
      hypothesis_name: item.hypothesis_name, 
      based_on_hypotheses: item.based_on_hypotheses,
      created_by_task: item.created_by_task,
      refers_to_column: item.refers_to_column,
      original_value: item.original_value,
      refers_to_row: item.refers_to_row 
      });
  }
    
  }
var result = [];

for (var x in groups) {
    var obj = {};
    obj[x] = groups[x];
    result.push(obj);
}
	var tr1 = table.insertRow(0);     
	var th = document.createElement("th");   
    th.innerHTML = "original_value";
	tr1.appendChild(th);
	$.each(result, function(key1, value1){
	$.each(value1, function(key2, value2){
	var tr = table.insertRow(-1); 
	var tabCell =  tr.insertCell(-1);
	var btn = document.createElement("input");
	var btn1 = document.createElement("input");
	var btn2 = document.createElement("input");
	btn.type = "button";
	btn.value = "EL";
	btn.name = key2;
	btn.onclick = function(){popup(btn.value,btn.name, value2)}
	btn1.type = "button";
	btn1.value = "TN";
	btn1.name = key2;
	btn1.onclick = function(){popup(btn1.value, btn1.name, value2)}
	btn2.type = "button";
	btn2.value = "LL";
	btn2.onclick = function(){popup(btn2.value, btn2.name, value2)}
	tabCell.innerHTML = key2 + " ";
    tabCell.appendChild(btn);
	tabCell.appendChild(btn1);
	tabCell.appendChild(btn2);
	});
  });

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);	
});
}); //Hypotheses Table Ended.


//function for popup
function popup(val, name ,hyp){
// get the screen height and width  
	var maskHeight = $(document).height();  
	var maskWidth = $(window).width();
	
	// calculate the values for center alignment
	var dialogTop =  (maskHeight/3) - ($('#dialog-box').height());  
	var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2); 
	
	// assign values to the overlay and dialog box
$.each (hyp, function(key, value){
	var text = "";
	
	//For Entity Linking
	if (val == "EL" && value.created_by_task == "entity_linking" && name == value.original_value){
	text = "confidence: "+ value.confidence+",<br> based_on_hypotheses: "+ value.based_on_hypotheses+",<br> language: " +value.language+",<br> created_by_task: "+value.created_by_task+",<br> refers_to_column: "+value.refers_to_column+",<br> original_value: "+value.original_value+",<br> refers_to_row:" +value.refers_to_row+"<br><br>";
	if (key == 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
	}
	if(key >= 1){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
	}
}
	
//For Table Normalization
else if (val == "TN" && value.created_by_task == "table_normalization" && name == value.original_value){
	text = "data_type: "+value.data_type+",<br>hypothesis_count: "+value.hypothesis_count+",<br>task_id: "+value.task_id+",<br> hypothesis_name: "+value.hypothesis_name+",<br>based_on_hypotheses: "+value.based_on_hypotheses+",<br>created_by_task: "+ value.created_by_task+",<br>refers_to_column: "+value.refers_to_column+",<br>original_value: "+value.original_value+",<br>refers_to_row: "+value.refers_to_row+ "<br><br>"; 

if (key == 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
	}
if(key >= 1){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
}
}
//Donot have Literal Linking in our sample so not creating popup for that 

else{
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html("No Hypotheses Found!");
}
});
}


function t_popup(val, grouphyp){
	var k = 0;
	
	// get the screen height and width  
	var maskHeight = $(document).height();  
	var maskWidth = $(window).width();

	// calculate the values for center alignment
	var dialogTop =  (maskHeight/3) - ($('#dialog-box').height());  
	var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2); 
	
	$.each (grouphyp, function(t_key, t_value){
	$.each (t_value, function(t_key1, t_value1){
		if(t_value1.created_by_task == "language_detection" && val == "LD"){
		text = "table_id: " +t_value1.table_id+",<br>lang: "+t_value1.lang+",<br>confidence: "+t_value1.confidence+",<br>created_by_task: "+t_value1.created_by_task+"<br><br>";
if (k == 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
}
if (k > 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
}
			k++;
}
		if(t_value1.created_by_task == "table_segmenation" && val == "TS"){
text = "table_id: " +t_value1.table_id+",<br>source: "+t_value1.source+",<br>header_row: "+t_value1.header_row+",<br>created_by_task: "+t_value1.created_by_task+"<br><br>";
if(k==0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
}
if (k > 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
}
	k++;
}

		
		if(t_value1.created_by_task == "table_classification" && val == "TC"){
text = "table_id: " +t_value1.table_id+",<br>source: "+t_value1.source+",<br>table_type: "+t_value1.table_type+",<br>created_by_task: "+t_value1.created_by_task+"<br><br>";
if(k==0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
}
if (k > 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
}
	k++;
}

		if(t_value1.created_by_task == "orientation_detection" && val == "OD"){
text = "table_id: " +t_value1.table_id+",<br>source: "+t_value1.source+",<br>table_orientation: "+t_value1.table_orientation+",<br>created_by_task: "+t_value1.created_by_task+"<br><br>";
if(k==0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').html(text);
}
if (k > 0){
$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
$('#dialog-message').append(text);
}
	k++;
}

	});
	});
	}
