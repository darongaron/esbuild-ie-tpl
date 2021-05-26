export default class GreeterJa {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "こんにちは、" + this.greeting;
  }
}
