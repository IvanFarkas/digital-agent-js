import {AnimationMixer} from 'three';
import {AnimationFeature as CoreAnimationFeature, AnimationTypes} from '../../core/animpack/AnimationFeature';
import {HostObject} from '../../core/HostObject';
import {SingleState} from './state/SingleState';

/**
 * Threejs AnimationMixer object
 * @external "AnimationMixer"
 * @see https://threejs.org/docs/#api/en/animation/AnimationMixer
 */
AnimationTypes.single = SingleState;
export {AnimationTypes};

/**
 * @extends core/AnimationFeature
 * @alias three.js/AnimationFeature
 *
 * @property {HostObject} _host - The HostObject managing the feature.
 * @property {AnimationMixer} _mixer - THREE Animation Mixer.
 * @property {boolean} _paused - paused.
 * @property {any} clip - Clip.
 */
export class AnimationFeature extends CoreAnimationFeature {
  /**
   * @constructor
   *
   * @param {three.js/HostObject} host - Host object that owns the feature.
   */
  constructor(host) {
    super(host);

    this._mixer = new AnimationMixer(host.owner);
  }

  _createSingleState(options) {
    // Duplicate the clip if it is already in use by another three action
    let {clip} = options;
    if (this._mixer.existingAction(clip)) {
      clip = clip.clone();
    }

    const threeAction = this._mixer.clipAction(clip);
    return new SingleState(options, threeAction);
  }

  /**
   * Gets the AnimationMixer for the host.
   *
   * @readonly
   * @type {AnimationMixer}
   */
  get mixer() {
    return this._mixer;
  }

  /**
   * Executes each time the host is updated.
   *
   * @param {number} deltaTime - Amount of time since the last host update was called.
   */
  update(deltaTime) {
    super.update(deltaTime);

    if (!this._paused) {
      this._mixer.update(deltaTime / 1000); // AnimationMixer requires delta time in seconds
    }
  }

  /**
   * Discard.
   */
  discard() {
    // Release THREE animation resources
    this._mixer.uncacheRoot(this._host.owner);

    super.discard();
  }
}
