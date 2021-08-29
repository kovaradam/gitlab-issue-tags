type State =
  | 'READY'
  | 'AUTHORIZING'
  | 'FAILED_AUTH'
  | 'FETCHING'
  | 'BEFORE_ACTIVATION'
  | 'ERROR';

export class Store {
  private static state: State = 'BEFORE_ACTIVATION';

  static getState(): State {
    return Store.state;
  }

  static setState(newState: State): void {
    console.debug('new state', newState);
    Store.state = newState;
  }
}
