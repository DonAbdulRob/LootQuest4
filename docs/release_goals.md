# LootQuest3 Release Goals:

Document containing todo items sorted by priority.

## TODO - HIGH PRIO (Volitile scope creeping changes)

Empty! Everything is PLANNED!

## TODO - Short Term:

Next Update: "The Server Update"
LootQuest will be moving to a server-managed game experience for multiplayer support, better save management, etc... PWA when?

- Multiplayer II - Server Supported Chat
   - Add ts support to back-end. +
   - Refactor console window to have an input at the bottom that can be typed into. +
   - Allow console input to be 'submitted', sending to the back-end.
   - Have socket.io publish console submissions to all other clients.
   - Verify any browser tab can contribute to console chatting.
- Multiplayer III - Player Awareness
   - Allow players to view state of each other in new 'Party' window. (Exploring, etc.)
      - Should show the area name and current activity.
- Multiplayer IV - Multi-player Combat
   - When a player is in the same area as another player, offer to let the player 'join the fight'.
   - Refactor combat to allow for more than one player. All players will go first and take turns in order, then monsters.
   - Need to ensure that data between players and monsters is tracked on the back-end and sent to players as updates are made. This will require moving data to back-end service.
- Database Persistance I - Save Management
   - Change save feature to let players 'save to account slot'.
      - Choose a database service and setup an account.
      - Link backend to database service.
      - Change front-end ui to allow users to save to slots.
   - Change load feature to allow players to 'load from account slot'.
      - Change back-end UI to allow players to load from slots.
- Database II - Account Management
   - Create login feature with username and password as new main screen.
   - Upon logging in, user can load saves, start an adventure, etc.
   - Prevent multiplayer players from being logged in at the same time. (This will ensure that players can't select same cahracter twice).

## TODO - Mid Term:

N/A for now.