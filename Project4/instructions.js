            var myGamePiece;
            var myObstacles = [];
            var check;
            var mySound;
            var myMusic;
            var restartButton;

            function startGame() 
            {
                myGamePiece = new component(30, 30, "orange", 10, 120);          //the player
                myGamePiece.gravity = 1;                                        //set the gravity
                mySound = new sound("thunk.mp3");
                myMusic = new sound("Underfall.mp3");
                myMusic.play();
                myGameArea.start();
                check = false;
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

                        check = true;
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

                myGameArea.frameNo += 1;          

                if (myGameArea.frameNo == 1 || everyinterval(250)) 
                { 
                    x = myGameArea.canvas.width;
                    minHeight = 100;
                    maxHeight = 400;
                    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
                    minGap = 100
                    maxGap = 100
                    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
                    myObstacles.push(new component(10, height, "white", x, 0));
                    myObstacles.push(new component(10, x - height - gap, "white", x, height + gap));
                }

                for (i = 0; i < myObstacles.length; i += 1) 
                {
                    myObstacles[i].x += -1;
                    myObstacles[i].update();
                }

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

            function ResetStats()
            {
                myGamePiece = new component(30, 30, "orange", 10, 120);  
                myGamePiece.gravity = 1; 
            }

            function Over()
            {
                ResetStats();
                
            }
