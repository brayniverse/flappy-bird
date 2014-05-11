// Flappy Bird
// @author  Christopher L Bray <chris@brayniverse.com>
(function( window, document, undefined ) {
  'use strict';

  // Wait for document to finish loading the canvas element.
  document.addEventListener("DOMContentLoaded", function() {

    var canvas    = document.getElementById( 'game' )
      , birdPng   = document.getElementById( 'bird' )
      , context   = canvas.getContext( '2d' )
      , bird
      , gameLoop
      , score     = 0
      , pipes     = []
      , playing   = false
      , isKeyDown = false;

    // Automatically stretch the canvas to fit the document window.
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth;

    // Bind the keypress events.
    window.onkeydown = function( e ) {
      if ( e.keyCode === 32 ) {
        if ( playing === false ) {
          playing = true;
          new Game();
        }

        bird.y -= 50;
      }
    }

    function Bird() {
      return {
        x:      100,
        y:      canvas.height / 2,
        height: 30,
        width:  50,
        draw: function() {
          context.fillStyle   = '#ff0';
          context.strokeStyle = '#222';
          context.fillRect( this.x, this.y, this.width, this.height );
          context.strokeRect( this.x, this.y, this.width, this.height );
        },
        progress: function() {
          ++this.y;
          ++this.y;
        }
      };
    }

    function Pipe( type, offset ) {
      var y = type === 'top' ? 0 : canvas.height - ( ( canvas.height / 2 ) - offset );

      return {
        x:      canvas.width + 100,
        y:      y,
        height: type === 'top' ? ( canvas.height / 2 ) - 150 + offset : canvas.height,
        width:  100,
        draw: function() {
          context.fillStyle   = '#78AB46';
          context.strokeStyle = '#222';
          context.fillRect( this.x, this.y, this.width, this.height );
          context.strokeRect( this.x, this.y, this.width, this.height );
        },
        update: function() {
          --this.x;
          --this.x;
        }
      };
    }

    var clearCanvas = function() {
      context.fillStyle = '#4ec0ca';
      context.fillRect( 0, 0, canvas.width, canvas.height );
    };

    var loop = function( fps ) {
      setInterval(function() {
        update();
        render();
      }, 1000 / fps );
    };

    var update = function() {
      if ( hasCollided() ) {
        reset();
      } else {
        bird.progress();
      }
    };

    var render = function() {
      clearCanvas();
      bird.draw();
      pipes.map(function( pipe ) {
        pipe.update();
        pipe.draw();
      });
    };

    var reset = function() {
      pipes.map(function( pipe ) {
        if ( pipe.x <= 0 ) {
          score++;
        }
      });
      window.alert( score / 2 );
      clearInterval( gameLoop );
      bird.y = canvas.height / 2;
      pipes  = [];
      score = 0;
    };

    var hasCollided = function() {
      if ( bird.y > canvas.height || bird.y < 0 ) {
        reset();
      }
      pipes.map(function( pipe ) {
        if (
          bird.x               < pipe.x + pipe.width  &&
          bird.x + bird.width  > pipe.x               &&
          bird.y               < pipe.y + pipe.height &&
          bird.height + bird.y > pipe.y
        ) {
            reset();
        }
      });
    };

    function Game() {
      bird     = new Bird();
      gameLoop = loop( 50 );

      var newPipes = setInterval(function() {
        var offset = Math.floor( ( Math.random() * 100 ) ) + 10;
        pipes.push( new Pipe( 'top', offset ) );
        pipes.push( new Pipe( 'bottom', offset ) );
      }, 3000 );
    }
  });

}( window, document ));