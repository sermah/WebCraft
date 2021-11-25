// ==========================================
// World container
//
// This class contains the elements that make up the game world.
// Other modules retrieve information from the world or alter it
// using this class.
// ==========================================

// Constructor( sx, sy, sz )
//
// Creates a new world container with the specified world size.
// Up and down should always be aligned with the Z-direction.
//
// sx - World size in the X-direction.
// sy - World size in the Y-direction.
// sz - World size in the Z-direction.

function World( sx, sy, sz )
{
	// Initialise world array
	this.blocks = new Array( sx );
	for ( var x = 0; x < sx; x++ )
	{
		this.blocks[x] = new Array( sy );
		for ( var y = 0; y < sy; y++ )
		{
			this.blocks[x][y] = new Array( sz );
		}
	}
	this.sx = sx;
	this.sy = sy;
	this.sz = sz;
	
	this.players = {};
}

// createFlatWorld()
//
// Sets up the world so that the bottom half is filled with dirt
// and the top half with air.

World.prototype.createFlatWorld = function( height )
{
	this.spawnPoint = new Vector( this.sx / 2 + 0.5, this.sy / 2 + 0.5, height );
	
	for ( var x = 0; x < this.sx; x++ )
		for ( var y = 0; y < this.sy; y++ )
			for ( var z = 0; z < this.sz; z++ )
				this.blocks[x][y][z] = z < height ? BLOCK.DIRT : BLOCK.AIR;
}

World.prototype.createRandomWorld = function( seed )
{
	for ( var x = 0; x < this.sx; x++ )
		for ( var y = 0; y < this.sy; y++ )
			for ( var z = 0; z < this.sz; z++ )
				this.blocks[x][y][z] = z < seed * seed * 0.01 * x + seed * 0.1 * y ? BLOCK.DIRT : BLOCK.AIR

	this.spawnPoint = new Vector(this.sx / 2 + 0.5, this.sy / 2 + 0.5, 64);
}

// createFromString( str )
//
// Creates a world from a string representation.
// This is the opposite of toNetworkString().
//
// NOTE: The world must have already been created
// with the appropriate size!

World.prototype.createFromString = function( str )
{
	var i = 0;
	
	for ( var x = 0; x < this.sx; x++ ) {
		for ( var y = 0; y < this.sy; y++ ) {
			for ( var z = 0; z < this.sz; z++ ) {
				this.blocks[x][y][z] = BLOCK.fromId( str.charCodeAt( i ) - 97 );
				i = i + 1;
			}
		}
	}
}

// getBlock( x, y, z )
//
// Get the type of the block at the specified position.
// Mostly for neatness, since accessing the array
// directly is easier and faster.

World.prototype.getBlock = function( x, y, z )
{
	if ( x < 0 || y < 0 || z < 0 || x > this.sx - 1 || y > this.sy - 1 || z > this.sz - 1 ) return BLOCK.AIR;
	return this.blocks[x][y][z];
}

// setBlock( x, y, z )

World.prototype.setBlock = function( x, y, z, type )
{
	this.blocks[x][y][z] = type;
	if ( this.renderer != null ) this.renderer.onBlockChanged( x, y, z );
}

// pickAt( max, pPos, pAng)
//
// Returns the block which you're looking at.
// The blocks that can be reached within `max` distance.

World.prototype.pickAt = function (max, pPos, pAng) {
	let cPos = new Vector(pPos.x, pPos.y, pPos.z);
	let vDir = new Vector(
		Math.sin(pAng[1]) * Math.abs(Math.cos(pAng[0])),
		Math.cos(pAng[1]) * Math.abs(Math.cos(pAng[0])),
		Math.sin(pAng[0]));
	//console.log(vDir);
	let vDirSign = new Vector(Math.sign(vDir.x), Math.sign(vDir.y), Math.sign(vDir.z))
	let tDt = new Vector(
		Math.abs(1 / vDir.x),
		Math.abs(1 / vDir.y),
		Math.abs(1 / vDir.z),
	)
	let tDir = new Vector(
		cPos.x % 1,
		cPos.y % 1,
		cPos.z % 1,
	)
	tDir = new Vector(
		(vDirSign.x >= 0 ? 1 - tDir.x : tDir.x) * tDt.x,
		(vDirSign.y >= 0 ? 1 - tDir.y : tDir.y) * tDt.y,
		(vDirSign.z >= 0 ? 1 - tDir.z : tDir.z) * tDt.z,
	)
	let bPos = new Vector(
		Math.floor(cPos.x),
		Math.floor(cPos.y),
		Math.floor(cPos.z),
	)
	//console.log(tDir, tDt, vDirSign)
	let dist = 0
	let last = 0 // 0 - x, 1 - y, 2 - z
	while (dist <= max) {
		let block = this.getBlock(bPos.x, bPos.y, bPos.z)
		//console.log({ cPos, pPos, d: dist, t: mdt, b: block, bPos });
		if (block.id != 0) {
			let normal = new Vector(0, 0, 0);
			//console.log(block.id);
			switch (last) {
				case 0:
					normal.x = -vDirSign.x;
					break;
				case 1:
					normal.y = -vDirSign.y;
					break;
				case 2:
					normal.z = -vDirSign.z;
					break;
			}
			return {
				x: bPos.x,
				y: bPos.y,
				z: bPos.z,
				n: normal
			};
		}

		if (tDir.x < tDir.y && tDir.x < tDir.z) {
			bPos.x += vDirSign.x
			dist = tDir.x
			tDir.x += tDt.x
			last = 0
		} else if (tDir.y < tDir.z) {
			bPos.y += vDirSign.y
			dist = tDir.y
			tDir.y += tDt.y
			last = 1
		} else if (tDir.z != 0) {
			bPos.z += vDirSign.z
			dist = tDir.z
			tDir.z += tDt.z
			last = 2
		} else {
			//console.log(vDir, dt);
			return false;
		}
	}
	return false;
}


// toNetworkString()
//
// Returns a string representation of this world.

World.prototype.toNetworkString = function()
{
	var blockArray = [];
	
	for ( var x = 0; x < this.sx; x++ )
		for ( var y = 0; y < this.sy; y++ )
			for ( var z = 0; z < this.sz; z++ )
				blockArray.push( String.fromCharCode( 97 + this.blocks[x][y][z].id ) );
	
	return blockArray.join( "" );
}

// Export to node.js
if ( typeof( exports ) != "undefined" )
{
	// loadFromFile( filename )
	//
	// Load a world from a file previously saved with saveToFile().
	// The world must have already been allocated with the
	// appropriate dimensions.
	
	World.prototype.loadFromFile = function( filename )
	{
		var fs = require( "fs" );
		try {
			fs.lstatSync( filename );
			var data = fs.readFileSync( filename, "utf8" ).split( "," );
			this.createFromString( data[3] );
			this.spawnPoint = new Vector( parseInt( data[0] ), parseInt( data[1] ), parseInt( data[2] ) );
			return true;
		} catch ( e ) {
			return false;
		}
	}
	
	// saveToFile( filename )
	//
	// Saves a world and the spawn point to a file.
	// The world can be loaded from it afterwards with loadFromFile().
	
	World.prototype.saveToFile = function( filename )
	{
		var data = this.spawnPoint.x + "," + this.spawnPoint.y + "," + this.spawnPoint.z + "," + this.toNetworkString();
		require( "fs" ).writeFileSync( filename, data );	
	}
	
	exports.World = World;
}