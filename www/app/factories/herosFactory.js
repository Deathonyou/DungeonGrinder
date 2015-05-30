
app.factory('herosFactory', function($rootScope,mobsFactory) {
	
	var factory = {};
	
	var heros = [];
	var heroCoolDowns = [ [], [], [] ];
	var heroAttacks = [ [], [], [] ];
	var coolDownTimoout = null;
	
	var weaponsList = [];
	
	
	/***************************************************************************
		function - loadWeaopns
	***************************************************************************/
	factory.loadWeaopns = function() {
		// for now we are just using a static pre-loaded list
		weaponsList = dataWeaponsList;
	},
	
	/***************************************************************************
		function - getHeros
	***************************************************************************/
	factory.getHeros = function() {
		
		function createHero(id,statLabelShort,statLabelLong) {			
			return {
				id: id,
				stat: 1,
				statLabelShort: statLabelShort,
				statLabelLong: statLabelLong,
				weapons: [ null, null ],
				coolDowns: [ -1, -1 ],
				inventory: []
			}
		}
		
		// hard-coded list of heros (for now)
		heros.push( createHero('warroir','str','Strength') );
		heros.push( createHero('rouge','dex','Dexterity') );
		heros.push( createHero('mage','int','Intelligence') );
		
		// add starting weapons to Inventory
		factory.addToInventory(0,'sword');
		factory.addToInventory(0,'axe');
		factory.addToInventory(0,'mace');
		factory.addToInventory(1,'bow');
		factory.addToInventory(2,'cone_of_cold');
		factory.addToInventory(2,'chain_lighting');
		
		// add weapon, also hard-coded for now
		factory.equipWeapon(0,0,0);
		factory.equipWeapon(1,0,0);
		factory.equipWeapon(2,0,0);
		
		return heros;
	}
	
	
	/***************************************************************************
		function - addToInventory
	***************************************************************************/
	factory.addToInventory = function(heroKey,weaponId) {
		
		// get weapon
		var weapon = factory.getWeapon(weaponId);
		
		// add to inventory
		heros[heroKey].inventory.push(weapon);
	}
	
	
	/***************************************************************************
		function - equipWeapon
	***************************************************************************/
	factory.equipWeapon = function(heroKey,slot,inventoryKey) {
		
		// get weapon
		var weapon = heros[heroKey].inventory[inventoryKey];
		
		// set hero's weapon slot
		if ( heros[heroKey].weapons[slot] == null || weapon.id != heros[heroKey].weapons[slot].id ) {
			heros[heroKey].weapons[slot] = weapon;
			heros[heroKey].coolDowns[slot] = weapon.coolDown;
		}
		
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
				
				case('cleaveFromLeft'): // attack two left targets
					
					// target 1
					targetedMobs[0] = {
						mobObj: mobsFactory.selectMobFromLeft(1,0),
						damage: 1
					}
					
					// get neighbours
					var neighbours = mobsFactory.selectNeighbours(targetedMobs[0].mobObj);
					
					// taget 2
					if ( neighbours.right ) {
						targetedMobs[1] = { mobObj: neighbours.right, damage: 1 } ;
					}
					
					break;
					
				case('chain'): // attack one in each row
					
					for (i = 0; i < 3; i++) {
						targetedMobs[i] = {
							mobObj: mobsFactory.selectRandomInRow(i),
							damage: 1
						}
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
		
		
		//console.log(heros[heroKey].id+' attacks with '+weapon.name, targetedMobs);
		
	}

	
	return factory;
});