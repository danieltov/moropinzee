/*
-   Only two users can play at the same time.
--- Look up how to limit users with Firebase.

////////////////////////////////////////////////////////////////

--- Gameplay logic

    - Both players pick either 'monkey', 'pirate', 'robot', 'ninja', or 'zombie'. 

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
