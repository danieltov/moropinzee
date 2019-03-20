/*
-   Only two users can play at the same time.

    Initial load.
    A player is added only when user enters their name. 
        Push player name into database/player node.
        Player Node example:
            {
                name: 'Johnny Appleseed',
                choice: 'monkey',
                wins: 1000,
                losses: 0
        }
    Game doesn't start until there are two players (database/player.length === 2?)    


////////////////////////////////////////////////////////////////

--- Gameplay logic

    - Once connected, begin Turn. (Turn++) Both players will pick either 'monkey', 'pirate', 'robot', 'ninja', or 'zombie'. 

            Monkey

            Monkey fools Ninja
            Monkey unplugs Robot

        Suggested noise: ee-ee-eek!

            Robot chokes Ninja
            Robot crushes Zombie

        Suggested noise: ex-ter-min-ate!

            Pirate drowns Robot
            Pirate skewers Monkey

        Suggested noise: arrrrr!

            Ninja karate chops Pirate
            Ninja decapitates Zombie

        Suggested noise: keeee-ah!

            Zombie eats Pirate
            Zombie savages Monkey

        Suggested noise: braaaaaaaaaainsss!

////////////////////////////////////////////////////////////////

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

var database = firebase.database();

$(function() {
    $('#submitName').on('click', function() {
        let name = $('#playerName')
            .val()
            .trim();
        $('#playerName').val('');
        $('#playerOne').text(name);

        $('#hello').toggle(400);
        $('#gameBoard').toggle(400);

        database.ref('players').push({
            name: name,
            choice: '',
            wins: 0,
            loses: 0
        });
        // learn how to reference back to child key/ID.
    });
});
