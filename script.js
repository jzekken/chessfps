let main = {

  variables: {
    turn: 'w',
    selectedpiece: '',
    highlighted: [],
    lastDoubleStepPawn: '', // Tracks name of the pawn that just double-stepped
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
      for (let gamepiece in main.variables.pieces) {
        $('#' + main.variables.pieces[gamepiece].position).html(main.variables.pieces[gamepiece].img);
        $('#' + main.variables.pieces[gamepiece].position).attr('chess', gamepiece);
      }
    },

    // 1. Get Pseudo-Legal moves: Raw movement possibilities ignoring check rules
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
          if ($('#6_1').attr('chess') == 'null' && $('#7_1').attr('chess') == 'null' && 
              main.variables.pieces['w_king'].moved == false && 
              main.variables.pieces['w_rook2'].moved == false &&
              !main.methods.isKingInCheck('w') &&
              !main.methods.isSquareUnderAttack('6_1', 'b') &&
              !main.methods.isSquareUnderAttack('7_1', 'b')) {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 },{x: 2, y: 0}].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;
          
        case 'b_king':
          if ($('#6_8').attr('chess') == 'null' && $('#7_8').attr('chess') == 'null' && 
              main.variables.pieces['b_king'].moved == false && 
              main.variables.pieces['b_rook2'].moved == false &&
              !main.methods.isKingInCheck('b') &&
              !main.methods.isSquareUnderAttack('6_8', 'w') &&
              !main.methods.isSquareUnderAttack('7_8', 'w')) {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 },{x: 2, y: 0}].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = main.methods.options(startpoint, coordinates, main.variables.pieces[selectedpiece].type);
          break;

        case 'w_queen':
          c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
          c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
          c5 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c6 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c7 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c8 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
          break;

        case 'b_queen':
          c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
          c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
          c5 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
          c6 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
          c7 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
          c8 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4).concat(c5).concat(c6).concat(c7).concat(c8);
          break;
        
        case 'w_bishop':
          c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
          c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
          options = c1.concat(c2).concat(c3).concat(c4);
          break;
        
        case 'b_bishop':
          c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
          c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
          c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
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

    // 2. Get En Passant captures
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

          // Must be directly adjacent horizontally
          if (ly === py && Math.abs(lx - px) === 1) {
            epOptions.push(lx + '_' + (py + moveY));
          }
        }
      }
      return epOptions;
    },

    // 3. Attack checkers
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

    // 4. Generate fully legal moves: Pseudo-legal moves simulated & checked for check safety
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

      return legalMoves;
    },

    // 5. Game Over triggers
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
          alert('Checkmate! ' + winner + ' wins the game.');
        } else {
          $('#turn').html('DRAW! STALEMATE!');
          $('#turn').addClass('turnhighlight');
          alert('Draw! Stalemate.');
        }
        $('.gamecell').off('click'); // Disable interactions
      }
    },

    moveoptions: function(selectedpiece) {
      if (main.variables.highlighted.length != 0) {
        main.methods.togglehighlight(main.variables.highlighted);
      }

      // ONLY show legal moves!
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
      
      main.variables.lastDoubleStepPawn = ''; // Clear EP pawn tracking
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

      // Execute en passant capture if pawn moved diagonally to an empty square
      if (isPawn && from_x !== to_x) {
        let epPos = to_x + '_' + from_y;
        let epPawnName = $('#' + epPos).attr('chess');
        if (epPawnName && epPawnName !== 'null') {
          main.variables.pieces[epPawnName].captured = true;
          $('#' + epPos).html('');
          $('#' + epPos).attr('chess', 'null');
        }
      }

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

      // Trigger Game Over checks
      main.methods.checkGameOver(main.variables.turn);
    },

    togglehighlight: function(options) {
      options.forEach(function(element, index, array) {
        $('#' + element).toggleClass("green shake-little");
      });
    }
  }
};

$(document).ready(function() {
  main.methods.gamesetup();

  $('.gamecell').click(function(e) {
    let clickedId = this.id; // Correctly get cell ID even on click bubble

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

    // 2. TOGGLE / SELECT ANOTHER PIECE OF SAME COLOR
    } else if (main.variables.selectedpiece != '' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) == target.name.slice(0,1)) {
      $('.gamecell').removeClass('selected-highlight');
      main.methods.togglehighlight(main.variables.highlighted);
      main.variables.highlighted.length = 0;

      main.variables.selectedpiece = clickedId;
      $('#' + clickedId).addClass('selected-highlight');
      main.methods.moveoptions(target.name);

    // 3. MOVE TO EMPTY CELL
    } else if (main.variables.selectedpiece !='' && target.name == 'null') {
      if (main.variables.highlighted.indexOf(target.id) != (-1)) {
        if (selectedpiece.name == 'w_king' || selectedpiece.name == 'b_king') {
          let t0 = (selectedpiece.name == 'w_king');
          let t1 = (selectedpiece.name == 'b_king');
          let t2 = (main.variables.pieces[selectedpiece.name].moved == false);
          let t3 = (main.variables.pieces['b_rook2'].moved == false);
          let t4 = (main.variables.pieces['w_rook2'].moved == false);
          let t5 = (target.id == '7_8');
          let t6 = (target.id == '7_1');
    
          if (t0 && t2 && t4 && t6) { // Castle White King
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
    
          } else if (t1 && t2 && t3 && t5) { // Castle Black King
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
            
          } else { // Normal King Move
            main.methods.move(target);
            $('.gamecell').removeClass('selected-highlight');
            main.methods.endturn();
          }
        } else { // Normal Piece Move
          main.methods.move(target);
          $('.gamecell').removeClass('selected-highlight');
          main.methods.endturn();
        }
      } else { // Clicked invalid empty cell -> Deselect
        $('.gamecell').removeClass('selected-highlight');
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
        main.variables.selectedpiece = '';
      }
        
    // 4. CAPTURE PIECE
    } else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) != target.name.slice(0,1)) {
      if (selectedpiece.id != target.id && main.variables.highlighted.indexOf(target.id) != (-1)) {
        main.methods.capture(target);
        $('.gamecell').removeClass('selected-highlight');
        main.methods.endturn();
      } else { // Clicked invalid capture target -> Deselect
        $('.gamecell').removeClass('selected-highlight');
        main.methods.togglehighlight(main.variables.highlighted);
        main.variables.highlighted.length = 0;
        main.variables.selectedpiece = '';
      }
    }
  });

  $('body').contextmenu(function(e) {
    e.preventDefault();
  });
});