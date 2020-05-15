export class Command {
  public key: string;
  public commandName: string;
  public description: string;

  constructor(commandName: string, description: string, key: string = commandName) {
    this.key = key;
    this.commandName = commandName;
    this.description = description;
  }
}
