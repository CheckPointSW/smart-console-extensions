export default class Subscriber {
  //
  public subscriberId: string;

  //
  public operation: any;

  constructor(subscriberId: string, operation: any) {
    this.operation = operation;
    this.subscriberId = subscriberId;
  }
}
