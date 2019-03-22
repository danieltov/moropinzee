/*

////////////////////////////////////////////////////////////////

--- Gameplay logic

    - The game will track each player's wins and losses.
        - Compare the user choices and decide a winner.
        - Add win/loss count to user

////////////////////////////////////////////////////////////////

    - Throw some chat functionality in there! 
    ---- save text input to firebase db (*set*), and *append* to html with jQuery. that way even tho firebase replaces value with every message, the text is appended. for security reasons, chat is not saved locally or remotely. lol
    

*/

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

const nuke = () => {
    console.log('nuke() ran');
    database.ref('players').remove();
};

const activePlayers = () => {
    console.log('activePlayers() ran');
    database.ref('players').on('value', function(data) {
        if (data.val() !== null) {
            players = Object.keys(data.val()).length;
        } else players = 0;
    });
    return players;
};

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

const playerListener = () => {
    $('#submitName').on('click', function() {
        let name = $('#playerName')
            .val()
            .trim();

        $('#playerName').val('');

        pushPlayer(name);
        showBoard();
        setBoard();
    });
};

const pushPlayer = name => {
    console.log('pushPlayer() ran');
    database.ref('players').push({
        name: name,
        choice: '',
        wins: 0,
        loses: 0
    });
};

const showBoard = () => {
    console.log('showBoard() ran');
    $('#hello').toggle(400);
    $('#gameBoard').toggle(400);
};

const setKeys = () => {
    console.log('setKeys() ran');
    database.ref('players').on('child_added', function(snapshot) {
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

const setPlayerRefs = () => {
    console.log('setPlayerRefs() ran');
    console.log('~~~~~~~~~~~~~~~');
    let playerOneKey = $('#playerOneArea').attr('data-key');
    let playerTwoKey = $('#playerTwoArea').attr('data-key');
    playerOneRef = database.ref(`players/${playerOneKey}`);
    playerTwoRef = database.ref(`players/${playerTwoKey}`);
};

const setPlayers = () => {
    console.log('setPlayers() ran');
    console.log('~~~~~~~~~~~~~~~');
    if (players === 1) {
        playerOneRef.on('value', function(data) {
            let playerOne = data.val();
            $('#playerOneName').text(playerOne.name);
            currentPlayer = $('#playerOneArea').attr('data-key');
        });
        database.ref('players').on('value', function() {
            if (players > 1) {
                playerTwoRef.on('value', function(data) {
                    let playerTwo = data.val();
                    $('#playerTwoName').text(playerTwo.name);
                });
            }
        });
    } else {
        playerOneRef.on('value', function(data) {
            let playerOne = data.val();
            $('#playerOneName').text(playerOne.name);
        });
        playerTwoRef.on('value', function(data) {
            let playerTwo = data.val();
            $('#playerTwoName').text(playerTwo.name);
            currentPlayer = $('#playerTwoArea').attr('data-key');
        });
    }
};

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

const renderButtons = player => {
    let moves = ['monkey', 'robot', 'pirate', 'ninja', 'zombie'];
    let buttonArea = $('<div>').attr('id', `${player}Buttons`);
    $(`#${player}Area .card-text`).append(buttonArea);
    $.each(moves, function(idx, val) {
        let button = $('<button>')
            .addClass('btn bg-primary text-white')
            .attr('data-play', val)
            .text(val);
        $(`#${player}Buttons`).append(button);
    });
};

const setBoard = () => {
    console.log('setBoard() ran');
    setKeys();
    setPlayerRefs();
    setPlayers();
    setButtons();
    resultsMessage();
};

const resultsMessage = () => {
    let msg = $('#resultsMessage');
    database.ref('players').on('value', function(data) {
        if (players === 1) {
            msg.text('Waiting for Player Two to join.');
        } else {
            msg.text('Waiting for players to make their selections!');
        }
    });
};

// ! THIS DOES NOT WORK
// ! const disconnectListener = () => {
// !
// !    playerOneRef.onDisconnect().remove();
// !    playerTwoRef.onDisconnect().remove();
// ! };

$(function() {
    activePlayers();
    $('#play').on('click', function() {
        init();
        $('.name-form').toggle(400);
        $(this).toggle(400);
    });
});
