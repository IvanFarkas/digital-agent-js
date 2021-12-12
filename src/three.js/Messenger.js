import {EventDispatcher} from 'three';
import {Messenger as CoreMessenger} from '../core/Messenger';

/**
 * @extends core/Messenger
 * @alias three.js/Messenger
 *
 * @property {Messenger} _dispatcher - Optional clock to manage time.
 */
export class Messenger extends CoreMessenger {
  /**
   * @constructor
   *
   * @param {any=} id - Id for the object. If none is provided a new id will be created. Id should be able to be represented as a string.
   */
  constructor(id) {
    super(id);
    this._dispatcher = this;
  }

  _createEvent(message, value) {
    return {detail: value, type: message};
  }
}

// TODO: What do we do with this?
// Assign Three.js EventDispatcher functionality to the Messenger class
Object.getOwnPropertyNames(EventDispatcher.prototype)
  .filter((prop) => prop !== 'constructor')
  .forEach((prop) => {
    Messenger.prototype[prop] = EventDispatcher.prototype[prop];
  });

// TODO: What do we do with this?
Object.defineProperty(Messenger, 'GlobalMessenger', {
  value: new Messenger(),
  writable: false,
});
