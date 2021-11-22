// ==========================================
// Player
//
// This class contains the code that manages the local player.
// ==========================================

// Mouse event enumeration
MOUSE = {};
MOUSE.DOWN = 1;
MOUSE.UP = 2;
MOUSE.MOVE = 3;

// Constructor()
//
// Creates a new local player manager.

function Player()
{	
}

// setWorld( world )
//
// Assign the local player to a world.

Player.prototype.setWorld = function( world )
{
	this.world = world;
	this.world.localPlayer = this;
	this.pos = world.spawnPoint;
	this.velocity = new Vector( 0, 0, 0 );
	this.angles = [ 0, Math.PI, 0 ];
	this.falling = false;
	this.keys = {};
	this.buildMaterial = BLOCK.DIRT;
	this.eventHandlers = {};

	this.maxSpeed = 4.5;
	this.maxAirSpeedForAcc = 1;
	this.jumpSpeed = 8.2;
	// acceleration values (m/s^2)
	this.groundAcc = 12.5;
	this.airAcc = 1.5;
	this.gravity = -0.5;
	// deceleration multipliers
	this.groundDecMul = 0.6;
	this.airDecMul = 0.96;
}

// setClient( client )
//
// Assign the local player to a socket client.

Player.prototype.setClient = function( client )
{
	this.client = client;
}

// setInputCanvas( id )
//
// Set the canvas the renderer uses for some input operations.

Player.prototype.setInputCanvas = function( id )
{
	var canvas = this.canvas = document.getElementById( id );

	var t = this;
	document.onkeydown = function( e ) { if ( e.target.tagName != "INPUT" ) { t.onKeyEvent( e.keyCode, true ); return false; } }
	document.onkeyup = function( e ) { if ( e.target.tagName != "INPUT" ) { t.onKeyEvent( e.keyCode, false ); return false; } }
	canvas.onmousedown = function( e ) { t.onMouseEvent( e.clientX, e.clientY, MOUSE.DOWN, e.which == 3 ); return false; }
	canvas.onmouseup = function( e ) { t.onMouseEvent( e.clientX, e.clientY, MOUSE.UP, e.which == 3 ); return false; }
	canvas.onmousemove = function( e ) { t.onMouseEvent( e.clientX, e.clientY, MOUSE.MOVE, e.which == 3 ); return false; }
}

// setMaterialSelector( id )
//
// Sets the table with the material selectors.

Player.prototype.setMaterialSelector = function( id )
{
	var tableRow = document.getElementById( id ).getElementsByTagName( "tr" )[0];
	var texOffset = 0;

	for ( var mat in BLOCK )
	{
		if ( typeof( BLOCK[mat] ) == "object" && BLOCK[mat].spawnable == true )
		{
			var selector = document.createElement( "td" );
			selector.style.backgroundPosition = texOffset + "px 0px";

			var pl = this;
			selector.material = BLOCK[mat];
			selector.onclick = function()
			{
				this.style.opacity = "1.0";

				pl.prevSelector.style.opacity = null;
				pl.prevSelector = this;

				pl.buildMaterial = this.material;
			}

			if ( mat == "DIRT" ) {
				this.prevSelector = selector;
				selector.style.opacity = "1.0";
			}

			tableRow.appendChild( selector );
			texOffset -= 70;
		}
	}
}

// on( event, callback )
//
// Hook a player event.

Player.prototype.on = function( event, callback )
{
	this.eventHandlers[event] = callback;
}

// onKeyEvent( keyCode, down )
//
// Hook for keyboard input.

Player.prototype.onKeyEvent = function( keyCode, down )
{
	var key = String.fromCharCode( keyCode ).toLowerCase();
	this.keys[key] = down;
	this.keys[keyCode] = down;
	
	if ( !down && key == "t" && this.eventHandlers["openChat"] ) this.eventHandlers.openChat();
}

// onMouseEvent( x, y, type, rmb )
//
// Hook for mouse input.

Player.prototype.onMouseEvent = function( x, y, type, rmb )
{
	if ( type == MOUSE.DOWN ) {
		this.dragStart = { x: x, y: y };
		this.mouseDown = true;
		this.yawStart = this.targetYaw = this.angles[1];
		this.pitchStart = this.targetPitch = this.angles[0];
	} else if ( type == MOUSE.UP ) {
		if ( Math.abs( this.dragStart.x - x ) + Math.abs( this.dragStart.y - y ) < 4 )	
			this.doBlockAction(x, y, !rmb, this.keys[16] ); // 16 == Shift key

		this.dragging = false;
		this.mouseDown = false;
		this.canvas.style.cursor = "default";
	} else if ( type == MOUSE.MOVE && this.mouseDown ) {
		this.dragging = true;
		this.targetPitch = this.pitchStart - ( y - this.dragStart.y ) / 200;
		this.targetYaw = this.yawStart + ( x - this.dragStart.x ) / 200;

		this.canvas.style.cursor = "move";
	}
}

// doBlockAction( x, y )
//
// Called to perform an action based on the player's block selection and input.

Player.prototype.doBlockAction = function( x, y, destroy, noAction )
{
	var block = this.canvas.renderer.pickAt( 8, this.getEyePos(), this.angles, world);
	
	if ( block != false )
	{
		var obj = this.client ? this.client : this.world;
		
		if ( destroy )
			obj.setBlock( block.x, block.y, block.z, BLOCK.AIR );
		else if (noAction || obj.getBlock(block.x, block.y, block.z).action == null)
			obj.setBlock( block.x + block.n.x, block.y + block.n.y, block.z + block.n.z, this.buildMaterial );
		else {
			obj.getBlock(block.x, block.y, block.z).action(obj, block, this)
		}
	}
}

// getEyePos()
//
// Returns the position of the eyes of the player for rendering.

Player.prototype.getEyePos = function()
{
	return this.pos.add( new Vector( 0.0, 0.0, 1.7 ) );
}

// update()
//
// Updates this local player (gravity, movement)

Player.prototype.update = function()
{
	var world = this.world;
	var velocity = this.velocity;
	var pos = this.pos;
	if (pos.z < -64) pos.z = 128;
	var bPos = new Vector( Math.floor( pos.x ), Math.floor( pos.y ), Math.floor( pos.z ) );

	if ( this.lastUpdate != null )
	{
		var delta = ( new Date().getTime() - this.lastUpdate ) / 1000;

		// View
		if ( this.dragging )
		{
			this.angles[0] += ( this.targetPitch - this.angles[0] ) * 30 * delta;
			this.angles[1] += ( this.targetYaw - this.angles[1] ) * 30 * delta;
			if ( this.angles[0] < -Math.PI/2 ) this.angles[0] = -Math.PI/2;
			if ( this.angles[0] > Math.PI/2 ) this.angles[0] = Math.PI/2;
		}

		// Gravity
		if ( this.falling )
			velocity.z += this.gravity;

		// Jumping
		if ( this.keys[" "] && !this.falling )
			velocity.z = this.jumpSpeed;

		// Walking
		var moveDir = new Vector( 0, 0, 0 );
		if ( this.keys["w"] ) {
			moveDir.x += Math.cos( Math.PI / 2 - this.angles[1] );
			moveDir.y += Math.sin( Math.PI / 2 - this.angles[1] );
		}
		if ( this.keys["s"] ) {
			moveDir.x += Math.cos( Math.PI + Math.PI / 2 - this.angles[1] );
			moveDir.y += Math.sin( Math.PI + Math.PI / 2 - this.angles[1] );
		}
		if ( this.keys["a"] ) {
			moveDir.x += Math.cos( Math.PI - this.angles[1] );
			moveDir.y += Math.sin( Math.PI - this.angles[1] );
		}
		if ( this.keys["d"] ) {
			moveDir.x += Math.cos( - this.angles[1] );
			moveDir.y += Math.sin( - this.angles[1] );
		}
		if (!moveDir.isZero()) {
			moveDir = moveDir.normal();
			let acc = (this.falling ? this.airAcc : this.groundAcc);
			//project velocity to moveDir
			let vproj = velocity.dot(moveDir);
			// on ground turn instantly, in air turn like force is applied
			xyVel = this.falling ? velocity.add(moveDir.mul(acc)) : moveDir.mul(vproj+acc);
			// cap acceleration speed in midair
			if (this.falling && (xyVel >= this.maxAirSpeedForAcc)) xyVel = xyVel.normal().mul(velocity.length());
			velocity.x = xyVel.x;
			velocity.y = xyVel.y;
			// cap speed overall
			if(velocity.x*velocity.x + velocity.y*velocity.y > this.maxSpeed * this.maxSpeed) {
				let maxVel = velocity.normal().mul(this.maxSpeed);
				velocity.x = maxVel.x;
				velocity.y = maxVel.y;
			}
		}
		else {
			let decc = this.falling ? this.airDecMul : this.groundDecMul;
			velocity.x *= decc;
			velocity.y *= decc;
			if (Math.abs(velocity.x) < 0.01) velocity.x = 0;
			if (Math.abs(velocity.y) < 0.01) velocity.y = 0;
		}
		
		// Resolve collision
		this.pos = this.resolveCollision( pos, bPos, velocity.mul( delta ) );
		this.velocity = velocity

		if (this.keys["r"]) {
			this.pos.x = this.world.spawnPoint.x;
			this.pos.y = this.world.spawnPoint.y;
			this.pos.z = this.world.spawnPoint.z;
			this.velocity = new Vector( 0, 0, 0 );
		}

		if (this.keys["p"]) {
			console.log(this.pos)
		}
	}

	this.lastUpdate = new Date().getTime();
}

// resolveCollision( pos, bPos, velocity )
//
// Resolves collisions between the player and blocks on XY level for the next movement step.

Player.prototype.resolveCollision = function( pos, bPos, velocity )
{
	var world = this.world;
	var playerRect = { x: pos.x + velocity.x, y: pos.y + velocity.y, size: 0.25 };

	// Collect XY collision sides
	var collisionCandidates = [];

	for ( var x = bPos.x - 1; x <= bPos.x + 1; x++ )
	{
		for ( var y = bPos.y - 1; y <= bPos.y + 1; y++ )
		{
			for ( var z = bPos.z; z <= bPos.z + 1; z++ )
			{
				if ( world.getBlock( x, y, z ) != BLOCK.AIR )
				{
					if ( world.getBlock( x - 1, y, z ) == BLOCK.AIR ) collisionCandidates.push( { x: x, dir: -1, y1: y, y2: y + 1 } );
					if ( world.getBlock( x + 1, y, z ) == BLOCK.AIR ) collisionCandidates.push( { x: x + 1, dir: 1, y1: y, y2: y + 1 } );
					if ( world.getBlock( x, y - 1, z ) == BLOCK.AIR ) collisionCandidates.push( { y: y, dir: -1, x1: x, x2: x + 1 } );
					if ( world.getBlock( x, y + 1, z ) == BLOCK.AIR ) collisionCandidates.push( { y: y + 1, dir: 1, x1: x, x2: x + 1 } );
				}
			}
		}
	}

	// Solve XY collisions
	for( var i in collisionCandidates ) 
	{
		var side = collisionCandidates[i];

		if ( lineRectCollide( side, playerRect ) )
		{
			if ( side.x != null && velocity.x * side.dir < 0 ) {
				pos.x = side.x + playerRect.size / 2 * ( velocity.x > 0 ? -1 : 1 );
				this.velocity.x = 0;
				velocity.x = 0;
			} else if ( side.y != null && velocity.y * side.dir < 0 ) {
				pos.y = side.y + playerRect.size / 2 * ( velocity.y > 0 ? -1 : 1 );
				this.velocity.y = 0;
				velocity.y = 0;
			}
		}
	}

	var playerFace = { x1: pos.x + velocity.x - 0.125, y1: pos.y + velocity.y - 0.125, x2: pos.x + velocity.x + 0.125, y2: pos.y + velocity.y + 0.125 };
	var newBZLower = Math.floor( pos.z + velocity.z );
	var newBZUpper = Math.floor( pos.z + 1.7 + velocity.z * 1.1 );

	// Collect Z collision sides
	collisionCandidates = [];

	for ( var x = bPos.x - 1; x <= bPos.x + 1; x++ ) 
	{
		for ( var y = bPos.y - 1; y <= bPos.y + 1; y++ )
		{
			if ( world.getBlock( x, y, newBZLower ) != BLOCK.AIR )
				collisionCandidates.push( { z: newBZLower + 1, dir: 1, x1: x, y1: y, x2: x + 1, y2: y + 1 } );
			if ( world.getBlock( x, y, newBZUpper ) != BLOCK.AIR )
				collisionCandidates.push( { z: newBZUpper, dir: -1, x1: x, y1: y, x2: x + 1, y2: y + 1 } );
		}
	}

	// Solve Z collisions
	this.falling = true;
	for ( var i in collisionCandidates )
	{
		var face = collisionCandidates[i];

		if ( rectRectCollide( face, playerFace ) && velocity.z * face.dir <= 0 )
		{
			if ( velocity.z <= 0 ) {
				this.falling = false;
				pos.z = face.z;
				velocity.z = 0;
				this.velocity.z = 0;
			} else {
				pos.z = face.z - 1.8;
				velocity.z = 0;
				this.velocity.z = 0;
			}

			break;
		}
	}

	// Return solution
	return pos.add( velocity );
}