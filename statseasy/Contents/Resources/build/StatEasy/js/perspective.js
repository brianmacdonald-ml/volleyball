
/*
 * Unashamedly stolen from javax.media.jai.PerspectiveTransform:
 * https://jai-core.dev.java.net/source/browse/jai-core/src/share/classes/javax/media/jai/PerspectiveTransform.java
 */
function PerspectiveTransform() {
	
	// Start out as Identity
	var m00 = 1.0;
	var m01 = 0.0;
	var m02 = 0.0;
	var m10 = 0.0;
	var m11 = 1.0;
	var m12 = 0.0;
	var m20 = 0.0;
	var m21 = 0.0;
	var m22 = 1.0;
	
	/**
	 * Transform the point using the perspective transform matrix
	 */
	function transform(x , y) {
        var w = m20 * x + m21 * y + m22;
        return [(m00 * x + m01 * y + m02) / w,
                (m10 * x + m11 * y + m12) / w];
	}
	this.transform = transform;
	
	/**
     * Inverse transforms the specified point using the perspective transform matrix
     */
	function inverseTransform(x , y) {
        var tmp_x = (m11*m22 - m12*m21) * x +
		            (m02*m21 - m01*m22) * y +
		            (m01*m12 - m02*m11);
        var tmp_y = (m12*m20 - m10*m22) * x +
		            (m00*m22 - m02*m20) * y +
		            (m02*m10 - m00*m12);
        var w = (m10*m21 - m11*m20) * x +
	            (m01*m20 - m00*m21) * y +
	            (m00*m11 - m01*m10);

        return [tmp_x/w, tmp_y/w];
	}
	this.inverseTransform = inverseTransform;
	
	/**
	 * Set the transform matric to the one provided
	 */
	function setTransform(sm00, sm01, sm02,
						  sm10, sm11, sm12,
						  sm20, sm21, sm22)
	{
		m00 = sm00;
		m01 = sm01;
		m02 = sm02;
		m10 = sm10;
		m11 = sm11;
		m12 = sm12;
		m20 = sm20;
		m21 = sm21;
		m22 = sm22;
	}
	this.setTransform = setTransform;
	
	/**
	 * Get the transformation matrix for this PerspectiveTransform
	 */
	function getTransform() {
		return [[m00, m01, m02],
		        [m10, m11, m12],
		        [m20, m21, m22]];
	}
	this.getTransform = getTransform;
	
	/**
     * Replaces the matrix with its adjoint.
     */
    function makeAdjoint() {
        var m00p = m11*m22 - m12*m21;
        var m01p = m12*m20 - m10*m22; // flipped sign
        var m02p = m10*m21 - m11*m20;
        var m10p = m02*m21 - m01*m22; // flipped sign
        var m11p = m00*m22 - m02*m20;
        var m12p = m01*m20 - m00*m21; // flipped sign
        var m20p = m01*m12 - m02*m11;
        var m21p = m02*m10 - m00*m12; // flipped sign
        var m22p = m00*m11 - m01*m10;

        // Transpose and copy sub-determinants
        m00 = m00p;
        m01 = m10p;
        m02 = m20p;
        m10 = m01p;
        m11 = m11p;
        m12 = m21p;
        m20 = m02p;
        m21 = m12p;
        m22 = m22p;
    }
    this.makeAdjoint = makeAdjoint;
    
    /**
     * Post-concatenates a given PerspectiveTransform to this transform.
     * @throws IllegalArgumentException if Tx is null
     */
    function concatenate(tx) {
    	var txMatrix = tx.getTransform();
    	var tm00 = txMatrix[0][0];
    	var tm01 = txMatrix[0][1];
    	var tm02 = txMatrix[0][2];
    	var tm10 = txMatrix[1][0];
    	var tm11 = txMatrix[1][1];
    	var tm12 = txMatrix[1][2];
    	var tm20 = txMatrix[2][0];
    	var tm21 = txMatrix[2][1];
    	var tm22 = txMatrix[2][2];

        var m00p = m00*tm00 + m10*tm01 + m20*tm02;
        var m10p = m00*tm10 + m10*tm11 + m20*tm12;
        var m20p = m00*tm20 + m10*tm21 + m20*tm22;
        var m01p = m01*tm00 + m11*tm01 + m21*tm02;
        var m11p = m01*tm10 + m11*tm11 + m21*tm12;
        var m21p = m01*tm20 + m11*tm21 + m21*tm22;
        var m02p = m02*tm00 + m12*tm01 + m22*tm02;
        var m12p = m02*tm10 + m12*tm11 + m22*tm12;
        var m22p = m02*tm20 + m12*tm21 + m22*tm22;

        m00 = m00p;
        m10 = m10p;
        m20 = m20p;
        m01 = m01p;
        m11 = m11p;
        m21 = m21p;
        m02 = m02p;
        m12 = m12p;
        m22 = m22p;
    }
    this.concatenate = concatenate;
	
}

/**
 * Creates a PerspectiveTransform that maps the unit square
 * onto an arbitrary quadrilateral.
 *
 * <pre>
 * (0, 0) -> (x0, y0)
 * (1, 0) -> (x1, y1)
 * (1, 1) -> (x2, y2)
 * (0, 1) -> (x3, y3)
 * </pre>
 */
function getSquareToQuad(x0, y0,
						 x1, y1,
						 x2, y2,
						 x3, y3) 
{
	var dx3 = x0 - x1 + x2 - x3;
	var dy3 = y0 - y1 + y2 - y3;

	var m00, m01, m02;
	var m10, m11, m12;
	var m20, m21, m22;
	
	m22 = 1.0;

	if ((dx3 == 0.0) && (dy3 == 0.0)) { // to do: use tolerance
		m00 = x1 - x0;
		m01 = x2 - x1;
		m02 = x0;
		m10 = y1 - y0;
		m11 = y2 - y1;
		m12 = y0;
		m20 = 0.0;
		m21 = 0.0;
	} else {
		var dx1 = x1 - x2;
		var dy1 = y1 - y2;
		var dx2 = x3 - x2;
		var dy2 = y3 - y2;
		
		var invdet = 1.0/(dx1*dy2 - dx2*dy1);
		m20 = (dx3*dy2 - dx2*dy3)*invdet;
		m21 = (dx1*dy3 - dx3*dy1)*invdet;
		m00 = x1 - x0 + m20*x1;
		m01 = x3 - x0 + m21*x3;
		m02 = x0;
		m10 = y1 - y0 + m20*y1;
		m11 = y3 - y0 + m21*y3;
		m12 = y0;
	}
	
	var tx = new PerspectiveTransform();
	tx.setTransform(m00, m01, m02,
					m10, m11, m12,
					m20, m21, m22);
	
	return tx;
}
PerspectiveTransform.getSquareToQuad = getSquareToQuad;

/**
 * Creates a PerspectiveTransform that maps an arbitrary
 * quadrilateral onto the unit square.
 *
 * <pre>
 * (x0, y0) -> (0, 0)
 * (x1, y1) -> (1, 0)
 * (x2, y2) -> (1, 1)
 * (x3, y3) -> (0, 1)
 * </pre>
 */
function getQuadToSquare(x0, y0,
                         x1, y1,
                         x2, y2,
                         x3, y3) 
{
    var tx = PerspectiveTransform.getSquareToQuad(x0, y0, x1, y1, x2, y2, x3, y3);
    tx.makeAdjoint();
    return tx;
}
PerspectiveTransform.getQuadToSquare = getQuadToSquare;

/**
 * Creates a PerspectiveTransform that maps an arbitrary
 * quadrilateral onto another arbitrary quadrilateral.
 *
 * <pre>
 * (x0, y0) -> (x0p, y0p)
 * (x1, y1) -> (x1p, y1p)
 * (x2, y2) -> (x2p, y2p)
 * (x3, y3) -> (x3p, y3p)
 * </pre>
 */
function getQuadToQuad(x0, y0,
                       x1, y1,
                       x2, y2,
                       x3, y3,
                       x0p, y0p,
                       x1p, y1p,
                       x2p, y2p,
                       x3p, y3p) 
{
    var tx1 = PerspectiveTransform.getQuadToSquare(x0, y0, x1, y1, x2, y2, x3, y3);

    var tx2 = PerspectiveTransform.getSquareToQuad(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);

    tx1.concatenate(tx2);
    
    return tx1;
}
PerspectiveTransform.getQuadToQuad = getQuadToQuad;