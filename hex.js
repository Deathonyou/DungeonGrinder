S(document).ready(function(){
	var hexmap = S.hexmap('hexmap-6');
	hexmap.positionHexes().resize();
	hexmap.on('click',function(e){

		S('#message-6').html('You have clicked hex '+e.i+' ('+e.hex.id+')')

	}).on('mouseover',function(e){

		S('#message-6').html('You have hovered over hex '+e.i+' ('+e.hex.id+')')

	}).on('mouseout',function(e){

		S('#message-6').html('You have left hex '+e.i+' ('+e.hex.id+')')

	}).on('focus',function(e){

		S('#message-6').html('You have focussed on hex '+e.i+' ('+e.hex.id+')')

	});
});
