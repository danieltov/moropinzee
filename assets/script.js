/*
-   Only two users can play at the same time.

    Initial load.

    Check if there are any players.
    activePlayers() // returns active players.
    if activePlayers returns 2, show message that says max players currently playing.
    else, allow player to join game by typing name in the field.

        Push player name into database/player node.
        Player Node example:
            {
                name: 'Johnny Appleseed',
                choice: 'monkey',
                wins: 1000,
                losses: 0
        }
    populate game board with player info.
    if first player, wait for second player. 

    once activePlayers() returns 2, begin turn.




////////////////////////////////////////////////////////////////

--- Gameplay logic

    - The game will track each player's wins and losses.
        - Compare the user choices and decide a winner.
        - Add win/loss count to user

////////////////////////////////////////////////////////////////

    - Throw some chat functionality in there! 
    ---- save text input to firebase db (*set*), and *append* to html with jQuery. that way even tho firebase replaces value with every message, the text is appended. for security reasons, chat is not saved locally or remotely. lol

    */

// Initialize Firebase
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
    playerTwoRef;

const playerListener = () => {
    $('#submitName').on('click', function() {
        let name = $('#playerName')
            .val()
            .trim();
        $('#playerName').val('');

        // showBoard()
        $('#hello').toggle(400);
        $('#gameBoard').toggle(400);

        // pushPlayer()
        database.ref('players').push({
            name: name,
            choice: '',
            wins: 0,
            loses: 0
        });
        setBoard();
    });
};

const nuke = () => {
    console.log('nuke() ran');
    database.ref().set(null);
};

const activePlayers = () => {
    console.log('activePlayers() ran');
    database.ref('players').on('value', function(data) {
        players = Object.keys(data.val()).length; // returns length of players object.
    });
    return players; // returns how many players active
};

const init = () => {
    console.log('init() ran');
    if (players > 1) {
        console.log('2 or more players');
        alert('This game is full');
        $('#playerName').attr('disabled', 'true');
    } else {
        playerListener();
    }
};

const setKeys = () => {
    console.log('setKeys() ran');
    database.ref('players').on('child_added', function(snapshot) {
        var playerKey = snapshot.key;
        // set playerKeys
        if ($('#playerOne').attr('data-key') !== undefined) {
            $('#playerTwo').attr('data-key', playerKey);
        } else {
            $('#playerOne').attr('data-key', playerKey);
        }
    });
};

const whosPlaying = () => {
    console.log('whosPlaying() ran');
    let playerOneKey = $('#playerOne').attr('data-key');
    let playerTwoKey = $('#playerTwo').attr('data-key');
    playerOneRef = database.ref(`players/${playerOneKey}`);
    playerTwoRef = database.ref(`players/${playerTwoKey}`);
};

const setPlayers = () => {
    console.log('setPlayers() ran');
    playerOneRef.on('value', function(data) {
        let playerOne = data.val();
        $('#playerOne').text(playerOne.name);
    });
    playerTwoRef.on('value', function(data) {
        let playerTwo = data.val();
        $('#playerTwo').text(playerTwo.name);
    });
};

const disconnectListener = () => {
    playerOneRef.onDisconnect().remove();
    playerTwoRef.onDisconnect().remove();
};

const showBoard = () => {
    console.log('showBoard() ran');
    $('#hello').toggle(400);
    $('#gameBoard').toggle(400);
};

const setBoard = () => {
    setKeys();
    whosPlaying();
    setPlayers();
    disconnectListener();
};

$(function() {
    activePlayers();
    $('#play').on('click', function() {
        init();
        $('.name-form').toggle(400);
        $(this).toggle(400);
    });
});
