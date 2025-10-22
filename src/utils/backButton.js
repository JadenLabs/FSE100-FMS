class BackButton extends Button {
  constructor({ x, y, w, h, onClick = () => {} }) {
    super({ x, y, w, h, onClick});
    this.egg = new DinoEgg(x, y, w, y);
  }
  
  show() {
    this.egg.show();
  }
}