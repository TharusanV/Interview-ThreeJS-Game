/* ----- ZIP-LINE ---- */
//Press spacebar to interact
//Press spacebar again to dismount
//If reach the end auto dismount
export const grabZipline = (playerRef, spacebarPressed, isGroundedRef, isInAir) => {

}


//Hold Spacebar and Forward - If you let one key go then instantly slide down but you can jump when falling
//Cancelled when falling or the jump key is pressed twice

//The wall run has a certain height then it will fall no matter 
//Tilt camera
//2 secs


export const wallRunUp = (playerRef) => {
    /*  
    if(forward && (spacebarHold ||spacebarPressed)){
        wallRunUp();
        if(touchingEdge){
           wallHang(); 
        }
      }
        */
}

export const wallRunSides = (playerRef) => {

}


//Jump on box and using it as leverage to jump higher - Hold Jump (Check distance ahead for a box)
//Normal Jump - Jump (Jump on ledge)
//Can hold jump and if a wall is after the block then use the box for leverage and wall run
const JUMP_FORCE = 5;
const BOX_JUMP_FORCE = JUMP_FORCE * 2;

export const basicJump = (playerRef) => {
    if (!playerRef.current) return;
    
    playerRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }), true;
}

export const vaultOverObstacle = (playerRef) => {
    playerRef.current.applyImpulse({ x: 0, y: BOX_JUMP_FORCE, z: 0 }); 
}

export const vaultOntoObstacle = (playerRef) => {
    //playerRef.current.applyImpulse({ x: 0, y: BOX_JUMP_FORCE, z: 0 }); 
}


//Sofen landing
// Left CTRL


//Slide
//Auto on downward slope or ctrl 


//Hang ledge


//Grappling Hook


//Climb
//Pipes / Ladders - When you run into ladders or touch a ladder auto attach
export const climbUp = (playerRef) => {
}

export const climbPipeLadder = (playerRef) => {

}

//Bar swing
//Hold forward and space
//Monkey Bar Approach - (Can just hang there and build up speed by swinging forwards and backwards then jumping)
//Swing sideways Approach


//Balance on pole
//using A and D