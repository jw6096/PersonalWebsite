var myGamePiece;
            var myObstacles = [];
            var myScore;
            var check;
            var highScore = localStorage.getItem("highScore");
            var numberScore;
            var mySound;
            var myMusic;
            var restartButton;
            var play;

            function startGame() 
            {
                myGamePiece = new component(30, 30, "orange", 10, 120);          //the player
                myGamePiece.gravity = 1;                                        //set the gravity
                myScore = new component("30px", "Bungee Inline", "dimgray", 280, 40, "text");      //score size, text, color, and font
                mySound = new sound("thunk.mp3");
                myMusic = new sound("Demons.mp3");
                myMusic.play();
                myGameArea.start();
                check = false;
                numberScore = 0;
                restartButton = document.querySelector('#restart');
                play = document.querySelector("#butt");
            }

            function sound(src) 
            {
                this.sound = document.createElement("audio");
                this.sound.src = src;
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.play = function()
                {
                    this.sound.play();
                }

                this.stop = function()
                {
                    this.sound.pause();
                }    
            }

            var myGameArea = 
            {
                canvas : document.createElement("canvas"),              //create new canvas

                start : function() 
                {
                    this.canvas.width = 500;        //size of canvas
                    this.canvas.height = 500;
                    this.context = this.canvas.getContext("2d");            //2d canvas
                    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                    this.frameNo = 0;
                    this.interval = setInterval(updateGameArea, 20);        //sets the speed of the game
                },

                clear : function() 
                {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            }

            function component(width, height, color, x, y, type) 
            {
                this.type = type;
                this.score = 0;
                this.width = width;
                this.height = height;
                this.speedX = 0;
                this.speedY = 0;    
                this.x = x;
                this.y = y;
                this.gravity = 0;
                this.gravitySpeed = 0;

                this.update = function() 
                {
                    ctx = myGameArea.context;
                    if (this.type == "text") 
                    {
                        ctx.font = this.width + " " + this.height;
                        ctx.fillStyle = color;
                        ctx.fillText(this.text, this.x, this.y);
                    } 
                    else 
                    {
                        ctx.fillStyle = color;
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                    }
                }

                this.newPos = function() 
                {
                    this.gravitySpeed += this.gravity;
                    this.y += this.gravitySpeed;
                    this.hitBottom();
                    this.hitTop();
                }

                this.hitBottom = function() 
                {
                    var rockbottom = myGameArea.canvas.height - this.height;

                    if (this.y > rockbottom) 
                    {
                        this.y = rockbottom;
                        this.gravitySpeed = 0;
                    }
                }

                this.hitTop = function() 
                {
                    var skyHigh = 0;

                    if (this.y < skyHigh) 
                    {
                        this.y = skyHigh;                   //prevents game piece from flying off
                        this.gravitySpeed = 0;              //prevents the game piece from "sticking" to the top because of excess acceleration
                    }
                }

                this.crashWith = function(otherobj) 
                {
                    var myleft = this.x;
                    var myright = this.x + (this.width);
                    var mytop = this.y;
                    var mybottom = this.y + (this.height);
                    var otherleft = otherobj.x;
                    var otherright = otherobj.x + (otherobj.width);
                    var othertop = otherobj.y;
                    var otherbottom = otherobj.y + (otherobj.height);
                    var crash = true;

                    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
                    {
                        crash = false;
                    }
                    
                     if (crash == true && check == false)
                    {
                        mySound.play();
                        myMusic.stop();
                        
                        play.style.display = "initial";
                        restartButton.style.display = "initial";  //puts this own when game is over

                        if (highScore < numberScore)
                        {
                            alert("Game Over! You scored " + numberScore + ". The previous high score was " + highScore + ". Congratulations! You now have the high score!");
                            check = true;
                        }
                        else
                        {
                            alert("Game Over! You scored " + numberScore + ". The high score is " + highScore + ".");
                            check = true;
                        }
                    }

                    return crash;
                }
            }   

            function updateGameArea() 
            {
                var x, height, gap, minHeight, maxHeight, minGap, maxGap;

                for (i = 0; i < myObstacles.length; i += 1) 
                {
                    if (myGamePiece.crashWith(myObstacles[i])) 
                    {
                        return;
                    } 
                }

                myGameArea.clear();

                numberScore = myGameArea.frameNo += 1; //adds score

                if (highScore !== null)
                {
                    if (numberScore > highScore)
                    {
                        localStorage.setItem("highScore", numberScore);
                    }
                }
                else
                {
                    localStorage.setItem("highScore", numberScore);
                }             

                if (myGameArea.frameNo == 1 || everyinterval(125)) 
                { 
                    x = myGameArea.canvas.width;
                    minHeight = 100;
                    maxHeight = 400;
                    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
                    minGap = 55
                    maxGap = 55
                    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
                    myObstacles.push(new component(10, height, "white", x, 0));
                    myObstacles.push(new component(10, x - height - gap, "white", x, height + gap));
                }

                for (i = 0; i < myObstacles.length; i += 1) 
                {
                    myObstacles[i].x += -1;
                    myObstacles[i].update();
                }

                myScore.text="SCORE: " + myGameArea.frameNo;
                myScore.update();
                myGamePiece.newPos();
                myGamePiece.update();
            }

            function everyinterval(n)  
            {
                if ((myGameArea.frameNo / n) % 1 == 0) //line changes the interval of the bars
                {
                    return true;
                } 
                return false;
            }

            function accelerate(n) 
            {
                myGamePiece.gravity = n;
            }

            function Restart()
            {
                location.reload();
            }