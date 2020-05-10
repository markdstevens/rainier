export class Command {
  public key: string;
  public commandName: string;
  public description: string;

  constructor(key: string, commandName: string, description: string) {
    this.key = key;
    this.commandName = commandName;
    this.description = description;
  }
}
