// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Util from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import proportion from '../../proportion.js';

/**
 * @constructor
 */
class ProportionModel {

  /**
   * @param {NumberProperty} leftValueProperty
   * @param {NumberProperty} rightValueProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( leftValueProperty, rightValueProperty, tandem, options ) {

    options = merge( {

      // {Color}
      correctColor: new Color( '#639a67' ),
      incorrectColor: new Color( '#FE70D4' )
    }, options );

    this.ratioProperty = new NumberProperty( .5, {
      range: new Range( 0, 1 )
    } );
    this.toleranceProperty = new NumberProperty( .05 );

    this.leftValueProperty = leftValueProperty;
    this.rightValueProperty = rightValueProperty;

    this.colorProperty = new DerivedProperty( [
      this.leftValueProperty,
      this.rightValueProperty,
      this.ratioProperty,
      this.toleranceProperty
    ], ( leftValue, rightValue, ratio, tolerance ) => {
      const maxValue = Math.max( leftValue, rightValue );
      const minValue = Math.min( leftValue, rightValue );
      const currentRatio = minValue / maxValue;
      if ( isNaN( currentRatio ) ) {
        return options.incorrectColor;
      }
      const ratioError = currentRatio - ratio;
      const normalizedError = Util.clamp( Math.abs( ratioError ) / tolerance, 0, 1 );
      return Color.interpolateRGBA( options.correctColor, options.incorrectColor, normalizedError );
    } );

    this.firstInteractionProperty = new BooleanProperty( true );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.ratioProperty.reset();
    this.toleranceProperty.reset();
    this.leftValueProperty.reset();
    this.rightValueProperty.reset();
  }

}

proportion.register( 'ProportionModel', ProportionModel );
export default ProportionModel;