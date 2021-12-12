/**
 * @module three/HOST
 */

import aws from './awspack';
import anim from './animpack';

import {Utils} from '../core/Utils';
import {MathUtils} from '../core/MathUtils';
import {Deferred} from '../core/Deferred';
import {LipsyncFeature, DefaultVisemeMap} from '../core/LipsyncFeature';
import {GestureFeature, DefaultGestureWords} from '../core/GestureFeature';
import {PointOfInterestFeature, AxisMap} from './PointOfInterestFeature';
import {env} from './HostEnvironment';
import {Messenger} from './Messenger';
import {HostObject} from './HostObject';

export default {
  /**
   * @see env
   */
  env,
  /**
   * @see Utils
   */
  Utils,
  /**
   * @see MathUtils
   */
  MathUtils,
  /**
   * @see Deferred
   */
  Deferred,
  /**
   * @see three.js/Messenger
   */
  Messenger,
  /**
   * @see three.js/HostObject
   */
  HostObject,
  /**
   * @see core/LipsyncFeature
   */
  LipsyncFeature,
  /**
   * @see GestureFeature
   */
  GestureFeature,
  /**
   * @see three.js/PointOfInterestFeature
   */
  PointOfInterestFeature,
  /**
   * @see DefaultVisemeMap
   */
  DefaultVisemeMap,
  /**
   * @see DefaultGestureWords
   */
  DefaultGestureWords,
  /**
   * @see AxisMap
   */
  AxisMap,
  /**
   * @see module:three/awspack
   */
  aws,
  /**
   * @see module:three/animpack
   */
  anim,
};
