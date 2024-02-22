// ||| Chat
// Listen for chat messages to trigger specific actions
function handleChatMessage(msg) {
    if (msg.type !== "api") return; // Early exit if not an API type message

    const args = msg.content.split(" ");
    const command = args.shift().toLowerCase(); // Extract the command

    switch (command) {
        case "!setconveyor":
            handleSetConveyorCommand(args, msg.selected);
            break;
        case "!debugconv":
            debugConveyorsInfo();
            break;
        case "!findconveyors":
            findConveyorTokens();
            break;
        case "!debugpos":
            checkTokenPosition(msg.selected);
            break;
        case "!help":
            sendHelpMessage();
            break;
        default:
            sendChat("System", "/w gm Unknown command.");
    }
}

// Function to send help message
function sendHelpMessage() {
    sendChat("System", "/w gm Available commands:");
    sendChat("System", "/w gm !setconveyor <direction>: Sets a conveyor belt in the specified direction.");
    sendChat("System", "/w gm !debugconv: Displays information about existing conveyor belts.");
    sendChat("System", "/w gm !findconveyors: Manually triggers the search for conveyor belts.");
    sendChat("System", "/w gm !debugpos: Checks the position of selected tokens.");
    sendChat("System", "/w gm !help: Displays this help message.");
}

// ||| Move tokens on conveyor belts
var conveyorsInfo = {}; // Global object to store conveyor info

function isTokenOnConveyor(token, conveyor) {
    // Calculate the token's effective radius, considering rotation
    const width = token.get('width') * (token.get('scalex') || 1);
    const height = token.get('height') * (token.get('scaley') || 1);
    const effectiveRadius = Math.sqrt((width * width) + (height * height)) / 2;

    // Conveyor bounds (simplified to a center point and "radius")
    const conveyorCenter = { x: conveyor.x, y: conveyor.y };
    const conveyorWidth = conveyor.width;
    const conveyorHeight = conveyor.height;
    const conveyorEffectiveRadius = Math.sqrt((conveyorWidth * conveyorWidth) + (conveyorHeight * conveyorHeight)) / 2;

    // Distance between token center and conveyor center
    const dx = conveyorCenter.x - token.get('left');
    const dy = conveyorCenter.y - token.get('top');
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the token is effectively "on" the conveyor
    return distance <= (effectiveRadius + conveyorEffectiveRadius) / 2;
}



// Function to find conveyor belts and store their information
function findConveyorTokens() {
    sendChat("System", "Finding conveyor belts...");
    var currentPageId = Campaign().get("playerpageid");
    var allObjects = findObjs({_type: "graphic", _pageid: currentPageId, layer: "map"});

    conveyorsInfo = {}; // Reset conveyor information

    allObjects.forEach(function(obj) {
        if (obj.get("name").startsWith("conveyor-")) {
            var direction = obj.get("name").split("-")[1];
            var id = obj.get("_id");

            conveyorsInfo[id] = {
                direction: direction,
                x: obj.get("left"),
                y: obj.get("top"),
                width: obj.get("width"),
                height: obj.get("height")
            };
            sendChat("System", "/w gm Conveyor found: " + obj.get("name"));
        }
    });
}


// Function to move tokens based on conveyor information
function moveTokensOnConveyors(steps) {
    var currentPageId = Campaign().get("playerpageid");
    var allObjects = findObjs({_type: "graphic", _pageid: currentPageId, layer: "objects"});
    var tokensToMove = [];

    // First, identify all tokens to move
    allObjects.forEach(function(token) {
        Object.keys(conveyorsInfo).forEach(function(conveyorId) {
            var conveyor = conveyorsInfo[conveyorId];
            if (isTokenOnConveyor(token, conveyor)) {
                let newPosition = calculateNewPosition(token, conveyor.direction, steps);
                tokensToMove.push({ token: token, newPosition: newPosition });
            }
        });
    });

    // Then, move all identified tokens
    tokensToMove.forEach(function(item) {
        item.token.set({
            left: item.newPosition.x,
            top: item.newPosition.y
        });
    });
}

// Helper function to calculate new position based on direction and steps
function calculateNewPosition(token, direction, steps) {
    var gridSize = 70;
    var dx = 0, dy = 0;

    // Determine the direction to move
    switch(direction) {
        case 'N': dy = -gridSize; break;
        case 'NE': dx = gridSize; dy = -gridSize; break;
        case 'E': dx = gridSize; break;
        case 'SE': dx = gridSize; dy = gridSize; break;
        case 'S': dy = gridSize; break;
        case 'SW': dx = -gridSize; dy = gridSize; break;
        case 'W': dx = -gridSize; break;
        case 'NW': dx = -gridSize; dy = -gridSize; break;
    }

    var newX = token.get("left") + (dx * steps);
    var newY = token.get("top") + (dy * steps);

    return { x: newX, y: newY };
}


// Adjusted function to handle turn order changes
function handleTurnOrderChange() {
    //sendChat("System", "/w gm Handling turn order change.");
    var turnOrder = JSON.parse(Campaign().get("turnorder") || "[]");
    if (turnOrder.length > 0 && turnOrder[0].custom === "Trigger move") {
        // findConveyorTokens();
        moveTokensOnConveyors(1);
    }
}


// ||| Debug functions

function debugConveyorsInfo() {
    let message = "Conveyors Info:<br>";
    Object.keys(conveyorsInfo).forEach(key => {
        const conveyor = conveyorsInfo[key];
        message += `ID: ${key}, Direction: ${conveyor.direction}, Position: (${conveyor.x}, ${conveyor.y}), Size: (${conveyor.width}x${conveyor.height})<br>`;
    });
    sendChat("System", "/w gm " + message);
}

function checkTokenPosition(selected) {
    if (selected && selected.length > 0) {
        const token = getObj("graphic", selected[0]._id);
        if (token) {
            const position = `Token Position - X: ${token.get('left')}, Y: ${token.get('top')}`;
            sendChat("System", `/w gm ${position}`);
        } else {
            sendChat("System", "/w gm No token found.");
        }
    } else {
        sendChat("System", "/w gm No token selected.");
    }
}

// ||| Start everything
function init() {
    setTimeout(findConveyorTokens, 1000);
    on("chat:message", handleChatMessage);
    on("change:campaign:turnorder", handleTurnOrderChange);
    on("change:campaign:playerpageid", function() {
        setTimeout(findConveyorTokens, 1000); 
    });
    sendHelpMessage()
}

init();

