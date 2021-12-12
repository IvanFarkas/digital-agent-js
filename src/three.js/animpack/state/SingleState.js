import {AnimationAction, NormalAnimationBlendMode, AdditiveAnimationBlendMode, LoopOnce, LoopRepeat} from 'three';
import {MathUtils} from '../../../core/MathUtils';
import {SingleState as CoreSingleState} from '../../../core/animpack/state/SingleState';
import {AbstractState} from '../../../core/animpack/state/AbstractState';
import {Deferred} from '../../../core/Deferred';

/**
 * Threejs AnimationAction object
 * @external "AnimationAction"
 * @see https://threejs.org/docs/#api/en/animation/AnimationAction
 */

const threeBlendModes = {
  Override: NormalAnimationBlendMode,
  Additive: AdditiveAnimationBlendMode,
};

/**
 * @extends core/SingleState
 * @alias three.js/SingleState
 *
 * @property {Function=} _onFinishedEvent - On Finished Event.
 * @property {Function=} _promises - Promises.
 * @property {boolean} _paused - Paused.
 * @property {AnimationAction} _threeAction - THREE Animation Action.
 * @property {number} _loopCount - Loop Count.
 * @property {number} _timeScale - Time Scale.
 * @property {number} _internalWeight - Internal Weight.
 * @property {any} _blendMode - Blend Mode.
 * @property {boolean} weightPending - Weight Pending.
 * @property {boolean} timeScalePending - Time Scale Pending.
 */
export class SingleState extends CoreSingleState {
  /**
   * @constructor
   *
   * @param {Object=} options - Options for the animation state.
   * @param {AnimationAction} threeAction - Animation action that controls playback of the clip.
   */
  constructor(options = {}, threeAction) {
    super(options);

    // Callback to catch THREE animation action completion
    this._onFinishedEvent = ({type, action}) => {
      // Exit if this isn't the finish event for this animation
      if (type !== 'finished' || action !== this.threeAction) {
        return;
      }

      this._promises.play.resolve();

      // Stop evaluating interpolators if they have already completed
      if (!this.weightPending && !this.timeScalePending) {
        this._paused = true;
      }
    };

    this._threeAction = threeAction;
    this._threeAction.clampWhenFinished = true; // Hold the last frame on completion
    this._threeAction.enabled = false;
    this._threeAction.loop = this._loopCount === 1 ? LoopOnce : LoopRepeat;
    this._threeAction.paused = this._paused;
    this._threeAction.repetitions = this._loopCount;
    this._threeAction.timeScale = this._timeScale;
    this._threeAction.weight = this._internalWeight;
    this._threeAction.blendMode = threeBlendModes[this._blendMode];

    // Start listening for animation finished events
    this._threeAction.getMixer().addEventListener('finished', this._onFinishedEvent);
  }

  /**
   * Gets the THREE.AnimationAction object.
   *
   * @readonly
   * @type {AnimationAction}
   */
  get threeAction() {
    return this._threeAction;
  }

  /**
   * Get normalized Time.
   *
   * @type {number}
   */
  get normalizedTime() {
    if (this._threeAction.time && this._threeAction.getClip() && this._threeAction.getClip().duration) {
      return this._threeAction.time / this._threeAction.getClip().duration;
    }
    return 0;
  }

  /**
   * Set normalized Time.
   *
   * @type {number}
   */
  set normalizedTime(time) {
    time = MathUtils.clamp(time);
    this._threeAction.time = this._threeAction.getClip().duration * time;
  }

  /**
   * Get weight.
   *
   * @type {number}
   */
  get weight() {
    return super.weight;
  }

  /**
   * Set weight.
   *
   * @type {number}
   */
  set weight(weight) {
    super.weight = weight;

    this._threeAction.enabled = true;
  }

  /**
   * Multiplies the user weight by a factor to determine the internal weight.
   *
   * @param {number} factor - 0-1 multiplier to apply to the user weight.
   */
  updateInternalWeight(factor) {
    super.updateInternalWeight(factor);

    this._threeAction.setEffectiveWeight(this._internalWeight);
  }

  /**
   * Gets the a factor to scale animation playback speed with.
   *
   * @type {number}
   */
  get timeScale() {
    return super.timeScale;
  }

  /**
   * Sets the a factor to scale animation playback speed with.
   *
   * @type {number}
   */
  set timeScale(timeScale) {
    super.timeScale = timeScale;

    this._threeAction.timeScale = timeScale;
  }

  /**
   * Get the number of times the animation will repeat before finishing.
   *
   * @type {number}
   */
  get loopCount() {
    return super.loopCount;
  }

  /**
   * Set the number of times the animation will repeat before finishing.
   *
   * @type {number}
   */
  set loopCount(loopCount) {
    super.loopCount = loopCount;

    this._threeAction.loop = loopCount === 1 ? LoopOnce : LoopRepeat;
    this._threeAction.repetitions = loopCount;
  }

  /**
   * Start playback of the sub-states from the beginning.
   *
   * @param {Function=} onFinish - Function to execute when the state finishes.
   * @param {Function=} onError - Function to execute if the state encounters an error during playback.
   * @param {Function=} onCancel - Function to execute if playback is canceled.
   *
   * @returns {Deferred}
   */
  play(onFinish, onError, onCancel) {
    // Restart animation
    this._threeAction.reset();
    this._threeAction.play();

    return super.play(onFinish, onError, onCancel);
  }

  /**
   * Pause playback of the sub-states. This prevents pending promises from being executed.
   *
   * @returns {boolean}
   */
  pause() {
    // Make sure animation has influence
    this._threeAction.paused = true;
    this._threeAction.play();

    return super.pause();
  }

  /**
   * Resume playback of the sub-states.
   *
   * @param {Function=} onFinish - Function to execute when the state finishes.
   * @param {Function=} onError - Function to execute if the state encounters an error during playback.
   * @param {Function=} onCancel - Function to execute if playback is canceled.
   *
   * @returns {Deferred}
   */
  resume(onFinish, onError, onCancel) {
    // Make sure the animation can play and has influence
    this._threeAction.paused = false;
    this._threeAction.enabled = true;
    this._threeAction.play();

    return super.resume(onFinish, onError, onCancel);
  }

  /**
   * Cancel playback of the sub-states and cancel any pending promises.
   *
   * @returns {boolean}
   */
  cancel() {
    // Stop animation playback
    this._threeAction.paused = true;

    return super.cancel();
  }

  /**
   * Stop playback of the sub-states and resolve any pending promises.
   *
   * @returns {boolean}
   */
  stop() {
    // Restart and pause the animation
    this._threeAction.reset();
    this._threeAction.paused = true;
    this._threeAction.play();

    return super.stop();
  }

  /**
   * Discards all sub-state resources.
   */
  discard() {
    // Stop the animation from having influence
    this._threeAction.enabled = false;

    // Stop listening for finish events
    this._threeAction.getMixer().removeEventListener('finished', this._onFinishedEvent);

    super.discard();
  }
}
