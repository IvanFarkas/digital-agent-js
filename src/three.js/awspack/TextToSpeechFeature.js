import {AudioListener, Audio, PositionalAudio, Object3D} from 'three';
import {HostObject} from '../../core/HostObject';
import {TextToSpeechFeature as CoreTextToSpeechFeature} from '../../core/awspack/TextToSpeechFeature';

/**
 * Threejs PositionalAudio object
 * @external "AudioListener"
 * @see https://threejs.org/docs/#api/en/audio/AudioListener
 */

/**
 * Threejs Audio object
 * @external "Object3D"
 * @see https://threejs.org/docs/#api/en/core/Object3D
 */

/**
 * @extends core/TextToSpeechFeature
 * @alias three.js/TextToSpeechFeature
 *
 * @property {AudioListener} _listener - Three audio listener to use with audio..
 * @property {Object3D} _attachTo - Three audio listener to use with audio.
 * @property {Function=} _observeAudioContext - Observe Audio Context.
 * @property {any} _audioContext - Audio Context.
 * @property {boolean} _isGlobal - Is Global.
 */
export class TextToSpeechFeature extends CoreTextToSpeechFeature {
  /**
   * @constructor
   *
   * @param {HostObject} host - Host object managing the feature.
   * @param {Object=} options - Options that will be sent to Polly for each speech.
   * @param {AudioListener} options.listener - Three audio listener to use with audio.
   * @param {Object3D=} options.attachTo - Optional object to attach the speech audio to.
   */
  constructor(host, {voice = undefined, engine = undefined, language = undefined, audioFormat = 'mp3', sampleRate = undefined, listener = undefined, attachTo = undefined}) {
    const options = {voice: voice, engine: engine, language: language, audioFormat: audioFormat, sampleRate: sampleRate, listener: listener, attachTo: attachTo};

    super(host, options);
    this._listener = options.listener;
    this._attachTo = options.attachTo || host.owner;
    this._setAudioContext();
    this._observeAudioContext();
  }

  /**
   * Set Audio Context.
   *
   * @private
   */
  _setAudioContext() {
    if (this._listener) {
      this._audioContext = this._listener.context;
    }
  }

  /**
   * Create an Audio object and Three.js audio object of speech audio for the given speech text.
   *
   * @private
   *
   * @param {Object} params - Parameters object compatible with Polly.synthesizeSpeech.
   *
   * @returns {Promise} Resolves with an object containing the audio URL and Audio objects.
   */
  _synthesizeAudio(params) {
    return super._synthesizeAudio(params).then((result) => {
      if (this._attachTo !== undefined && !this._isGlobal) {
        // Create positional audio if there's an attach point
        result.threeAudio = new PositionalAudio(this._listener);
        this._attachTo.add(result.threeAudio);
      } else {
        // Create non-positional audio
        result.threeAudio = new Audio(this._listener);
      }

      // Set Audio object as the source
      result.threeAudio.setMediaElementSource(result.audio);

      return result;
    });
  }
}
