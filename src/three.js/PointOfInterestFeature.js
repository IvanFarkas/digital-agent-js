import {Object3D} from 'three';
import {PointOfInterestFeature as CorePointOfInterestFeature, AxisMap} from '../core/PointOfInterestFeature';

export {AxisMap};

/**
 * Point of Interest Feature
 *
 * @extends core/PointOfInterestFeature
 * @alias three.js/PointOfInterestFeature
 *
 * @property {Object=} _scene - Optional clock to manage time.
 * @property {Object3D} target - Optional clock to manage time.
 */
export class PointOfInterestFeature extends CorePointOfInterestFeature {
  static _getWorldPosition(obj) {
    obj.updateWorldMatrix(true, false);
    return obj.matrixWorld.elements.slice(12, 15);
  }

  static _getWorldMatrix(obj) {
    obj.updateWorldMatrix(true, false);
    return [...obj.matrixWorld.elements];
  }

  /**
   * Validate Transform Object
   *
   * @private
   *
   * @param {Object} obj - Transform Object.
   *
   * @returns {Object3D}
   */
  _validateTransformObject(obj) {
    return obj instanceof Object3D;
  }

  /**
   * Finds an object given its name and sets it as the new target to look at. Should be overloaded for each rendering engine implementation.
   *
   * @param {string} name - Name to search for.
   */
  setTargetByName(name) {
    super.setTargetByName(name);
    if (!name) {
      return;
    }

    this.target = this._scene.getObjectByName(name);
  }

  /**
   * Finds an object given its id and sets it as the new target to look at. Should be overloaded for each rendering engine implementation.
   *
   * @param {string|number} id - Id to search for.
   */
  setTargetById(id) {
    super.setTargetByName(id);
    if (!id) {
      return;
    }

    this.target = this._scene.getObjectById(id);
  }
}
