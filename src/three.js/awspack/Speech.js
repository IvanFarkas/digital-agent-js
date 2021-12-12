import THREE from 'three';
import {Speech as CoreSpeech} from '../../core/awspack/Speech';
import {TextToSpeechFeature} from '../../core/awspack/TextToSpeechFeature.js';

/**
 * Threejs Audio object
 * @external "THREE.Audio"
 * @see https://threejs.org/docs/#api/en/audio/Audio
 */

/**
 * Threejs PositionalAudio object
 * @external "THREE.PositionalAudio"
 * @see https://threejs.org/docs/#api/en/audio/PositionalAudio
 */

/**
 * @extends core/Speech
 * @alias three.js/Speech
 *
 * @property {any} _audio - Audio.
 * @property {any} _threeAudio - THREE Audio.
 */
export class Speech extends CoreSpeech {
  /**
   * @constructor
   *
   * @param {TextToSpeechFeature} textToSpeech - The owner of the Speech that will emit speechmark messages.
   * @param {string} text - The text of the speech.
   * @param {Array.<Object>} speechmarks - An array of speechmark objects representing the text and timing of the speech.
   * @param {Object} audioConfig - Object containing audio and url.
   * @param {Audio} audioConfig.audio - Playable audio object.
   * @param {(THREE.Audio|THREE.PositionalAudios)} audioConfig.threeAudio - Three.js audio object.
   */
  constructor(textToSpeech, text, speechmarks = [], audioConfig) {
    super(textToSpeech, text, speechmarks, audioConfig);
    this._threeAudio = audioConfig.threeAudio;
  }

  /**
   * Gets the Three.js audio object for the speech.
   *
   * @readonly
   * @type {(THREE.Audio|THREE.PositionalAudio)}
   */
  get audio() {
    return this._threeAudio;
  }

  _pauseAudio() {
    this._audio.pause();
  }

  play(currentTime, onFinish, onError, onInterrupt) {
    // Re-connect the Audio element to stop playback
    this._threeAudio.disconnect();
    this._threeAudio.connect();

    return super.play(currentTime, onFinish, onError, onInterrupt);
  }
}
