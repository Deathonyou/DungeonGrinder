
app.factory('herosFactory', function($rootScope,mobsFactory) {
	
	var factory = {};
	
	var heros = [];
	var heroCoolDowns = [ [], [], [] ];
	var heroAttacks = [ [], [], [] ];
	var coolDownTimoout = null;
	
	var weaponsList = [
		{
			id: 'sword',
			name: 'Basic Sword',
			graphic: 'sword1',
			hero: 'warroir',
			cost: 0,
			attackPat: 'left',
			coolDown: 40,
			damage: 3,
			text: 'A basic sword'
		},
		{
			id: 'axe',
			name: 'Basic Axe',
			graphic: 'axe1',
			hero: 'warroir',
			cost: 0,
			attackPat: 'cleaveFromLeft',
			coolDown: 40,
			damage: 2,
			text: 'A basic axe'
		},
		{
			id: 'bow',
			name: 'Basic Bow',
			graphic: 'bow1',
			hero: 'rouge',
			cost: 0,
			attackPat: 'random',
			coolDown: 25,
			damage: 2,
			text: 'A basic bow'
		},
		{
			id: 'cone_of_cold',
			name: 'Cone of Cold',
			graphic: 'cold1',
			hero: 'mage',
			cost: 0,
			attackPat: 'cone',
			coolDown: 60,
			damage: 2,
			text: 'Casts a cone of cold'
		}
	];
	
	
	/***************************************************************************
		function - getSecrets
	***************************************************************************/
	factory.getHeros = function() {
		
		function createHero(id,statLabelShort,statLabelLong) {			
			return {
				id: id,
				stat: 1,
				statLabelShort: statLabelShort,
				statLabelLong: statLabelLong,
				weapons: [ null, null ],
				coolDowns: [ -1, -1 ]
			}
		}
		
		// hard-coded list of heros (for now)
		heros.push( createHero('warroir','str','Strength') );
		heros.push( createHero('rouge','dex','Dexterity') );
		heros.push( createHero('mage','int','intelligence') );

		// add weapon, also hard-coded for now
		factory.addWeapon(0,0,'sword');
		factory.addWeapon(1,0,'bow');
		factory.addWeapon(2,0,'cone_of_cold');
		
		
		return heros;
	}
	
	
	/***************************************************************************
		function - addWeapon
	***************************************************************************/
	factory.addWeapon = function(heroKey,slot,weaponId) {
		
		// get weapon
		var weapon = factory.getWeapon(weaponId);
		
		// set hero's weapon slot
		heros[heroKey].weapons[slot] = weapon;
		heros[heroKey].coolDowns[slot] = weapon.coolDown;
		
	}
	
	/***************************************************************************
		function - getWeapon
	***************************************************************************/
	factory.getWeapon = function(weaponId) {
		var weapon = null;
		
		$.each(weaponsList, function() {
			if ( this.id == weaponId ) {
				weapon = this;
			}
		});
		
		return weapon;
	}
	
	
	/***************************************************************************
		function - weaponAttack
	***************************************************************************/
	factory.weaponAttack = function(heroKey,weapon) {
		
		// select tageted mobs
		var targetedMobs = [];
		switch ( weapon.attackPat ) {
			
			case( 'left' ): // attack the left most mob in the first row
				
				var taget = {
					mobObj: mobsFactory.selectMobFromLeft(1,0),
					damage: 1
				}
				targetedMobs[0] = taget;
				
				break;
			
			case( 'random' ): // attack the left most mob in the first row
				
				// random row
				var randRow = Math.floor(Math.random() * 3); 
				
				var taget = {
					mobObj: mobsFactory.selectRandomInRow(randRow),
					damage: 1
				}
				targetedMobs[0] = taget;
				
				break;
			
			case( 'cone' ): // attack mob and it's two neighbours
				
				var row = 0; 
				
				// get center target
				var mainTaget = {
					mobObj: mobsFactory.selectRandomInRow(row),
					damage: 1
				}
				
				// get neighbours
				var neighbours = mobsFactory.selectNeighbours(mainTaget.mobObj);
				
				// taget left
				if ( neighbours.left ) {
					targetedMobs.push( 
						{ 
							mobObj: neighbours.left,
							damage: 0.5
						} 
					);
				}
				
				// taget main
				targetedMobs.push( mainTaget );
				
				// taget right
				if ( neighbours.right ) {
					targetedMobs.push( 
						{ 
							mobObj: neighbours.right,
							damage: 0.5
						} 
					);
				}
				
				break;
			
			default:
				console.log('ERROR: unknow attackPat');
		}
		
		// damage tageted mobs
		$.each(targetedMobs, function() {
			var damage = Math.round( ( weapon.damage * heros[heroKey].stat ) * this.damage );
			
			$rootScope.damageMob( mobsFactory.getMobFromId( this.mobObj.mobId ), damage, weapon );
			
		});
		
		
		console.log(heros[heroKey].id+' attacks with '+weapon.name, targetedMobs);
		
	}

	
	return factory;
});