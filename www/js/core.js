

function updateGold() {
	var goldElem = $('.gold-panel h1');
	var goldDisplay = parseInt( goldElem.html() );
	var goldTotal = parseInt( goldElem.attr('data-gold-total') );
	
	if ( goldDisplay < goldTotal  ) { // is display gold less then the real total value?
		goldDisplay++;
	}
	else if ( goldDisplay > goldTotal  ) { // is display gold less then the real total value?
		goldDisplay--;
	}
	
	// update display gold
	goldElem.html(goldDisplay);
	
	// loop
	setTimeout(function(){ updateGold(); }, 10);
}
updateGold();



function mobStep() {
	
	$('.mob').each(function() {
		var mobElem = $(this);
		if ( mobElem.hasClass('mob-normal') ) {
			mobElem.removeClass('mob-normal').addClass('mob-step');
		}
		else if (  mobElem.hasClass('mob-step') ) {
			mobElem.removeClass('mob-step').addClass('mob-normal');
		}
	});
	
	// loop
	setTimeout(function(){ mobStep(); }, 800);
}
mobStep();