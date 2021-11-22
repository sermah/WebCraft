// ==========================================
// Block types
//
// This file contains all available block types and their properties.
// ==========================================

// Direction enumeration
var DIRECTION = {};
DIRECTION.UP = 1;
DIRECTION.DOWN = 2;
DIRECTION.LEFT = 3;
DIRECTION.RIGHT = 4;
DIRECTION.FORWARD = 5;
DIRECTION.BACK = 6;

BLOCK = {};

// Air
BLOCK.AIR = {
	id: 0,
	spawnable: false,
	transparent: true
};

// Bedrock
BLOCK.BEDROCK = {
	id: 1,
	spawnable: false,
	transparent: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 1/16, 1/16, 2/16, 2/16 ]; }
};

// Dirt
BLOCK.DIRT = {
	id: 2,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir )
	{
		if ( dir == DIRECTION.UP && lit )
			return [8 / 16, 2 / 16, 9 / 16, 3 / 16, 0.85, 1.3, 0.45 ];
		else if ( dir == DIRECTION.DOWN || !lit ) 
			return [ 2/16, 0/16, 3/16, 1/16 ];
		else
			return [ 3/16, 0/16, 4/16, 1/16 ];
	}
};

// Wood
BLOCK.WOOD = {
	id: 3,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir )
	{
		if ( dir == DIRECTION.UP || dir == DIRECTION.DOWN )
			return [ 5/16, 1/16, 6/16, 2/16 ];
		else
			return [ 4/16, 1/16, 5/16, 2/16 ];
	}
};

// TNT
BLOCK.TNT = {
	id: 4,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	action: function( world, pos, player ) {
		world.setBlock(pos.x, pos.y, pos.z, BLOCK.SAND)
	},
	texture: function( world, lightmap, lit, x, y, z, dir )
	{
		if ( dir == DIRECTION.UP || dir == DIRECTION.DOWN )
			return [ 10/16, 0/16, 11/16, 1/16 ];
		else
			return [ 8/16, 0/16, 9/16, 1/16 ];
	}
};

// Bookcase
BLOCK.BOOKCASE = {
	id: 5,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir )
	{
		if ( dir == DIRECTION.UP || dir == DIRECTION.DOWN )
			return [ 4/16, 0/16, 5/16, 1/16 ];
		else
			return [ 3/16, 2/16, 4/16, 3/16 ];
	}
};

// Lava
BLOCK.LAVA = {
	id: 6,
	spawnable: false,
	transparent: true,
	selflit: true,
	gravity: true,
	fluid: true,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 13/16, 14/16, 14/16, 15/16 ]; }
};

// Plank
BLOCK.PLANK = {
	id: 7,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 4/16, 0/16, 5/16, 1/16 ]; }
};

// Cobblestone
BLOCK.COBBLESTONE = {
	id: 8,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 0/16, 1/16, 1/16, 2/16 ]; }
};

// Concrete
BLOCK.CONCRETE = {
	id: 9,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 1/16, 0/16, 2/16, 1/16 ]; }
};

// Brick
BLOCK.BRICK = {
	id: 10,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 7/16, 0/16, 8/16, 1/16 ]; }
};

// Sand
BLOCK.SAND = {
	id: 11,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: true,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 2/16, 1/16, 3/16, 2/16 ]; }
};

// Gravel
BLOCK.GRAVEL = {
	id: 12,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: true,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 3/16, 1/16, 4/16, 2/16 ]; }
};

// Iron
BLOCK.IRON = {
	id: 13,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 6/16, 1/16, 7/16, 2/16 ]; }
};

// Gold
BLOCK.GOLD = {
	id: 14,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 7/16, 1/16, 8/16, 2/16 ]; }
};

// Diamond
BLOCK.DIAMOND = {
	id: 15,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 8/16, 1/16, 9/16, 2/16 ]; }
};

// Obsidian
BLOCK.OBSIDIAN = {
	id: 16,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 5/16, 2/16, 6/16, 3/16 ]; }
};

// Glass
BLOCK.GLASS = {
	id: 17,
	spawnable: true,
	transparent: true,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 1/16, 3/16, 2/16, 4/16 ]; }
};

// Sponge
BLOCK.SPONGE = {
	id: 18,
	spawnable: true,
	transparent: false,
	selflit: false,
	gravity: false,
	fluid: false,
	texture: function( world, lightmap, lit, x, y, z, dir ) { return [ 0/16, 3/16, 1/16, 4/16 ]; }
};

// fromId( id )
//
// Returns a block structure for the given id.

BLOCK.fromId = function( id )
{
	for ( var mat in BLOCK )
		if ( typeof( BLOCK[mat] ) == "object" && BLOCK[mat].id == id )
			return BLOCK[mat];
	return null;
}

// pushVertices( vertices, world, lightmap, x, y, z )
//
// Pushes the vertices necessary for rendering a
// specific block into the array.

BLOCK.pushVertices = function( vertices, world, lightmap, x, y, z )
{
	var blocks = world.blocks;
	var blockLit = z >= lightmap[x][y];
	var block = blocks[x][y][z];
	var bH = block.fluid && ( z == world.sz - 1 || !blocks[x][y][z+1].fluid ) ? 0.9 : 1.0;
	
	// Top
	if (z == world.sz - 1 || (world.blocks[x][y][z+1].transparent && (world.blocks[x][y][z+1] != block)) || block.fluid )
	{
		let c = getTexture(block, world, lightmap, blockLit, x, y, z, DIRECTION.UP );
		
		let lightMultiplier = (block.selflit || (z >= lightmap[x][y])) ? 1.0 : 0.6;

		let corners = makeColors(x, y, z, c, DIRECTION.UP, lightMultiplier, world)
		
		pushQuad(
			vertices,
			[x, y, z + bH, c[0], c[1], corners[0][0], corners[0][1], corners[0][2], 1.0 ],
			[x + 1.0, y, z + bH, c[2], c[1], corners[1][0], corners[1][1], corners[1][2], 1.0 ],
			[x + 1.0, y + 1.0, z + bH, c[2], c[3], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x, y + 1.0, z + bH, c[0], c[3], corners[3][0], corners[3][1], corners[3][2], 1.0 ]
		);
	}
	
	// Bottom
	if (z == 0 || (world.blocks[x][y][z - 1].transparent && (world.blocks[x][y][z - 1] != block)) )
	{
		let c = getTexture(block, world, lightmap, blockLit, x, y, z, DIRECTION.DOWN )
		
		let lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		let corners = makeColors(x, y, z, c, DIRECTION.DOWN, lightMultiplier, world)

		pushQuad(
			vertices,							
			[x, y + 1.0, z, c[0], c[3], corners[3][0], corners[3][1], corners[3][2], 1.0 ],
			[x + 1.0, y + 1.0, z, c[2], c[3], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x + 1.0, y, z, c[2], c[1], corners[1][0], corners[1][1], corners[1][2], 1.0 ],
			[x, y, z, c[0], c[1], corners[0][0], corners[0][1], corners[0][2], 1.0 ]
		);
	}
	
	// Front
	if (y == 0 || (world.blocks[x][y-1][z].transparent && (world.blocks[x][y-1][z] != block)) )
	{
		let c = getTexture(block, world, lightmap, blockLit, x, y, z, DIRECTION.FORWARD );
		
		let lightMultiplier = ( block.selflit || y == 0 || z >= lightmap[x][y-1] ) ? 1.0 : 0.6;
		
		let corners = makeColors(x, y, z, c, DIRECTION.FORWARD, lightMultiplier, world)

		pushQuad(
			vertices,
			[x, y, z, c[0], c[3], corners[0][0], corners[0][1], corners[0][2], 1.0 ],
			[x + 1.0, y, z, c[2], c[3], corners[1][0], corners[1][1], corners[1][2], 1.0 ],
			[x + 1.0, y, z + bH, c[2], c[1], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x, y, z + bH, c[0], c[1], corners[3][0], corners[3][1], corners[3][2], 1.0 ]
		);
	}
	
	// Back
	if (y == world.sy - 1 || (world.blocks[x][y+1][z].transparent && (world.blocks[x][y+1][z] != block)) )
	{
		let c = getTexture(block, world, lightmap, blockLit, x, y, z, DIRECTION.BACK );
		
		let lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		let corners = makeColors(x, y, z, c, DIRECTION.BACK, lightMultiplier, world)

		pushQuad(
			vertices,
			[x, y + 1.0, z + bH, c[2], c[1], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x + 1.0, y + 1.0, z + bH, c[0], c[1], corners[3][0], corners[3][1], corners[3][2], 1.0 ],
			[x + 1.0, y + 1.0, z, c[0], c[3], corners[0][0], corners[0][1], corners[0][2], 1.0 ],
			[x, y + 1.0, z, c[2], c[3], corners[1][0], corners[1][1], corners[1][2], 1.0 ]
		);
	}
	
	// Left
	if (x == 0 || (world.blocks[x-1][y][z].transparent && (world.blocks[x-1][y][z] != block)) )
	{
		let c = getTexture(block, world, lightmap, blockLit, x, y, z, DIRECTION.LEFT );
		
		let lightMultiplier = block.selflit ? 1.0 : 0.6;
		
		let corners = makeColors(x, y, z, c, DIRECTION.LEFT, lightMultiplier, world)

		pushQuad(
			vertices,
			[x, y, z + bH, c[2], c[1], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x, y + 1.0, z + bH, c[0], c[1], corners[3][0], corners[3][1], corners[3][2], 1.0 ],
			[x, y + 1.0, z, c[0], c[3], corners[0][0], corners[0][1], corners[0][2], 1.0 ],
			[x, y, z, c[2], c[3], corners[1][0], corners[1][1], corners[1][2], 1.0 ]
		);
	}
	
	// Right
	if (x == world.sx - 1 || (world.blocks[x+1][y][z].transparent && (world.blocks[x+1][y][z] != block)) )
	{
		let c = getTexture( block, world, lightmap, blockLit, x, y, z, DIRECTION.RIGHT );
		
		let lightMultiplier = (block.selflit || x == world.sx - 1 || z >= lightmap[x+1][y] ) ? 1.0 : 0.6;
		
		let corners = makeColors(x, y, z, c, DIRECTION.RIGHT, lightMultiplier, world)

		pushQuad(
			vertices,
			[x + 1.0, y, z, c[0], c[3], corners[0][0], corners[0][1], corners[0][2], 1.0 ],
			[x + 1.0, y + 1.0, z, c[2], c[3], corners[1][0], corners[1][1], corners[1][2], 1.0 ],
			[x + 1.0, y + 1.0, z + bH, c[2], c[1], corners[2][0], corners[2][1], corners[2][2], 1.0 ],
			[x + 1.0, y, z + bH, c[0], c[1], corners[3][0], corners[3][1], corners[3][2], 1.0 ]
		);
	}
}

function calculateCornerAO( side1, side2, corner ){
	//  x|| s1
	// ==`.---
    // s2 | corner
	return 3 - (side1 ? 1 : 0) - (side2 ? 1 : 0) - (corner || side1 && side2 ? 1 : 0)
}

function calculateSideAO( x, y, z, dir, world ){
	//        y+ (top/bot)
	//   x- = 0 1 = x+ (top/bot)
	// left - 2 3 - right (side)
	//        y-
	let s01, s02, s13, s23, // side voxels
		c0, c1, c2, c3		// corner voxels

	if ( (dir == DIRECTION.UP) || (dir == DIRECTION.DOWN) ) {
		let ud = (dir == DIRECTION.DOWN) ? -1 : ((dir == DIRECTION.UP) ? 1 : 0);
		s01 = !world.getBlock(
			x,
			y + 1,
			z + ud
		).transparent;
		s23 = !world.getBlock(
			x,
			y - 1,
			z + ud
		).transparent;
		s02 = !world.getBlock(
			x - 1,
			y,
			z + ud
		).transparent;
		s13 = !world.getBlock(
			x + 1,
			y,
			z + ud
		).transparent;
		c0 = !world.getBlock(
			x - 1,
			y + 1,
			z + ud
		).transparent;
		c1 = !world.getBlock(
			x + 1,
			y + 1,
			z + ud
		).transparent;
		c2 = !world.getBlock(
			x - 1,
			y - 1,
			z + ud
		).transparent;
		c3 = !world.getBlock(
			x + 1,
			y - 1,
			z + ud
		).transparent;
	} else {
		let lr = (dir == DIRECTION.LEFT) ? -1 : ((dir == DIRECTION.RIGHT) ? 1 : 0);
		let bf = (dir == DIRECTION.BACK) ? 1 : ((dir == DIRECTION.FORWARD) ? -1 : 0); // idk why vice versa, for some reason 
		s01 = !world.getBlock( 
			x + lr,
			y + bf, 
			z + 1
		).transparent;
		s02 = !world.getBlock( 
			x + lr + bf, 
			y + bf - lr, 
			z
		).transparent;
		s23 = !world.getBlock( 
			x + lr, 
			y + bf,
			z - 1
		).transparent;
		s13 = !world.getBlock( 
			x + lr - bf, 
			y + bf + lr, 
			z
		).transparent;
		c0 = !world.getBlock(
			x + lr + bf,
			y + bf - lr,
			z + 1
		).transparent;
		c1 = !world.getBlock(
			x + lr - bf,
			y + bf + lr,
			z + 1
		).transparent;
		c2 = !world.getBlock(
			x + lr + bf,
			y + bf - lr,
			z - 1
		).transparent;
		c3 = !world.getBlock(
			x + lr - bf,
			y + bf + lr,
			z - 1
		).transparent;
	}

	// ao   0 1 2 3  -  2 3 1 0 //  3 2 vrtx
	// vrtx 3 2 0 1  -  0 1 2 3 //  0 1

	let map = [
		calculateCornerAO(s02, s23, c2) / 3, // 2
		calculateCornerAO(s13, s23, c3) / 3, // 3
		calculateCornerAO(s01, s13, c1) / 3, // 1
		calculateCornerAO(s01, s02, c0) / 3  // 0
	];
	return map;
}

function makeColors( x, y, z, c, dir, light, world){
	let aos = calculateSideAO(x, y, z, dir, world)

	let colors = [light, light, light]
	if (c.length > 4) {
		colors[0] *= c[4]
		colors[1] *= c[5]
		colors[2] *= c[6]
	}

	let combine = (clr, ao) => [
		clr[0] * (ao * 0.6 + 0.4),
		clr[1] * (ao * 0.6 + 0.4),
		clr[2] * (ao * 0.6 + 0.4)
	];


	let corners = [
		combine(colors, aos[0]),
		combine(colors, aos[1]),
		combine(colors, aos[2]),
		combine(colors, aos[3])
	];

	return corners
}

function getTexture( block, world, lightmap, blockLit, x, y, z, dir ){
	let c = block.texture(world, lightmap, blockLit, x, y, z, dir)
	return c
}

// Export to node.js
if ( typeof( exports ) != "undefined" )
{
	exports.BLOCK = BLOCK;
}