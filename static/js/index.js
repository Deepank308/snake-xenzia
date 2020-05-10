var canvas;
var ctx;

var head;
var tail;
var food;


var SPEED = 100;      // in ms
var C_WIDTH = 1000;
var C_HEIGHT = 1000;

var WIDTH = 99;
var HEIGHT = 99;

const SCALE = 10;

const move = {
    LEFT : 37,
    RIGHT : 39,
    UP : 38,
    DOWN : 40
}

const END = 0;
const PLAY = 1;
const PAUSE = 2;


var score_tag;
// window.addEventListener('load', function() {
//     vscore = new Vue({
//         el: '.icon-bar #score',
//         data: {
//          score: 0
//         }
//     })
// });


var game_state = {

    'snake_x' : [],
    'snake_y' : [],

    'food_x': 0,
    'food_y': 0,
    'dir': move.RIGHT,
    'in_game': END,
    'growth' : false,
    'score' : 0,
    'immune': 0,

    start : function() {
        game_state.in_game = PLAY;
        
        this.snake_x = [];
        this.snake_y = [];
        game_state.dir = move.RIGHT;
        
        this.score = 0;
        this.immune = 0;

        game_state['snake_x'].push(Math.floor(WIDTH / 2));
        game_state['snake_y'].push(Math.floor(HEIGHT / 2));
        
        gen_food();
        
        this.interval = setInterval(game_loop, SPEED);
    },

    stop : function() {
        clearInterval(this.interval);
    }
}


window.addEventListener('keydown', function(e) {
    console.log('Direction: ' + e.keyCode);
    if(e.keyCode >= move.LEFT && e.keyCode <= move.DOWN){
        if(Math.abs(game_state.dir - e.keyCode) != 2){
            game_state.dir = e.keyCode;
        }
    }
});

window.addEventListener('keyup', function(e){
    console.log('Keyup: ' + e.keyCode);
    console.log('State: ' + game_state.in_game);
    
    if(e.keyCode == 32){
        if(game_state.in_game == PLAY){
                game_state.in_game = PAUSE;
                document.getElementById('pause').style.color = '#35bdb8';
        }
        else if(game_state.in_game == PAUSE){
                game_state.in_game = PLAY;
                document.getElementById('pause').style.color = '#d7d7d7';
        }
    }  
    if(e.keyCode == 73){
        game_state.immune = 1 - game_state.immune;

        if(game_state.immune){
            document.getElementById('immune').style.color = '#35bdb8';
        }
        else{
            document.getElementById('immune').style.color = '#d7d7d7';
        }
    } 
});

function init() {
    
    if(game_state.in_game == PLAY || game_state.in_game == PAUSE) return;

    canvas = document.getElementById('myCanvas');
    score_tag = document.getElementById('score');
    ctx = canvas.getContext('2d');
    
    score_tag.innerText = 'Score: 0';
    
    C_WIDTH = canvas.width;
    C_HEIGHT = canvas.height;
    HEIGHT = C_HEIGHT / SCALE;
    WIDTH = C_WIDTH / SCALE;

    load_images();

    game_state.start();
}

function load_images(){

    head = new Image();
    head.src = '/static/img/head.png';

    tail = new Image();
    tail.src = '/static/img/tail.png';

    food = new Image();
    food.src = '/static/img/food.png';
}

function game_loop() {
    console.log(game_state.in_game);

    if(game_state.in_game == PLAY){
        logic_handler();
        draw_canvas();
    }
    else if(game_state.in_game == END){
        game_state.stop();
    }
}

function logic_handler() {
    
    move_snake();
    detect_collision();   
    
    if(game_state.snake_x[0] == game_state.food_x 
        && game_state.snake_y[0] == game_state.food_y){

        scoreup();

        gen_food();
        grow_snake();
    }
}

// (0, 0) is top-left corner
function draw_canvas()
{
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);

    for(var i = 1; i < game_state['snake_x'].length; i++){
        ctx.drawImage(tail, game_state['snake_x'][i] * SCALE, game_state['snake_y'][i] * SCALE);
    }
    ctx.drawImage(head, game_state['snake_x'][0] * SCALE, game_state['snake_y'][0] * SCALE);

    ctx.drawImage(food, game_state['food_x'] * SCALE, game_state['food_y'] * SCALE);
}

function grow_snake() {
    game_state.growth = true;
}

function scoreup() {
    game_state.score += 1;
    score_tag.innerText = 'Score: ' + String(game_state.score);
    // vscore.score = game_state.score;
}

function gen_food() {

    var x = Math.floor(Math.random() * WIDTH);
    var y = Math.floor(Math.random() * HEIGHT);

    game_state['food_x'] = x;
    game_state['food_y'] = y;
}

function detect_collision() {

    if(game_state.immune == 0){
        
        // snake bites itself
        for(var i = 1; i < game_state['snake_x'].length; i++){
            if (game_state.snake_x[i] == game_state.snake_x[0] && game_state.snake_y[i] == game_state.snake_y[0]){
                game_state.in_game = END;
            }  
        }

        // wall collision
        if(game_state.snake_x[0] < 0 || game_state.snake_x[0] >= WIDTH){
            game_state.in_game = END;
        }
        else if(game_state.snake_y[0] < 0 || game_state.snake_y[0] >= HEIGHT){
            game_state.in_game = END;
        }
    }
}

function move_snake() {
    // shift new coord, pop last
    // if growth, don't pop

    switch(game_state.dir){

        case move.LEFT:
            console.log('Left');
            
            game_state.snake_x.unshift(game_state.snake_x[0] - 1);
            game_state.snake_y.unshift(game_state.snake_y[0]);
            break;

        case move.RIGHT:
            console.log('Right');

            game_state.snake_x.unshift(game_state.snake_x[0] + 1);
            game_state.snake_y.unshift(game_state.snake_y[0]);
            break;

        case move.UP:
            console.log('Up');

            game_state.snake_x.unshift(game_state.snake_x[0]);
            game_state.snake_y.unshift(game_state.snake_y[0] - 1);
            break;

        case move.DOWN:
            console.log('Down');

            game_state.snake_x.unshift(game_state.snake_x[0]);
            game_state.snake_y.unshift(game_state.snake_y[0] + 1);
            break;
    }
    
    if(game_state.growth == false){
        game_state.snake_x.pop();
        game_state.snake_y.pop();
    }

    if(game_state.immune){
        game_state.snake_x[0] = (game_state.snake_x[0] + WIDTH)%WIDTH;
        game_state.snake_y[0] = (game_state.snake_y[0] + HEIGHT)%HEIGHT;
    }
    
    game_state.growth = false;
}