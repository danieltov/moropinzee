// ! Initialize Firebase
var config = {
    apiKey: 'AIzaSyB0rCzVmSeyg1AOB1-tg2C5fkTUAA1PRQE',
    authDomain: 'moropinzee.firebaseapp.com',
    databaseURL: 'https://moropinzee.firebaseio.com',
    projectId: 'moropinzee',
    storageBucket: 'moropinzee.appspot.com',
    messagingSenderId: '650553619409'
};

firebase.initializeApp(config);

var database = firebase.database(),
    players,
    playerOneRef,
    playerTwoRef,
    currentPlayer;

// ? super secret function for debugging/testing purposes
const nuke = () => {
    console.log('nuke() ran');
    database.ref('players').remove();
};

// ? returns the number of active players
const activePlayers = () => {
    console.log('activePlayers() ran');
    database.ref('players').on('value', function (data) {
        if (data.val() !== null) {
            players = Object.keys(data.val()).length;
        } else players = 0;
    });
    return players;
};

// ? initializes game but first checks if game is full
// TODO swap out alert() for bootstrap modal
const init = () => {
    console.log('init() ran');
    if (players > 1) {
        console.log('2 or more players');
        console.log('~~~~~~~~~~~~~~~');
        alert('This game is full');
        $('#playerName').attr('disabled', 'true');
    } else {
        playerListener();
    }
};

// ? listen for new players
const playerListener = () => {
    $('#submitName').on('click', function () {
        let name = $('#playerName')
            .val()
            .trim();

        $('#playerName').val('');

        pushPlayer(name);
        showBoard();
        setBoard();
    });
};

// ? push new player to Database
const pushPlayer = name => {
    console.log('pushPlayer() ran');
    database.ref('players').push({
        name: name,
        choice: '',
        wins: 0,
        loses: 0
    });
};

// ? reveal board
const showBoard = () => {
    console.log('showBoard() ran');
    $('#hello').toggle(400);
    $('#gameBoard').toggle(400);
};

// ? set data-key's to keep track of players
const setKeys = () => {
    console.log('setKeys() ran');
    database.ref('players').on('child_added', function (snapshot) {
        var playerKey = snapshot.key;
        if ($('#playerOneArea').attr('data-key') !== undefined) {
            console.log('playerOne data-key already set. Setting playerTwo');
            console.log('~~~~~~~~~~~~~~~');
            $('#playerTwoArea').attr('data-key', playerKey);
            setPlayerRefs();
        } else {
            $('#playerOneArea').attr('data-key', playerKey);
        }
    });
};

// ? store player refs in variables
const setPlayerRefs = () => {
    console.log('setPlayerRefs() ran');
    console.log('~~~~~~~~~~~~~~~');
    let playerOneKey = $('#playerOneArea').attr('data-key');
    let playerTwoKey = $('#playerTwoArea').attr('data-key');
    playerOneRef = database.ref(`players/${playerOneKey}`);
    playerTwoRef = database.ref(`players/${playerTwoKey}`);
    currentPlayerRef = database.ref(`players/${currentPlayer}`);
};

// ? evaluate order of players
const setPlayers = () => {
    console.log('setPlayers() ran');
    console.log('~~~~~~~~~~~~~~~');
    if (players === 1) {
        playerOneRef.on('value', function (data) {
            let playerOne = data.val();
            $('#playerOneName').text(playerOne.name);
            currentPlayer = $('#playerOneArea').attr('data-key');
        });
        database.ref('players').on('value', function () {
            if (players > 1) {
                playerTwoRef.on('value', function (data) {
                    let playerTwo = data.val();
                    $('#playerTwoName').text(playerTwo.name);
                });
            }
        });
    } else {
        playerOneRef.on('value', function (data) {
            let playerOne = data.val();
            $('#playerOneName').text(playerOne.name);
        });
        playerTwoRef.on('value', function (data) {
            let playerTwo = data.val();
            $('#playerTwoName').text(playerTwo.name);
            currentPlayer = $('#playerTwoArea').attr('data-key');
            setPlayerRefs();
        });
    }
};

// ? determines which player gets to see buttons
const setButtons = () => {
    if ($('#playerOneArea').attr('data-key') !== currentPlayer) {
        console.log('playerTwo is the current player, generating play buttons');
        console.log('~~~~~~~~~~~~~~~');
        renderButtons(`playerTwo`);
    } else {
        console.log('playerOne is the current player, generating play buttons');
        console.log('~~~~~~~~~~~~~~~');
        renderButtons(`playerOne`);
    }
};

// ? dynamically create control buttons only current player sees
const renderButtons = player => {
    let moves = ['monkey', 'robot', 'pirate', 'ninja', 'zombie'];
    let buttonArea = $('<div>').attr('id', `${player}Buttons`);
    $(`#${player}Area .card-text`).append(buttonArea);
    $.each(moves, function (idx, val) {
        let button = $('<button>')
            .addClass('btn bg-primary text-white')
            .attr('data-play', val)
            .text(val);
        $(`#${player}Buttons`).append(button);
    });
};

// ? sets game board for turn
const setBoard = () => {
    console.log('setBoard() ran');
    setKeys();
    setPlayerRefs();
    setPlayers();
    setButtons();
    resultsMessage();
    buttonListener();
    choiceCheck();
};

// ? updates the results area
const resultsMessage = () => {
    let msg = $('#resultsMessage');
    database.ref('players').on('value', function (data) {
        if (players === 1) {
            msg.text('Waiting for Player Two to join.');
        } else {
            msg.text(
                'Turn started! Waiting for players to make their selections!'
            );
        }
    });
};

// * Turn Logic
// * 1. Listen for play button clicks
// * 2. compare choices and decide winner
const buttonListener = () => {
    // TODO don't listen for button clicks until turn starts
    $('.card-text button').on('click', function () {
        if (!$(this).hasClass('choice')) {
            $(this).addClass('choice');
            let choice = $(this).attr('data-play');
            currentPlayerRef.update({
                choice: choice
            });
        }
        $('.card-text button').each(function (i) {
            $(this).attr('disabled', 'true');
        });
    });
};

const choiceCheck = () => {
    console.log(`choiceCheck() ran`);
    let count = 0;
    database.ref('players').on('child_changed', function () {
        playerOneRef.on('value', function (d) {
            let data = d.val();
            if (data.choice.length > 0) {
                count++;
            }
        });
        playerTwoRef.on('value', function (d) {
            let data = d.val();
            if (data.choice.length > 0) {
                count++;
            }
        });
        if (count > 2) {
            count = 0;
            getChoices();
        } else {
            console.log(`Ready count: ${count}`);
            console.log('Both players have not chosen!');
        }
    });
};

// TODO run compareChoice() when both players have chosen.
const compareChoices = (a, b) => {
    console.log(`compareChoices() ran`);
    console.log(`Comparing: ${a} and ${b}`);
    // TODO update wins/losses
    let cry,
        msg = $('#resultsMessage');
    console.log(`I'm about to go in the switch`);
    switch (a) {
        case 'monkey':
            cry = 'Ee-ee-eek!';
            if (b === 'robot') msg.text(`${cry} Monkey unplugs Robot`);
            if (b === 'pirate') msg.text(`${cry} Pirate skewers Monkey`);
            if (b === 'ninja') msg.text(`${cry} Monkey fools Ninja`);
            if (b === 'zombie') msg.text(`${cry} Zombie savages Monkey`);
            if (a === b) msg.text(`Gasp! It's a tie!`);
            break;
        case 'robot':
            cry = 'Ex-ter-min-ate!';
            if (b === 'monkey') msg.text(`${cry} Monkey unplugs Robot`);
            if (b === 'pirate') msg.text(`${cry} Pirate skewers Monkey`);
            if (b === 'ninja') msg.text(`${cry} Robot chokes Ninja!`);
            if (b === 'zombie') msg.text(`${cry} Zombie savages Monkey`);
            if (a === b) msg.text(`Gasp! It's a tie!`);
            break;
        case 'pirate':
            cry = 'Arrrr!';
            if (b === 'monkey') msg.text(`${cry} Pirate skewers Monkey`);
            if (b === 'robot') msg.text(`${cry} Pirate drowns Robot`);
            if (b === 'ninja') msg.text(`${cry} Ninja karate chops Pirate`);
            if (a === b) msg.text(`Gasp! It's a tie!`);
        case 'ninja':
            cry = 'Keee-ah!';
            if (b === 'monkey') msg.text(`${cry} Monkey fools Ninja`);
            if (b === 'robot') msg.text(`${cry} Robot chokes Ninja`);
            if (b === 'pirate') msg.text(`${cry} Ninja karate chops Pirate`);
            if (b === 'zombie') msg.text(`${cry} Ninja decapitates Zombie`);
            if (a === b) msg.text(`Gasp! It's a tie!`);
            break;
        case 'zombie':
            cry = 'Braaaaaaaaaainsss!';
            if (b === 'monkey') msg.text(`${cry} Zombie savages Monkey`);
            if (b === 'robot') msg.text(`${cry} Robot crushes Zombie`);
            if (b === 'pirate') msg.text(`${cry} Zombie eats Pirate`);
            if (b === 'ninja') msg.text(`${cry} Ninja decapitates Zombie`);
            if (a === b) msg.text(`Gasp! It's a tie!`);
            break;
    }
};

const getChoices = () => {
    console.log(`getChoices() ran`);
    let playerOneChoice, playerTwoChoice;

    playerOneRef.on('value', function (d) {
        let data = d.val();
        playerOneChoice = data.choice;
        console.log(`Player One chose ${playerOneChoice}`);
    });

    playerTwoRef.on('value', function (d) {
        let data = d.val();
        playerTwoChoice = data.choice;
        console.log(`Player Two chose ${playerTwoChoice}`);
    });

    compareChoices(playerOneChoice, playerTwoChoice);
};

// ! BUG
// ! compareChoices() doesn't run the switch statement unless you run getChoices() again manually in the console.

// ! THIS DOES NOT WORK :(
// ! const disconnectListener = () => {
// !
// !    playerOneRef.onDisconnect().remove();
// !    playerTwoRef.onDisconnect().remove();
// ! };


/*

* ========== PSUEDOCODE ==========

TODO Points/Turns

? Distribute win/loss points in compareChoices()
? Once points were evaluated, run setBoard() again to start next turn. Best out of 7 wins the game?

TODO Chat
? Use jQuery to grab message from form input
? Use currentPlayer and data-key attribute to determine who typed message
? Push input value and currentPlayer data-key to new Firebase .ref("messages").
? Render message history similar to our class's Employee Timesheet exercise.

*/

$(function () {
    activePlayers();
    $('#play').on('click', function () {
        init();
        $('.name-form').toggle(400);
        $(this).toggle(400);
    });
});