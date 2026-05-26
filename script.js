let pristinePieces = null; // Stored pristine layout for restarts
let socket = null;
let currentRoomId = null;

if (typeof io !== 'undefined') {
  // Connect to live server (change to your deployed Render HTTPS URL when you upload it online)
  socket = io("https://chess-fps-server.onrender.com"); 
}

let main = {

  variables: {
    turn: 'w',
    selectedpiece: '',
    highlighted: [],
    lastDoubleStepPawn: '', 
    playerSide: 'w', // 'w' or 'b'
    multiplayerMode: false, // Flag to switch offline/online modes
    history: [], // Stores snapshotted game states
    historyIndex: -1, // Current active state in history
    activeCombat: null, // Stores target combat info during mini-game
    fpsTargetInterval: null, // Moving interval for shooter target
    fpsAnimationId: null, // requestAnimationFrame ID for shooter countdown
    pieces: {
      w_king: {
        position: '5_1',
        img: '&#9818;',
        captured: false,
        moved: false,
        type: 'w_king'
      },
      w_queen: {
        position: '4_1',
        img: '&#9819;',
        captured: false,
        moved: false,
        type: 'w_queen'
      },
      w_bishop1: {
        position: '3_1',
        img: '&#9821;',
        captured: false,
        moved: false,
        type: 'w_bishop'
      },
      w_bishop2: {
        position: '6_1',
        img: '&#9821;',
        captured: false,
        moved: false,
        type: 'w_bishop'
      },
      w_knight1: {
        position: '2_1',
        img: '&#9822;',
        captured: false,
        moved: false,
        type: 'w_knight'
      },
      w_knight2: {
        position: '7_1',
        img: '&#9822;',
        captured: false,
        moved: false,
        type: 'w_knight'
      },
      w_rook1: {
        position: '1_1',
        img: '&#9820;',
        captured: false,
        moved: false,
        type: 'w_rook'
      },
      w_rook2: {
        position: '8_1',
        img: '&#9820;',
        captured: false,
        moved: false,
        type: 'w_rook'
      },
      w_pawn1: {
        position: '1_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn2: {
        position: '2_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn3: {
        position: '3_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn4: {
        position: '4_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn5: {
        position: '5_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn6: {
        position: '6_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn7: {
        position: '7_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },
      w_pawn8: {
        position: '8_2',
        img: '&#9823;',
        captured: false,
        type: 'w_pawn',
        moved: false
      },

      b_king: {
        position: '5_8',
        img: '&#9818;',
        captured: false,
        moved: false,
        type: 'b_king'
      },
      b_queen: {
        position: '4_8',
        img: '&#9819;',
        captured: false,
        moved: false,
        type: 'b_queen'
      },
      b_bishop1: {
        position: '3_8',
        img: '&#9821;',
        captured: false,
        moved: false,
        type: 'b_bishop'
      },
      b_bishop2: {
        position: '6_8',
        img: '&#9821;',
        captured: false,
        moved: false,
        type: 'b_bishop'
      },
      b_knight1: {
        position: '2_8',
        img: '&#9822;',
        captured: false,
        moved: false,
        type: 'b_knight'
      },
      b_knight2: {
        position: '7_8',
        img: '&#9822;',
        captured: false,
        moved: false,
        type: 'b_knight'
      },
      b_rook1: {
        position: '1_8',
        img: '&#9820;',
        captured: false,
        moved: false,
        type: 'b_rook'
      },
      b_rook2: {
        position: '8_8',
        img: '&#9820;',
        captured: false,
        moved: false,
        type: 'b_rook'
      },
      b_pawn1: {
        position: '1_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn2: {
        position: '2_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn3: {
        position: '3_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn4: {
        position: '4_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn5: {
        position: '5_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn6: {
        position: '6_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn7: {
        position: '7_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      },
      b_pawn8: {
        position: '8_7',
        img: '&#9823;',
        captured: false,
        type: 'b_pawn',
        moved: false
      }
    }
  },

  methods: {
    gamesetup: function() {
      $('.gamecell').attr('chess', 'null');
      $('.gamecell').attr('piece-type', 'null');
      $('.gamecell').removeClass('checked-highlight');
      $('.gamecell').html('');
      for (let gamepiece in main.variables.pieces) {
        if (!main.variables.pieces[gamepiece].captured) {
          let pos = main.variables.pieces[gamepiece].position;
          $('#' + pos).html(main.variables.pieces[gamepiece].img);
          $('#' + pos).attr('chess', gamepiece);
          $('#' + pos).attr('piece-type', main.variables.pieces[gamepiece].type);
        }
      }

      // Highlight checked kings safely
      if (main.methods.isKingInCheck) {
        if (!main.variables.pieces['w_king'].captured && main.methods.isKingInCheck('w')) {
          let pos = main.variables.pieces['w_king'].position;
          $('#' + pos).addClass('checked-highlight');
        }
        if (!main.variables.pieces['b_king'].captured && main.methods.isKingInCheck('b')) {
          let pos = main.variables.pieces['b_king'].position;
          $('#' + pos).addClass('checked-highlight');
        }
      }
    },

    // Verify and execute Pawn Promotions with piece selection overlay
    checkPawnPromotion: function(pieceName, onComplete) {
      let piece = main.variables.pieces[pieceName];
      if (piece && piece.type.endsWith('pawn')) {
        let y = parseInt(piece.position.split('_')[1]);
        let color = piece.type.slice(0, 1);
        if ((color === 'w' && y === 8) || (color === 'b' && y === 1)) {
          
          // In multiplayer, check if this is the opponent's pawn promoting.
          // The opponent's screen will wait for the socket sync move packet.
          if (main.variables.multiplayerMode && main.variables.playerSide !== color) {
            $('#turn').html((color === 'w' ? 'WHITE' : 'BLACK') + ' IS PROMOTING A PAWN...');
            return true;
          }

          // Show promotion choice overlay
          $('#promotion-overlay').fadeIn(150);
          $('.gamecell').off('click'); // Temporarily disable cell clicks

          let piecesMap = {
            'queen': { type: color + '_queen', img: '&#9819;' },
            'rook': { type: color + '_rook', img: '&#9820;' },
            'bishop': { type: color + '_bishop', img: '&#9821;' },
            'knight': { type: color + '_knight', img: '&#9822;' }
          };

          // Re-bind overlay buttons
          $('#promote-queen').off('click').click(function() {
            piece.type = piecesMap['queen'].type;
            piece.img = piecesMap['queen'].img;
            $('#promotion-overlay').fadeOut(150);
            $('.gamecell').off('click').click(main.methods.handleCellClick);
            onComplete();
          });

          $('#promote-rook').off('click').click(function() {
            piece.type = piecesMap['rook'].type;
            piece.img = piecesMap['rook'].img;
            $('#promotion-overlay').fadeOut(150);
            $('.gamecell').off('click').click(main.methods.handleCellClick);
            onComplete();
          });

          $('#promote-bishop').off('click').click(function() {
            piece.type = piecesMap['bishop'].type;
            piece.img = piecesMap['bishop'].img;
            $('#promotion-overlay').fadeOut(150);
            $('.gamecell').off('click').click(main.methods.handleCellClick);
            onComplete();
          });

          $('#promote-knight').off('click').click(function() {
            piece.type = piecesMap['knight'].type;
            piece.img = piecesMap['knight'].img;
            $('#promotion-overlay').fadeOut(150);
            $('.gamecell').off('click').click(main.methods.handleCellClick);
            onComplete();
          });

          return true;
        }
      }
      return false;
    },

    // Premium Game Over overlay trigger
    triggerGameOver: function(message) {
      $('#game-over-desc').text(message);
      $('.gamecell').off('click');
      $('#fps-overlay').hide();
      $('#defender-choice-overlay').hide();
      $('#game-over-overlay').fadeIn(150);
    },

    // Save history snapshot
    saveHistoryState: function() {
      if (main.variables.historyIndex < main.variables.history.length - 1) {
        main.variables.history = main.variables.history.slice(0, main.variables.historyIndex + 1);
      }

      let snapshot = {
        pieces: JSON.parse(JSON.stringify(main.variables.pieces)),
        turn: main.variables.turn,
        lastDoubleStepPawn: main.variables.lastDoubleStepPawn
      };

      main.variables.history.push(snapshot);
      main.variables.historyIndex++;
      main.methods.updateHistoryButtons();
    },

    // Update Back & Forward button states
    updateHistoryButtons: function() {
      $('#btn-back').prop('disabled', main.variables.historyIndex <= 0);
      $('#btn-forward').prop('disabled', main.variables.historyIndex >= main.variables.history.length - 1);
    },

    // Load snapshot at specific history index
    loadHistoryState: function(index) {
      if (index < 0 || index >= main.variables.history.length) return;
      main.variables.historyIndex = index;
      
      let state = main.variables.history[index];
      main.variables.turn = state.turn;
      main.variables.lastDoubleStepPawn = state.lastDoubleStepPawn;
      main.variables.pieces = JSON.parse(JSON.stringify(state.pieces));
      
      // Reset highlights and re-render board
      $('.gamecell').html('');
      $('.gamecell').attr('chess', 'null');
      $('.gamecell').removeClass('selected-highlight green');
      main.variables.selectedpiece = '';
      main.variables.highlighted = [];

      main.methods.gamesetup();

      let turnName = (main.variables.turn === 'w') ? "WHITE'S" : "BLACK'S";
      $('#turn').html("IT'S " + turnName + " TURN");
      main.methods.updateHistoryButtons();
    },

    // Initialize side selection match
    startMatch: function(side) {
      main.variables.playerSide = side;
      if (side === 'b') {
        $('#game').addClass('flipped');
      } else {
        $('#game').removeClass('flipped');
      }
      
      $('#side-select-overlay').fadeOut(300);

      // Handle UI controls depending on match type mode
      if (main.variables.multiplayerMode) {
        $('#btn-back, #btn-forward, #btn-restart').hide();
        $('#btn-resign').show().prop('disabled', false);
      } else {
        $('#btn-back, #btn-forward, #btn-restart').show();
        $('#btn-resign').hide();
      }

      // Re-enable click listener
      $('.gamecell').off('click').click(main.methods.handleCellClick);

      // Pristine state variables reset
      main.variables.pieces = JSON.parse(JSON.stringify(pristinePieces));
      main.variables.turn = 'w';
      main.variables.selectedpiece = '';
      main.variables.highlighted = [];
      main.variables.lastDoubleStepPawn = '';
      main.variables.history = [];
      main.variables.historyIndex = -1;

      $('.gamecell').removeClass('selected-highlight green');
      
      main.methods.gamesetup();
      main.methods.saveHistoryState(); // Initial board snapshot

      $('#turn').html("IT'S WHITES TURN");
      $('#turn').addClass('turnhighlight');
      window.setTimeout(function(){
        $('#turn').removeClass('turnhighlight');
      }, 1500);
    },

    // Return to choose-side screen
    restartGame: function() {
      $('.gamecell').off('click'); // Disable moves during selection
      
      main.variables.pieces = JSON.parse(JSON.stringify(pristinePieces));
      main.variables.turn = 'w';
      main.variables.selectedpiece = '';
      main.variables.highlighted = [];
      main.variables.lastDoubleStepPawn = '';
      main.variables.history = [];
      main.variables.historyIndex = -1;

      $('#game').removeClass('flipped');
      $('.gamecell').removeClass('selected-highlight green');
      
      main.methods.gamesetup();
      main.methods.updateHistoryButtons();

      // Show back & forward controls bar
      $('#btn-back, #btn-forward, #btn-restart').show();
      $('#btn-resign').hide();

      $('#side-select-overlay').fadeIn(300);
      $('#turn').html("CHOOSE A SIDE TO START");
    },

    // Resign multiplayer match
    resignMatch: function(isRelayed) {
      let opponentColor = (main.variables.playerSide === 'w') ? 'BLACK' : 'WHITE';
      
      // If locally initiated, emit event to opponent
      if (socket && main.variables.multiplayerMode && currentRoomId && !isRelayed) {
        socket.emit('playerResigned', { roomId: currentRoomId });
      }

      if (!isRelayed) {
        main.methods.triggerGameOver('You have resigned from the match! ' + opponentColor + ' wins.');
      } else {
        main.methods.triggerGameOver('Your opponent has resigned! You win!');
      }

      $('#turn').html('MATCH OVER! ' + opponentColor + ' WINS BY RESIGNATION');
      $('.gamecell').off('click');
      $('#btn-resign').prop('disabled', true);

      // Present custom restart button even in multiplayer so they can play again
      $('#btn-restart').show();
    },

    // 1. Synthesize Retro Gunshot Sound
    playGunshotSound: function() {
      try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        let ctx = new AudioContext();
        
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch(e) {}
    },

    // 2. Synthesize Target Hit Impact Sound
    playImpactSound: function() {
      try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        let ctx = new AudioContext();
        
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch(e) {}
    },

    // 3. Synthesize Failure Sound
    playFailureSound: function() {
      try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        let ctx = new AudioContext();
        
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch(e) {}
    },

    // 4. Start FPS Engagement Mini-game
    startFPSMiniGame: function(attacker, defender, attackerPos, defenderPos, isRelayed) {
      main.variables.activeCombat = {
        attacker: attacker,
        defender: defender,
        attackerPos: attackerPos,
        defenderPos: defenderPos
      };

      // Emit trigger to opponent in multiplayer mode
      if (socket && main.variables.multiplayerMode && currentRoomId && !isRelayed) {
        socket.emit('startCombat', {
          roomId: currentRoomId,
          attacker: attacker,
          defender: defender,
          attackerPos: attackerPos,
          defenderPos: defenderPos
        });
      }

      // Set target piece graphic dynamically
      $('#fps-target').attr('chess', defender);

      // Disable grid click events during active shooter overlay
      $('.gamecell').off('click');

      // Clear highlights immediately
      $('.gamecell').removeClass('selected-highlight');
      main.methods.togglehighlight(main.variables.highlighted);

      // Render overlay
      $('#fps-overlay').fadeIn(150);

      // Move target instantly to initiate pathing glide
      main.methods.moveFPSTarget();

      // Begin interval to slide target drone around
      main.variables.fpsTargetInterval = setInterval(main.methods.moveFPSTarget, 480);

      // 3.00s High resolution countdown via requestAnimationFrame
      let startTime = performance.now();
      let duration = 3000; 

      function updateCountdown() {
        if (!main.variables.activeCombat) return; // Halt if successfully captured already
        
        let elapsed = performance.now() - startTime;
        let remaining = Math.max(0, duration - elapsed);
        let seconds = (remaining / 1000).toFixed(2);
        
        $('#fps-countdown').html(seconds);

        if (remaining <= 0) {
          // Game Over: Player timed out!
          main.methods.resolveCombat(false);
        } else {
          main.variables.fpsAnimationId = requestAnimationFrame(updateCountdown);
        }
      }

      main.variables.fpsAnimationId = requestAnimationFrame(updateCountdown);
    },

    // Move target randomly inside arena
    moveFPSTarget: function() {
      let x = Math.floor(Math.random() * 82); 
      let y = Math.floor(Math.random() * 78); 
      $('#fps-target').css({ top: y + '%', left: x + '%' });
    },

    // Resolve Combat Engagement Outcomes
    resolveCombat: function(success, isRelayed) {
      clearInterval(main.variables.fpsTargetInterval);
      cancelAnimationFrame(main.variables.fpsAnimationId);

      let combat = main.variables.activeCombat;
      if (!combat) return;
      main.variables.activeCombat = null;

      // Relays combat outcome to opponent in multiplayer mode
      if (socket && main.variables.multiplayerMode && currentRoomId && !isRelayed) {
        socket.emit('resolveCombatSync', {
          roomId: currentRoomId,
          success: success
        });
      }

      $('#fps-overlay').fadeOut(150);

      if (success) {
        // Success: Attacker captures defender
        main.methods.playImpactSound();
        
        $('#' + combat.defenderPos).html(main.variables.pieces[combat.attacker].img);
        $('#' + combat.defenderPos).attr('chess', combat.attacker);
        $('#' + combat.attackerPos).html('');
        $('#' + combat.attackerPos).attr('chess', 'null');
        
        main.variables.pieces[combat.attacker].position = combat.defenderPos;
        main.variables.pieces[combat.attacker].moved = true;
        main.variables.pieces[combat.defender].captured = true;

        // Clear defender's actual cell if it's en passant (since defender was not on defenderPos)
        let isPawn = main.variables.pieces[combat.attacker].type.endsWith('pawn');
        let from_x = parseInt(combat.attackerPos.split('_')[0]);
        let to_x = parseInt(combat.defenderPos.split('_')[0]);
        if (isPawn && from_x !== to_x) {
          let epPos = to_x + '_' + combat.attackerPos.split('_')[1];
          $('#' + epPos).html('');
          $('#' + epPos).attr('chess', 'null');
        }
        
        main.variables.lastDoubleStepPawn = ''; // Clear EP pawn tracking

        // Re-bind grid click events
        $('.gamecell').off('click').click(main.methods.handleCellClick);
        main.variables.selectedpiece = '';
        main.variables.highlighted = [];

        // Check if King was captured
        if (main.variables.pieces['w_king'].captured) {
          $('#turn').html('COMBAT CAPTURE! BLACK WINS!');
          main.methods.triggerGameOver('White King was captured in combat! Black wins.');
          return;
        }
        if (main.variables.pieces['b_king'].captured) {
          $('#turn').html('COMBAT CAPTURE! WHITE WINS!');
          main.methods.triggerGameOver('Black King was captured in combat! White wins.');
          return;
        }

        // Pawn promotion check
        if (!main.methods.checkPawnPromotion(combat.attacker, main.methods.endturn)) {
          main.methods.endturn();
        }

      } else {
        // Failure: Attacker gets eaten by defender!
        main.methods.playFailureSound();
        
        main.variables.pieces[combat.attacker].captured = true;
        $('#' + combat.attackerPos).html('');
        $('#' + combat.attackerPos).attr('chess', 'null');

        let defenderCurrentPos = main.variables.pieces[combat.defender].position;

        // Re-bind grid click events
        $('.gamecell').off('click').click(main.methods.handleCellClick);
        main.variables.selectedpiece = '';
        main.variables.highlighted = [];

        // Check if King was captured
        if (main.variables.pieces['w_king'].captured) {
          $('#turn').html('COMBAT CAPTURE! BLACK WINS!');
          main.methods.triggerGameOver('White King was captured in combat! Black wins.');
          return;
        }
        if (main.variables.pieces['b_king'].captured) {
          $('#turn').html('COMBAT CAPTURE! WHITE WINS!');
          main.methods.triggerGameOver('Black King was captured in combat! White wins.');
          return;
        }

        // Show defender choice overlay based on multiplayer / side
        if (main.variables.multiplayerMode) {
          let defenderColor = combat.defender.charAt(0);
          if (main.variables.playerSide === defenderColor) {
            // We are the defender: bind click handlers and show the choice overlay
            $('#btn-defender-stay').off('click').click(function() {
              $('#defender-choice-overlay').fadeOut(150);
              main.methods.endturn();
            });

            $('#btn-defender-counter').off('click').click(function() {
              // Move the defender to the attacker's original position
              $('#' + defenderCurrentPos).html('');
              $('#' + defenderCurrentPos).attr('chess', 'null');

              $('#' + combat.attackerPos).html(main.variables.pieces[combat.defender].img);
              $('#' + combat.attackerPos).attr('chess', combat.defender);

              main.variables.pieces[combat.defender].position = combat.attackerPos;
              main.variables.pieces[combat.defender].moved = true;

              if (!main.methods.checkPawnPromotion(combat.defender, function() {
                $('#defender-choice-overlay').fadeOut(150);
                main.methods.endturn();
              })) {
                $('#defender-choice-overlay').fadeOut(150);
                main.methods.endturn();
              }
            });

            $('#defender-choice-overlay').fadeIn(150);
          } else {
            // We are the attacker: we just wait for defender's decision
            $('#turn').html("ATTACK FAILED! Waiting for defender's counter...");
            // Do not show overlay
          }
        } else {
          // Local Pass & Play mode: show overlay for the player sitting at the screen
          $('#btn-defender-stay').off('click').click(function() {
            $('#defender-choice-overlay').fadeOut(150);
            main.methods.endturn();
          });

          $('#btn-defender-counter').off('click').click(function() {
            // Move the defender to the attacker's original position
            $('#' + defenderCurrentPos).html('');
            $('#' + defenderCurrentPos).attr('chess', 'null');

            $('#' + combat.attackerPos).html(main.variables.pieces[combat.defender].img);
            $('#' + combat.attackerPos).attr('chess', combat.defender);

            main.variables.pieces[combat.defender].position = combat.attackerPos;
            main.variables.pieces[combat.defender].moved = true;

            if (!main.methods.checkPawnPromotion(combat.defender, function() {
              $('#defender-choice-overlay').fadeOut(150);
              main.methods.endturn();
            })) {
              $('#defender-choice-overlay').fadeOut(150);
              main.methods.endturn();
            }
          });

          $('#defender-choice-overlay').fadeIn(150);
        }
      }
    },

    // Pseudo-legal moves generation
    getPseudoLegalMoves: function(selectedpiece) {
      let position = { x: '', y: '' };
      position.x = main.variables.pieces[selectedpiece].position.split('_')[0];
      position.y = main.variables.pieces[selectedpiece].position.split('_')[1];

      var options = []; 
      var coordinates = [];
      var startpoint = main.variables.pieces[selectedpiece].position;
      var c1,c2,c3,c4,c5,c6,c7,c8;

      switch (main.variables.pieces[selectedpiece].type) {
        case 'w_king':
          coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;
          
        case 'b_king':
          coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;

        case 'w_queen':
          c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c5 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c6 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c7 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c8 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
          break;

        case 'b_queen':
          c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c5 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c6 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c7 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c8 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
          break;
        
        case 'w_bishop':
          c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4);
          break;
        
        case 'b_bishop':
          c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4);
          break;

        case 'w_knight':
          coordinates = [{ x: -1, y: 2 },{ x: 1, y: 2 },{ x: 1, y: -2 },{ x: -1, y: -2 },{ x: 2, y: 1 },{ x: 2, y: -1 },{ x: -2, y: -1 },{ x: -2, y: 1 }].map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;

        case 'b_knight':
          coordinates = [{ x: -1, y: 2 },{ x: 1, y: 2 },{ x: 1, y: -2 },{ x: -1, y: -2 },{ x: 2, y: 1 },{ x: 2, y: -1 },{ x: -2, y: -1 },{ x: -2, y: 1 }].map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;

        case 'w_rook':
          c1 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c2 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c3 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c4 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4);
          break;

        case 'b_rook':
          c1 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c2 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c3 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c4 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4);
          break;

        case 'w_pawn':
          if (main.variables.pieces[selectedpiece].moved == false) {
            coordinates = [{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);

          // Merge en passant moves
          let epw = main.methods.getEnPassantOptions(selectedpiece);
          if (epw.length > 0) {
            options = options.concat(epw);
          }
          break;

        case 'b_pawn':
          if (main.variables.pieces[selectedpiece].moved == false) {
            coordinates = [{ x: 0, y: -1 },{ x: 0, y: -2 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 0, y: -1 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);

          // Merge en passant moves
          let epb = main.methods.getEnPassantOptions(selectedpiece);
          if (epb.length > 0) {
            options = options.concat(epb);
          }
          break;
      }      

      return options;
    },

    // Get En Passant captures
    getEnPassantOptions: function(pawnName) {
      let epOptions = [];
      let pawn = main.variables.pieces[pawnName];
      if (!pawn || pawn.captured) return epOptions;

      let pos = pawn.position.split('_');
      let px = parseInt(pos[0]);
      let py = parseInt(pos[1]);

      let color = pawn.type.slice(0, 1);
      let targetY = (color === 'w') ? 5 : 4;
      let moveY = (color === 'w') ? 1 : -1;

      if (py !== targetY) return epOptions;

      let lastPawnName = main.variables.lastDoubleStepPawn;
      if (lastPawnName) {
        let lastPawn = main.variables.pieces[lastPawnName];
        if (lastPawn && !lastPawn.captured) {
          let lpos = lastPawn.position.split('_');
          let lx = parseInt(lpos[0]);
          let ly = parseInt(lpos[1]);

          // Must be adjacent horizontally
          if (ly === py && Math.abs(lx - px) === 1) {
            epOptions.push(lx + '_' + (py + moveY));
          }
        }
      }
      return epOptions;
    },

    // Attack checkers
    isKingInCheck: function(color) {
      let kingName = color + '_king';
      let kingPos = main.variables.pieces[kingName].position;
      let opponentColor = (color === 'w') ? 'b' : 'w';

      return main.methods.isSquareUnderAttack(kingPos, opponentColor);
    },

    isSquareUnderAttack: function(square, attackerColor) {
      for (let pieceName in main.variables.pieces) {
        let piece = main.variables.pieces[pieceName];
        if (piece.type.slice(0, 1) === attackerColor && !piece.captured) {
          let attacks = main.methods.getPseudoLegalMoves(pieceName);
          if (attacks.indexOf(square) !== -1) {
            return true;
          }
        }
      }
      return false;
    },

    getLegalMoves: function(selectedpiece) {
      let pseudoMoves = main.methods.getPseudoLegalMoves(selectedpiece);
      let legalMoves = [];
      let color = main.variables.pieces[selectedpiece].type.slice(0, 1);
      let originalPosition = main.variables.pieces[selectedpiece].position;

      pseudoMoves.forEach(targetId => {
        let targetPiece = $('#' + targetId).attr('chess');
        let currentPiece = $('#' + originalPosition).attr('chess');

        // Simulate state changes in HTML attributes (so sliding pieces block correctly)
        $('#' + targetId).attr('chess', currentPiece);
        $('#' + originalPosition).attr('chess', 'null');
        
        let targetPieceOriginalPos = '';
        if (targetPiece && targetPiece !== 'null') {
          targetPieceOriginalPos = main.variables.pieces[targetPiece].position;
          main.variables.pieces[targetPiece].captured = true;
        }

        // Handle en passant simulation
        let epCapturedPiece = null;
        let epOriginalPos = '';
        let isPawn = main.variables.pieces[selectedpiece].type.endsWith('pawn');
        let from_x = parseInt(originalPosition.split('_')[0]);
        let to_x = parseInt(targetId.split('_')[0]);
        let epPos = '';

        if (isPawn && from_x !== to_x && targetPiece === 'null') {
          epPos = targetId.split('_')[0] + '_' + originalPosition.split('_')[1];
          epCapturedPiece = $('#' + epPos).attr('chess');
          if (epCapturedPiece && epCapturedPiece !== 'null') {
            epOriginalPos = main.variables.pieces[epCapturedPiece].position;
            main.variables.pieces[epCapturedPiece].captured = true;
            $('#' + epPos).attr('chess', 'null');
          }
        }

        // Move active piece in variables
        main.variables.pieces[selectedpiece].position = targetId;

        // Check if King is checked in this simulated world
        let isKingChecked = main.methods.isKingInCheck(color);

        // Undo board DOM states
        $('#' + targetId).attr('chess', targetPiece);
        $('#' + originalPosition).attr('chess', currentPiece);

        // Undo piece positions
        main.variables.pieces[selectedpiece].position = originalPosition;
        if (targetPiece && targetPiece !== 'null') {
          main.variables.pieces[targetPiece].captured = false;
          main.variables.pieces[targetPiece].position = targetPieceOriginalPos;
        }
        if (epCapturedPiece && epCapturedPiece !== 'null') {
          main.variables.pieces[epCapturedPiece].captured = false;
          main.variables.pieces[epCapturedPiece].position = epOriginalPos;
          $('#' + epPos).attr('chess', epCapturedPiece);
        }

        if (!isKingChecked) {
          legalMoves.push(targetId);
        }
      });

      // Check castling legality manually to prevent infinite recursion
      if (main.variables.pieces[selectedpiece].type === 'w_king') {
        // King-side (Short) Castle White
        if ($('#6_1').attr('chess') == 'null' && $('#7_1').attr('chess') == 'null' && 
            main.variables.pieces['w_king'].moved == false && 
            main.variables.pieces['w_rook2'].moved == false &&
            !main.methods.isKingInCheck('w') &&
            !main.methods.isSquareUnderAttack('6_1', 'b') &&
            !main.methods.isSquareUnderAttack('7_1', 'b')) {
          legalMoves.push('7_1');
        }
        // Queen-side (Long) Castle White
        if ($('#2_1').attr('chess') == 'null' && $('#3_1').attr('chess') == 'null' && $('#4_1').attr('chess') == 'null' &&
            main.variables.pieces['w_king'].moved == false && 
            main.variables.pieces['w_rook1'].moved == false &&
            !main.methods.isKingInCheck('w') &&
            !main.methods.isSquareUnderAttack('4_1', 'b') &&
            !main.methods.isSquareUnderAttack('3_1', 'b')) {
          legalMoves.push('3_1');
        }
      } else if (main.variables.pieces[selectedpiece].type === 'b_king') {
        // King-side (Short) Castle Black
        if ($('#6_8').attr('chess') == 'null' && $('#7_8').attr('chess') == 'null' && 
            main.variables.pieces['b_king'].moved == false && 
            main.variables.pieces['b_rook2'].moved == false &&
            !main.methods.isKingInCheck('b') &&
            !main.methods.isSquareUnderAttack('6_8', 'w') &&
            !main.methods.isSquareUnderAttack('7_8', 'w')) {
          legalMoves.push('7_8');
        }
        // Queen-side (Long) Castle Black
        if ($('#2_8').attr('chess') == 'null' && $('#3_8').attr('chess') == 'null' && $('#4_8').attr('chess') == 'null' &&
            main.variables.pieces['b_king'].moved == false && 
            main.variables.pieces['b_rook1'].moved == false &&
            !main.methods.isKingInCheck('b') &&
            !main.methods.isSquareUnderAttack('4_8', 'w') &&
            !main.methods.isSquareUnderAttack('3_8', 'w')) {
          legalMoves.push('3_8');
        }
      }

      return legalMoves;
    },

    // Game Over checkers
    checkGameOver: function(color) {
      let totalLegalMoves = 0;
      for (let pieceName in main.variables.pieces) {
        let piece = main.variables.pieces[pieceName];
        if (piece.type.slice(0, 1) === color && !piece.captured) {
          let moves = main.methods.getLegalMoves(pieceName);
          totalLegalMoves += moves.length;
        }
      }

      if (totalLegalMoves === 0) {
        if (main.methods.isKingInCheck(color)) {
          let winner = (color === 'w') ? 'Black' : 'White';
          $('#turn').html('CHECKMATE! ' + winner.toUpperCase() + ' WINS!');
          $('#turn').addClass('turnhighlight');
          main.methods.triggerGameOver('Checkmate! ' + winner + ' wins the game.');
        } else {
          $('#turn').html('DRAW! STALEMATE!');
          $('#turn').addClass('turnhighlight');
          main.methods.triggerGameOver('Draw! Stalemate.');
        }
        $('.gamecell').off('click'); // Disable interactions
      }
    },

    moveoptions: function(selectedpiece) {
      if (main.variables.highlighted.length != 0) {
        main.methods.togglehighlight(main.variables.highlighted);
      }

      let options = main.methods.getLegalMoves(selectedpiece);
      main.variables.highlighted = options.slice(0);
      main.methods.togglehighlight(options);
    },

    options: function(startpoint, coordinates, piecetype) {
      coordinates = coordinates.filter(val => {
        let pos = { x: 0, y: 0 };
        pos.x = parseInt(val.split('_')[0]);
        pos.y = parseInt(val.split('_')[1]);

        if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) {
          return val;
        }
      });

      switch (piecetype) {
        case 'w_king':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'b');
          });
          break;
        case 'b_king':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'w');
          });
          break;
        case 'w_knight':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'b');
          });
          break;
        case 'b_knight':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'w');
          });
          break;

        case 'w_pawn':
          coordinates = coordinates.filter(val => {
            let sp = { x: 0, y: 0 };
            let coordinate = val.split('_');
            sp.x = startpoint.split('_')[0];
            sp.y = startpoint.split('_')[1];
            
            if (coordinate[0] < sp.x || coordinate[0] > sp.x) {
              return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'b');
            } else {
              if (coordinate[1] == (parseInt(sp.y) + 2) && $('#' + sp.x + '_' + (parseInt(sp.y) + 1)).attr('chess') != 'null') {
                // blocked initial step
              } else {
                return ($('#' + val).attr('chess') == 'null');
              }
            }
          });
          break;

        case 'b_pawn':
          coordinates = coordinates.filter(val => {
            let sp = { x: 0, y: 0 };
            let coordinate = val.split('_');
            sp.x = startpoint.split('_')[0];
            sp.y = startpoint.split('_')[1];
            
            if (coordinate[0] < sp.x || coordinate[0] > sp.x) {
              return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'w');
            } else {
              if (coordinate[1] == (parseInt(sp.y) - 2) && $('#' + sp.x + '_' + (parseInt(sp.y) - 1)).attr('chess') != 'null') {
                // blocked initial step
              } else {
                return ($('#' + val).attr('chess') == 'null');
              }
            }
          });
          break;
      }      

      return coordinates;
    },

    w_options: function (position,coordinates) {
      let flag = false;
      coordinates = coordinates.map(function(val){
          return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
        }).filter(val => {
          let pos = { x: 0, y: 0 };
          pos.x = parseInt(val.split('_')[0]);
          pos.y = parseInt(val.split('_')[1]);
          if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) {
            return val;
          }
        }).filter(val => {
          if (flag == false){
            if ($('#' + val).attr('chess') == 'null'){
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
              flag = true;
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
              flag = true;
            }
          }
        });
      return coordinates;
    },

    b_options: function (position,coordinates) {
      let flag = false;
      coordinates = coordinates.map(function(val){
          return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
        }).filter(val => {
          let pos = { x: 0, y: 0 };
          pos.x = parseInt(val.split('_')[0]);
          pos.y = parseInt(val.split('_')[1]);
          if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) {
            return val;
          }
        }).filter(val => {
          if (flag == false){
            if ($('#' + val).attr('chess') == 'null'){
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
              flag = true;
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
              flag = true;
            }
          }
        });
      return coordinates;
    },

    capture: function (target) {
      let selectedpiece = {
        name: $('#' + main.variables.selectedpiece).attr('chess'),
        id: main.variables.selectedpiece
      };

      $('#' + target.id).html(main.variables.pieces[selectedpiece.name].img);
      $('#' + target.id).attr('chess',selectedpiece.name);
      $('#' + selectedpiece.id).html('');
      $('#' + selectedpiece.id).attr('chess','null');
      
      main.variables.pieces[selectedpiece.name].position = target.id;
      main.variables.pieces[selectedpiece.name].moved = true;
      main.variables.pieces[target.name].captured = true;
      
      main.variables.lastDoubleStepPawn = ''; // Clear EP tracking
    },

    move: function (target) {
      let selectedpiece = $('#' + main.variables.selectedpiece).attr('chess');
      let from_pos = main.variables.pieces[selectedpiece].position.split('_');
      let from_x = parseInt(from_pos[0]);
      let from_y = parseInt(from_pos[1]);
      let to_pos = target.id.split('_');
      let to_x = parseInt(to_pos[0]);
      let to_y = parseInt(to_pos[1]);

      let isPawn = main.variables.pieces[selectedpiece].type.endsWith('pawn');

      // Execute normal movement
      $('#' + target.id).html(main.variables.pieces[selectedpiece].img);
      $('#' + target.id).attr('chess', selectedpiece);
      $('#' + main.variables.selectedpiece).html('');
      $('#' + main.variables.selectedpiece).attr('chess','null');

      // Track pawn double-step moves for en passant next turn
      if (isPawn && Math.abs(from_y - to_y) === 2) {
        main.variables.lastDoubleStepPawn = selectedpiece;
      } else {
        main.variables.lastDoubleStepPawn = '';
      }

      main.variables.pieces[selectedpiece].position = target.id;
      main.variables.pieces[selectedpiece].moved = true;

    },

    endturn: function(){
      if (main.variables.turn == 'w') {
        main.variables.turn = 'b';
        
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
        main.variables.selectedpiece = '';

        $('#turn').html("It's Blacks Turn");
        $('#turn').addClass('turnhighlight');
        window.setTimeout(function(){
          $('#turn').removeClass('turnhighlight');
        }, 1500);

      } else {
        main.variables.turn = 'w';

        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
        main.variables.selectedpiece = '';

        $('#turn').html("It's Whites Turn");
        $('#turn').addClass('turnhighlight');
        window.setTimeout(function(){
          $('#turn').removeClass('turnhighlight');
        }, 1500);
      }

      // Save snapshots and check checks
      main.methods.saveHistoryState();
      main.methods.gamesetup();
      main.methods.checkGameOver(main.variables.turn);

      // Relays board status to opponent in multiplayer mode
      if (socket && main.variables.multiplayerMode && currentRoomId) {
        socket.emit('sendMove', {
          roomId: currentRoomId,
          pieces: main.variables.pieces,
          turn: main.variables.turn
        });
      }
    },

    togglehighlight: function(options) {
      options.forEach(function(element, index, array) {
        $('#' + element).toggleClass("green");
      });
    },

    // Interactive Click Handler
    handleCellClick: function(e) {
      let clickedId = this.id;

      // If online multiplayer mode is enabled:
      if (main.variables.multiplayerMode) {
        // 1. Deny actions if it's not the player's turn
        if (main.variables.turn !== main.variables.playerSide) {
          return;
        }
        // 2. Deny selecting opponent's pieces
        let clickedChess = $('#' + clickedId).attr('chess');
        if (main.variables.selectedpiece == '' && clickedChess !== 'null' && clickedChess.slice(0,1) !== main.variables.playerSide) {
          return;
        }
      }

      var selectedpiece = {
        name: '',
        id: main.variables.selectedpiece
      };

      if (main.variables.selectedpiece == '') {
        selectedpiece.name = $('#' + clickedId).attr('chess');
      } else {
        selectedpiece.name = $('#' + main.variables.selectedpiece).attr('chess');
      }

      var target = {
        name: $(this).attr('chess'),
        id: clickedId
      };

      // 1. SELECT PIECE
      if (main.variables.selectedpiece == '' && target.name.slice(0,1) == main.variables.turn) {
        main.variables.selectedpiece = clickedId;
        $('#' + clickedId).addClass('selected-highlight');
        main.methods.moveoptions($(this).attr('chess'));

      // 2. TOGGLE SELECTION TO ANOTHER PIECE
      } else if (main.variables.selectedpiece != '' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) == target.name.slice(0,1)) {
        $('.gamecell').removeClass('selected-highlight');
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;

        main.variables.selectedpiece = clickedId;
        $('#' + clickedId).addClass('selected-highlight');
        main.methods.moveoptions(target.name);

      // 3. MOVE TO EMPTY CELL (Detect En Passant Captures!)
      } else if (main.variables.selectedpiece !='' && target.name == 'null') {
        if (main.variables.highlighted.indexOf(target.id) != (-1)) {
          
          let isPawn = main.variables.pieces[selectedpiece.name].type.endsWith('pawn');
          let from_x = parseInt(selectedpiece.id.split('_')[0]);
          let to_x = parseInt(target.id.split('_')[0]);
          
          if (isPawn && from_x !== to_x) {
            // En Passant Capture engagement!
            let epPos = to_x + '_' + selectedpiece.id.split('_')[1];
            let epPawnName = $('#' + epPos).attr('chess');
            
            main.methods.startFPSMiniGame(
              selectedpiece.name,
              epPawnName,
              selectedpiece.id,
              target.id
            );
          } else if (selectedpiece.name == 'w_king' || selectedpiece.name == 'b_king') {
            let isWhiteKing = (selectedpiece.name == 'w_king');
            let isBlackKing = (selectedpiece.name == 'b_king');
            let kingUnmoved = (main.variables.pieces[selectedpiece.name].moved == false);
            let rook1Unmoved = isWhiteKing ? (main.variables.pieces['w_rook1'].moved == false) : (isBlackKing ? (main.variables.pieces['b_rook1'].moved == false) : false);
            let rook2Unmoved = isWhiteKing ? (main.variables.pieces['w_rook2'].moved == false) : (isBlackKing ? (main.variables.pieces['b_rook2'].moved == false) : false);
      
            if (isWhiteKing && kingUnmoved && rook2Unmoved && target.id == '7_1') { // Castle White Short
              let k_position = '5_1';
              let k_target = '7_1';
              let r_position = '8_1';
              let r_target = '6_1';
      
              main.variables.pieces['w_king'].position = '7_1';
              main.variables.pieces['w_king'].moved = true;
              $('#'+k_position).html('');
              $('#'+k_position).attr('chess','null');
              $('#'+k_target).html(main.variables.pieces['w_king'].img);
              $('#'+k_target).attr('chess','w_king');
      
              main.variables.pieces['w_rook2'].position = '6_1';
              main.variables.pieces['w_rook2'].moved = true;
              $('#'+r_position).html('');
              $('#'+r_position).attr('chess','null');
              $('#'+r_target).html(main.variables.pieces['w_rook2'].img);
              $('#'+r_target).attr('chess','w_rook2');
      
              $('.gamecell').removeClass('selected-highlight');
              main.methods.endturn();
      
            } else if (isWhiteKing && kingUnmoved && rook1Unmoved && target.id == '3_1') { // Castle White Long
              let k_position = '5_1';
              let k_target = '3_1';
              let r_position = '1_1';
              let r_target = '4_1';
      
              main.variables.pieces['w_king'].position = '3_1';
              main.variables.pieces['w_king'].moved = true;
              $('#'+k_position).html('');
              $('#'+k_position).attr('chess','null');
              $('#'+k_target).html(main.variables.pieces['w_king'].img);
              $('#'+k_target).attr('chess','w_king');
      
              main.variables.pieces['w_rook1'].position = '4_1';
              main.variables.pieces['w_rook1'].moved = true;
              $('#'+r_position).html('');
              $('#'+r_position).attr('chess','null');
              $('#'+r_target).html(main.variables.pieces['w_rook1'].img);
              $('#'+r_target).attr('chess','w_rook1');
      
              $('.gamecell').removeClass('selected-highlight');
              main.methods.endturn();
      
            } else if (isBlackKing && kingUnmoved && rook2Unmoved && target.id == '7_8') { // Castle Black Short
              let k_position = '5_8';
              let k_target = '7_8';
              let r_position = '8_8';
              let r_target = '6_8';
      
              main.variables.pieces['b_king'].position = '7_8';
              main.variables.pieces['b_king'].moved = true;
              $('#'+k_position).html('');
              $('#'+k_position).attr('chess','null');
              $('#'+k_target).html(main.variables.pieces['b_king'].img);
              $('#'+k_target).attr('chess','b_king');
      
              main.variables.pieces['b_rook2'].position = '6_8';
              main.variables.pieces['b_rook2'].moved = true;
              $('#'+r_position).html('');
              $('#'+r_position).attr('chess','null');
              $('#'+r_target).html(main.variables.pieces['b_rook2'].img);
              $('#'+r_target).attr('chess','b_rook2');
      
              $('.gamecell').removeClass('selected-highlight');
              main.methods.endturn();
              
            } else if (isBlackKing && kingUnmoved && rook1Unmoved && target.id == '3_8') { // Castle Black Long
              let k_position = '5_8';
              let k_target = '3_8';
              let r_position = '1_8';
              let r_target = '4_8';
      
              main.variables.pieces['b_king'].position = '3_8';
              main.variables.pieces['b_king'].moved = true;
              $('#'+k_position).html('');
              $('#'+k_position).attr('chess','null');
              $('#'+k_target).html(main.variables.pieces['b_king'].img);
              $('#'+k_target).attr('chess','b_king');
      
              main.variables.pieces['b_rook1'].position = '4_8';
              main.variables.pieces['b_rook1'].moved = true;
              $('#'+r_position).html('');
              $('#'+r_position).attr('chess','null');
              $('#'+r_target).html(main.variables.pieces['b_rook1'].img);
              $('#'+r_target).attr('chess','b_rook1');
      
              $('.gamecell').removeClass('selected-highlight');
              main.methods.endturn();
              
            } else { // Normal King move
              main.methods.move(target);
              $('.gamecell').removeClass('selected-highlight');
              if (!main.methods.checkPawnPromotion(selectedpiece.name, main.methods.endturn)) {
                main.methods.endturn();
              }
            }
          } else { // Normal piece move
            main.methods.move(target);
            $('.gamecell').removeClass('selected-highlight');
            if (!main.methods.checkPawnPromotion(selectedpiece.name, main.methods.endturn)) {
              main.methods.endturn();
            }
          }
        } else { // Clicked invalid empty -> Deselect
          $('.gamecell').removeClass('selected-highlight');
          main.methods.togglehighlight(main.variables.highlighted);
          main.variables.highlighted.length = 0;
          main.variables.selectedpiece = '';
        }
          
      // 4. CAPTURE PIECE (Triggers Shooter Mini-game!)
      } else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) != target.name.slice(0,1)) {
        if (selectedpiece.id != target.id && main.variables.highlighted.indexOf(target.id) != (-1)) {
          
          // Pause and load FPS overlays!
          main.methods.startFPSMiniGame(
            selectedpiece.name,
            target.name,
            selectedpiece.id,
            target.id
          );

        } else { // Clicked invalid capture -> Deselect
          $('.gamecell').removeClass('selected-highlight');
          main.methods.togglehighlight(main.variables.highlighted);
          main.variables.highlighted.length = 0;
          main.variables.selectedpiece = '';
        }
      }
    }
  }
};

$(document).ready(function() {
  // Store pristine pieces clone for restarts
  pristinePieces = JSON.parse(JSON.stringify(main.variables.pieces));

  // Render starting board (invisible under selection overlay)
  main.methods.gamesetup();

  // Match Type actions
  $('#mode-local').click(function() {
    $('.mode-btn').removeClass('active-mode');
    $(this).addClass('active-mode');
    main.variables.multiplayerMode = false;
    
    // UI toggles
    $('#online-lobby-panel').hide();
    $('#local-side-select').fadeIn(200);
  });

  $('#mode-online').click(function() {
    $('.mode-btn').removeClass('active-mode');
    $(this).addClass('active-mode');
    main.variables.multiplayerMode = true;

    // UI toggles
    $('#local-side-select').hide();
    $('#online-lobby-panel').fadeIn(200);

    // Reset online lobby panels state
    $('#btn-host-lobby').show().prop('disabled', false);
    $('#host-code-display').hide();
    $('#btn-join-lobby-toggle').show();
    $('#lobby-divider').show();
    $('#join-input-display').hide();
    $('#input-lobby-code').val('');
    $('#btn-connect-lobby').text('CONNECT & PLAY ⚡').prop('disabled', false);
  });

  // Resign action
  $('#btn-resign').click(function() {
    if (confirm("Are you sure you want to resign?")) {
      main.methods.resignMatch();
    }
  });

  // Host Lobby Event (Live Socket.io with Mock Fallback)
  $('#btn-host-lobby').click(function() {
    // Generate random 3-digit lobby code
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'FPS-';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    $(this).hide();
    $('#btn-join-lobby-toggle').hide();
    $('#lobby-divider').hide();
    
    $('#lobby-code-val').text(code);
    $('#host-code-display').fadeIn(200);

    currentRoomId = code;

    if (socket) {
      // LIVE: Emit hosting event to Node.js server
      socket.emit('hostRoom', { roomId: code });

      // Wait for server notification that opponent connected
      socket.off('opponentJoined').on('opponentJoined', function(data) {
        alert("OPPONENT CONNECTED!\n\nLobby Room: " + code + "\nYou have been assigned WHITE ♔. The match is starting!");
        main.methods.startMatch('w'); // Host is White
      });
    } else {
      // FALLBACK MOCK: Simulate opponent joining after 4.5 seconds
      setTimeout(function() {
        alert("OPPONENT CONNECTED! (Offline Mock Mode)\n\nLobby Room: " + code + "\nYou have been assigned WHITE ♔. The match is starting!");
        main.methods.startMatch('w');
      }, 4500);
    }
  });

  // Join Toggle
  $('#btn-join-lobby-toggle').click(function() {
    $('#join-input-display').fadeToggle(200);
  });

  // Connect Lobby Event (Live Socket.io with Mock Fallback)
  $('#btn-connect-lobby').click(function() {
    let inputVal = $('#input-lobby-code').val().trim().toUpperCase();
    if (inputVal.length < 4) {
      alert("Please enter a valid lobby code!");
      return;
    }

    $(this).prop('disabled', true).text('CONNECTING...');
    $('#btn-host-lobby').hide();
    $('#lobby-divider').hide();

    if (socket) {
      // LIVE: Emit joining event to Node.js server
      socket.emit('joinRoom', { roomId: inputVal });

      // Handle successful connection
      socket.off('joinedSuccessfully').on('joinedSuccessfully', function(data) {
        currentRoomId = data.roomId;
        alert("CONNECTED SUCCESSFULLY!\n\nLobby Room: " + data.roomId + "\nYou have been assigned BLACK ♚. The match is starting!");
        main.methods.startMatch('b'); // Joiner is Black
      });

      // Handle room not found error
      socket.off('lobbyNotFound').on('lobbyNotFound', function(data) {
        alert(data.message);
        $('#btn-connect-lobby').prop('disabled', false).text('CONNECT & PLAY ⚡');
        $('#btn-host-lobby').show();
        $('#lobby-divider').show();
      });
    } else {
      // FALLBACK MOCK: Simulate successfully joining after 2 seconds
      setTimeout(function() {
        currentRoomId = inputVal;
        alert("CONNECTED TO LOBBY: " + inputVal + " (Offline Mock Mode)\n\nYou have been assigned BLACK ♚. The match is starting!");
        main.methods.startMatch('b');
      }, 2000);
    }
  });

  // Global socket listener bindings for live multiplayer syncing
  if (socket) {
    // 1. Sync board layouts and turns
    socket.on('receiveMove', function(data) {
      main.variables.pieces = data.pieces;
      main.variables.turn = data.turn;
      main.methods.gamesetup();
      
      let turnName = (main.variables.turn === 'w') ? "WHITE'S" : "BLACK'S";
      $('#turn').html("IT'S " + turnName + " TURN");
      main.methods.updateHistoryButtons();
    });

    // 2. Trigger combat overlays
    socket.on('receiveCombatStart', function(data) {
      main.methods.startFPSMiniGame(data.attacker, data.defender, data.attackerPos, data.defenderPos, true);
    });

    // 3. Sync combat resolution outcomes
    socket.on('receiveCombatResolution', function(data) {
      main.methods.resolveCombat(data.success, true);
    });

    // 4. Opponent resigned notification
    socket.on('opponentResigned', function() {
      main.methods.resignMatch(true); // Opponent resigned
    });
  }

  // Side Selection actions
  $('#select-white').click(function() {
    main.methods.startMatch('w');
  });

  $('#select-black').click(function() {
    main.methods.startMatch('b');
  });

  $('#select-random').click(function() {
    let side = (Math.random() < 0.5) ? 'w' : 'b';
    main.methods.startMatch(side);
  });

  // History Control actions
  $('#btn-back').click(function() {
    if (main.variables.historyIndex > 0) {
      main.methods.loadHistoryState(main.variables.historyIndex - 1);
    }
  });

  $('#btn-forward').click(function() {
    if (main.variables.historyIndex < main.variables.history.length - 1) {
      main.methods.loadHistoryState(main.variables.historyIndex + 1);
    }
  });

  $('#btn-restart').click(function() {
    main.methods.restartGame();
  });

  $('#btn-game-over-ok').click(function() {
    $('#game-over-overlay').fadeOut(150);
    main.methods.restartGame();
  });

  // FPS Combat Arena actions
  $('#fps-arena').click(function(e) {
    main.methods.playGunshotSound();
    
    // Muzzle flash pop
    $('#fps-overlay').css('background-color', 'rgba(255, 255, 255, 0.9)');
    setTimeout(function() {
      $('#fps-overlay').css('background-color', 'rgba(48, 46, 43, 0.97)');
    }, 45);
  });

  // Target Hit handler
  $('#fps-target').click(function(e) {
    e.stopPropagation(); // Avoid double gunshot sound
    
    main.methods.playGunshotSound();
    
    // Impact red flash feedback
    $('#fps-overlay').css('background-color', 'rgba(239, 68, 68, 0.45)');
    setTimeout(function() {
      main.methods.resolveCombat(true);
    }, 80);
  });

  $('body').contextmenu(function(e) {
    e.preventDefault();
  });
});