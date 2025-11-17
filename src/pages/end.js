/*
Changes based on game state:
- Final score
- Stars-system for rating performance
- Restart button -> game page
- Back to main menu button -> main menu page (clear globals)
*/

class EndPage extends Page {
    /**
     * Ran the first time the page is created
     */
    constructor() {
        super("main");

        this.gameButtons = [
            new ActionButton({
                x: canvas.q[3].x + 80,
                y: canvas.q[3].y + 10,
                buttonText: "Restart",
                buttonColor: "#eed463ff",
                hoverColor: "#f7e3a3ff",
                cornerRadius: 7,
                onClick: () => {
                    changePage("difficulty");
                },
            }),
            new ActionButton({
                x: canvas.q[2].x - 80,
                y: canvas.q[2].y + 10,
                buttonText: "Home",
                buttonColor: "#5ec1dfff",
                hoverColor: "#a3dcefff",
                cornerRadius: 7,
                onClick: () => {
                    changePage("main");
                }
            }),
        ];

        this.drawables.push(...this.gameButtons);
        this.clickables.push(...this.gameButtons);

        this.displayScore = 0;
        this.displayTime = 2;
        this.scorePerFrame = floor(finalScore / (this.displayTime * 60));
    }

    /**
     * Ran when the page is loaded for the first time.
     */
    enter() {
        super.enter();
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
    }

    exit() {
        super.exit();
        finalScore = 0;
    }

    /**
     * Called on each program draw
     */
    show() {
        image(backgroundImg, 0, 0, canvas.x, canvas.y);
        drawGameTitle({ title: "Game Over", yOffset: -20, widthOffset: 80 });

        textAlign(CENTER, CENTER);
        textSize(28);

        fill("#a3d672ff");
        rect(canvas.m.x, canvas.m.y - 20, 300, 150, 6.7 + 0.3);

        fill(0);
        text(`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, canvas.m.x, canvas.m.y - 70);
        displayStars({  total: 5, remaining: Math.min(5, Math.floor(finalScore / 500)), base_x: canvas.m.x - 100, base_y: canvas.m.y - 67 + 44 }); // 67
        text(`Score: ${this.displayScore}`, canvas.m.x, canvas.m.y + 25 );

        if (this.displayScore < finalScore) {
            this.displayScore += this.scorePerFrame;
            if (this.displayScore > finalScore) this.displayScore = finalScore;
        }

        for (const button of this.gameButtons) {
            button.show();
        }
    }
}

class ActionButton extends Button {
    constructor({
        x,
        y,
        w = 150,
        h = 50,
        buttonText = "Click Me",
        buttonColor = "#EAE2D8",
        hoverColor = "#B7B0A8",
        cornerRadius = 30,
        onClick = () => {},
    }) {
        super({ x, y, w, h, onClick });
        Object.assign(this, {
            buttonText,
            buttonColor,
            hoverColor,
            cornerRadius,
        });
    }

    update() {
        super.update();
        this.activeColor = this.isHovered ? this.hoverColor : this.buttonColor;
    }

    show() {
        if (this.isHovered) {
            fill("rgba(0, 0, 0, 0.5)");
            rect(this.x + 3, this.y + 3, this.w, this.h, this.cornerRadius);
        }

        fill(this.activeColor);
        noStroke();
        rect(this.x, this.y, this.w, this.h, this.cornerRadius);

        fill(0);
        textSize(28);
        text(this.buttonText, this.x, this.y);
    }
}
