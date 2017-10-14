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
	
	//==================================================================//	
	//Hypotheses table Started
var t_group = {};
var groups = {};
var cell_hyp;
$.getJSON("bb.json", function(data){
	var table_hyp = data.hypotheses.table_hypotheses;
	var row_hyp = data.hypotheses.row_hypotheses;
	cell_hyp = data.hypotheses.cell_hypotheses;
	
	//for table Hypotheses
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
	
//for cell Hypotheses	
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
	console.log(t_group)
	console.log(groups);
	console.log(cell_hyp);
});
	
	
	//==================================================================//
	//table without buttons
$.getJSON("xx.json", function(s_data){
	var table1 = document.createElement("table");
	var a_data = s_data.relation;
	$.each(a_data, function (row){
		var tr2 = table1.insertRow(-1);
		$.each(a_data[row], function(col){
			if(col == 0){
				var th = document.createElement("th");   
				th.innerHTML = a_data[row][col];
				tr2.appendChild(th);
			}
			else{
				var tabCell =  tr2.insertCell(-1);
         		tabCell.innerHTML = a_data[row][col];
    		}
		});	
	});
	var divContainer1 = document.getElementById("showData1");
    divContainer1.innerHTML = "";
    divContainer1.appendChild(table1);	
});

	
	
	//==================================================================//	
	//creating data table with buttons
var table = document.createElement("table");
$.getJSON("xx.json", function(s_data){
	var a_data = s_data.relation;
	$.each(a_data, function (row){
		var tr2 = table.insertRow(-1);
		$.each(a_data[row], function(col){
			var btn = document.createElement("input");
			var btn1 = document.createElement("input");
			var btn2 = document.createElement("input");
			btn.type = "button";
			btn.value = "EL";
			btn.onclick = function(){popup(btn.value, row, col, groups)}
			btn1.type = "button";
			btn1.value = "TN";
			btn1.onclick = function(){popup(btn1.value, row, col, groups)}
			btn2.type = "button";
			btn2.value = "LL";
			btn2.onclick = function(){popup(btn2.value, row,col, groups)}
			if(col == 0){
				var th = document.createElement("th");   
				th.innerHTML = a_data[row][col]+"<br>";
				$.each(cell_hyp, function(key, value2){
					if(value2.created_by_task == "entity_linking" && value2.refers_to_column == row && value2.refers_to_row == col){
						th.appendChild(btn);
					}
					if(value2.created_by_task == "table_normalization" && value2.refers_to_column == row && value2.refers_to_row == col){
						th.appendChild(btn1);
					}
					if(value2.created_by_task == "literal_linking" && value2.refers_to_column == row && value2.refers_to_row == col){
						th.appendChild(btn2);
					}
				});
				tr2.appendChild(th);
			}
			else{
				var tabCell =  tr2.insertCell(-1);
         		tabCell.innerHTML = a_data[row][col]+"<br>";
				$.each(cell_hyp, function(key, value2){
					if(value2.created_by_task == "entity_linking" && value2.refers_to_column == row && value2.refers_to_row == col){
						tabCell.appendChild(btn);
					}
					if(value2.created_by_task == "table_normalization" && value2.refers_to_column == row && value2.refers_to_row == col){
						tabCell.appendChild(btn1);
					}
					if(value2.created_by_task == "literal_linking" && value2.refers_to_column == row && value2.refers_to_row == col){
						tabCell.appendChild(btn2);
					}
				});
			}
		});	
	});
});
	//appending table buttons
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
	
var divContainer = document.getElementById("showData");
divContainer.innerHTML = "Table Hypotheses Buttons are: ";
divContainer.appendChild(btn3);
divContainer.appendChild(btn4);
divContainer.appendChild(btn5);
divContainer.appendChild(btn6);
divContainer.appendChild(table);	
});

//div popup function
function popup(val, row_no, col_no, hyp){
	var k = 0;
	// get the screen height and width  
	var maskHeight = $(document).height();  
	var maskWidth = $(window).width();
	// calculate the values for center alignment
	var dialogTop =  (maskHeight/3) - ($('#dialog-box').height());  
	var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2); 
	$.each (hyp, function(key1, value1){
		$.each(value1, function (key, value){
			var text= "";
		
		//entity Linking	
			if (value.refers_to_column == row_no && value.refers_to_row == col_no && val == "EL" && value.created_by_task == "entity_linking"){
				text = "confidence: "+ value.confidence+",<br> based_on_hypotheses: "+ value.based_on_hypotheses+",<br> language: " +value.language+",<br> created_by_task: "+value.created_by_task+",<br> refers_to_column: "+value.refers_to_column+",<br> original_value:<a href= http://dbpedia.org/page/"+value.original_value+" target= blank> "+value.original_value+"</a> ,<br> refers_to_row:" +value.refers_to_row+"<br><br>";
				if(k==0){
					$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
					$('#dialog-message').html(text);
				}
				if(k>0){
					$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
					$('#dialog-message').append(text);
				}
				k++;
			}
			//table Normalization
			if (value.refers_to_column == row_no && value.refers_to_row == col_no && val == "TN" && value.created_by_task == "table_normalization"){
				text = "data_type: "+value.data_type+",<br>hypothesis_count: "+value.hypothesis_count+",<br>task_id: "+value.task_id+",<br> hypothesis_name: "+value.hypothesis_name+",<br>based_on_hypotheses: "+value.based_on_hypotheses+",<br>created_by_task: "+ value.created_by_task+",<br>refers_to_column: "+value.refers_to_column+",<br>original_value:<a href= http://dbpedia.org/page/"+value.original_value+" target= blank> "+value.original_value+"</a>,<br>refers_to_row: "+value.refers_to_row+ "<br><br>"; 
				if(k==0){
					$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
					$('#dialog-message').html(text);
				}
				if(k>0){
					$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();	
					$('#dialog-message').append(text);
				}
				k++;
			}
		});
	});
}

//for table Hypotheses. 
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
