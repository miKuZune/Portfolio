// Responsible for creating the simulation environment and running the elements within the simulation.
class SimulationManager
{
    constructor(containerID, boidsImgSrc, boidNumber)
    {
        // Setup class variables
        this.container = document.getElementById(containerID);

        this.canvas = undefined;
        this.context = undefined;

        this.boids = undefined;

        this.boidImg = new Image();
        this.boidImg.src = boidsImgSrc;

        // Call methods
        //      Setup the simulation environment
        this.CreateCanvas();

        this.SetupEventListeners();

        //      Populate the environment with elements

        var script = this;
        this.boidImg.onload = function()
        {
            console.log('img loaded');
            script.CreateBoids(boidNumber);

            // Start the Simulation loop
            console.log('Simulation begins');
            script.Loop();
        }
    }

    Loop()
    {
        var script = this;
        update();

        function update()
        {
            // Clear the canvas
            script.context.clearRect(0, 0, script.canvas.width, script.canvas.height);

            // Draw the boids
            for(var i = 0; i < script.boids.length; i++)
            {
                script.boids[i].Update();
            }

        }

        setInterval(update, 17);
    }

    // Environment setup

    SetupEventListeners()
    {
        document.body.onresize = this.OnWindowResize.bind(this);
    }

    CreateCanvas()
    {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.ScaleCanvas();

        this.container.appendChild(this.canvas);
    }

    OnWindowResize(event)
    {
        this.ScaleCanvas();
    }

    ScaleCanvas()
    {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    // Elements setup
    CreateBoids(numberOfBoids)
    {
        this.boids = new Array();
        for(var i = 0; i < numberOfBoids; i++)
        {
            this.boids[i] = new Boid(this.canvas);
            this.boids[i].SetImg(this.boidImg);
        }
    }

}

class Boid
{
    constructor(canvas)
    {
        // Variables
        this.canvas = canvas;
        this.representation = this.canvas.getContext("2d");

        //      Movement
        this.direction = undefined;

        //      Position on screen
        this.position = undefined;

        //      Visual settings
        this.color = undefined;
        this.img = undefined;
        this.scale = new Vector2(10,10);
        

        //      Validation variables
        this.offscreenLimit = 20;

        // Methods
        var startPosition = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
        this.SetPosition(startPosition);

        var direction = new Vector2((Math.random() * 4) - 2, (Math.random() * 2) - 1)
        this.SetDirection( direction );

        this.Draw();
    }

    Update()
    {
        this.Translate(this.direction);

        this.Draw();
    }

    SetDirection(direction)
    {
        this.direction = direction;
    }

    CreateRepresentation(color)
    {
        if(color == null)
        {
            color = "#FF0000";
        }

        this.representation.fillStyle = color;
        this.representation.fillRect(0,0,10,10);
    }

    SetColor(color)
    {
        this.color = color;
    }

    SetImg(img)
    {
        this.img = img;
    }

    SetPosition(position)
    {
        if(!(position instanceof Vector2))
        {
            console.log('invalid variable type');
            return;
        }
        this.position = position;
    }

    Translate(movement)
    {
        this.position.Translate(movement);
        this.ValidatePosition();
    }

    SetScale(scale)
    {
        this.scale = scale;
    }

    SetOffscreenLimt(offscreenLimit)
    {
        this.offscreenLimit = offscreenLimit;
    }

    Draw()
    {
        if(this.color == undefined)
        {
            this.color = 'red';
        }

        // Draw square unless given an image
        if(this.img == undefined)
        {
            this.representation.fillStyle = this.color;
            this.representation.fillRect(this.position.x, this.position.y, this.scale.x , this.scale.y);
        }else
        {
            this.representation.drawImage(this.img, this.position.x, this.position.y, this.scale.x , this.scale.y);
        }
        
    }

    ValidatePosition()
    {
        // Validate horizontal position
        if(this.position.x < 0 - this.offscreenLimit)
        {
            this.position.x = this.canvas.width + this.offscreenLimit - 1;
        }else if(this.position.x > this.canvas.width + this.offscreenLimit)
        {
            this.position.x = 1 - this.offscreenLimit;
        }

        // Validate vertical position
        if(this.position.y < 0 - this.offscreenLimit)
        {
            this.position.y = this.canvas.height + this.offscreenLimit - 1;
        }else if(this.position.y > this.canvas.height + this.offscreenLimit)
        {
            this.position.y = 1 - this.offscreenLimit;
        }
    }
}

class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    Translate(movement)
    {
        if(!(movement instanceof Vector2)){return;}
        this.x += movement.x;
        this.y += movement.y;
    }
}