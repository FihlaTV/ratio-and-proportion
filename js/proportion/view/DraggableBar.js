// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */

import Range from '../../../../dot/js/Range.js';
import Util from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import proportion from '../../proportion.js';
import Node from '../../../../scenery/js/nodes/Node.js';

class DraggableBar extends Node {

  /**
   * @param {NumberProperty} valueProperty - must have a `range` attribute
   * @param {Property.<PaintDef>} colorProperty
   * @param {Property.<boolean>>} firstInteractionProperty - upon successful interaction, this will be marked as true
   * @param {Object} [options]
   */
  constructor( valueProperty, colorProperty, firstInteractionProperty, options ) {

    options = merge( {
      barWidth: 100,
      barHeight: 550,
      tandem: Tandem.OPTIONAL
    }, options );

    assert && assert( valueProperty.range instanceof Range );

    super();

    this.container = new Rectangle( 0, 0, options.barWidth, options.barHeight, 0, 0, {
      stroke: 'black'
    } );

    const valueRectangle = new Rectangle( 0, 0, options.barWidth, 0, 0, 0 );

    valueProperty.link( () => {
      const normalizedValue = valueProperty.range.getNormalizedValue( valueProperty.value );
      valueRectangle.rectHeight = normalizedValue * options.barHeight; //always 1 px of height
    } );
    colorProperty.link( color => valueRectangle.setFill( color ) );

    let offset = null;
    const dragListener = new DragListener( {
      start: () => {
        firstInteractionProperty.value = false;

        offset = valueRectangle.height;
      },
      drag: ( event, listener ) => {
        const y = listener.parentPoint.y;

        const newValue = Util.clamp( y + offset, 0, options.barHeight );

        valueProperty.value = newValue / options.barHeight;
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    valueRectangle.addInputListener( dragListener );

    const cueArrow = new ArrowNode( 0, 40, 0, -40, {
      doubleHead: true,
      fill: '#FFC000',
      headWidth: 40,
      headHeight: 20,
      tailWidth: 20,
      center: new Vector2( valueRectangle.centerX, valueRectangle.height )
    } );
    firstInteractionProperty.linkAttribute( cueArrow, 'visible' );


    this.addChild( new Node( { rotation: Math.PI, children: [ this.container, valueRectangle, cueArrow ] } ) );
    this.mutate( options );
  }
}

proportion.register( 'DraggableBar', DraggableBar );
export default DraggableBar;