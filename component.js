sap.designstudio.sdk.Component.subclass("com.davelr.line.Line", function() {

	var that = this;

	this.tagCanvas = null;

	this.init = function() {
		this.tagCanvas = document.createElement("canvas");
		this.$().append($(this.tagCanvas));
	};
	
	this.afterUpdate = function() {
		line();
	};

	var color = null;
    this.color = function(value) {
        if(value == undefined) {
			return color;
        }
        else {
			color = value;
			return this;
        }
    };
    
	var lineSize = null;
    this.lineSize = function(value) {
        if(value == undefined) {
			return lineSize;
        }
        else {
			lineSize = value;
			return this;
        }
    };

	var showArrow = null;
    this.arrow = function(value) {
        if(value == undefined) {
			return showArrow;
        }
        else {
			showArrow = value;
			return this;
        }
    };
    
	var direction = null;
    this.direction = function(value) {
        if(value == undefined) {
			return direction;
        }
        else {
			direction = value;
			return this;
        }
    };
    
	var bendType = null;
    this.bendType = function(value) {
        if(value == undefined) {
			return bendType;
        }
        else {
			bendType = value;
			return this;
        }
    };


	function line() {
		
		var w = that.$().width();
		var h = that.$().height();
		var arrowW = (showArrow) ? 3 * lineSize : lineSize;

		that.tagCanvas.setAttribute("width", "" + Math.max(w, arrowW));
		that.tagCanvas.setAttribute("height", "" + Math.max(h, arrowW));
	    
	    // use getContext to use the canvas for drawing      
		var ctx = that.tagCanvas.getContext("2d");
		
		ctx.strokeStyle = color;
		ctx.lineWidth = lineSize;
		
		var lineOffset = lineSize / 2;
		var leftX = lineOffset + 0;
		var rightX = w - lineOffset;
		var X1vert = 0;
		var X2vert = 0;
		var X1horiz = 0;
		var X2horiz = w;
		var Y1 = 0;
		var Y2 = h / 2;
		var Y3 = h;
		var arrowX = (direction == "Left-Right") ? w - arrowW : 0;
		var leftArrow = 0;
		var rightArrow = 0;
		var sideArrowOffset = 0;
		
		// vertical line
		if (w <= 4 * lineSize) {
			Y3 = (showArrow) ? Y3 - arrowW : Y3;
			arrowX = Math.max(((w / 2) - (arrowW / 2)), 0);
			
    		ctx.beginPath();
    		
    		// Center the line vertically in the canvas
		    ctx.moveTo(Math.max(w / 2, arrowW / 2), Y1);
		    ctx.lineTo(Math.max(w / 2, arrowW / 2), Y3);
		    ctx.stroke();
		}
        
	    // horizontal line
		else if (h <= 4 * lineSize) {
			Y3 = (showArrow) ? Math.max(Y2 - (arrowW / 2), 0) : Y3;
			sideArrowOffset = (showArrow) ? (arrowW / 2) + lineOffset : 0;
			
			if (direction == "Left-Right") {
				X2horiz = (showArrow) ? rightX - (2 * lineSize) : X2horiz;
				rightArrow = arrowW / 2;
			}
			else if (direction == "Right-Left") {
				X1horiz = (showArrow) ? leftX + (2 * lineSize) : X1horiz;
				leftArrow = arrowW / 2;
			}
			
    		ctx.beginPath();
    		// Center the line horizontally in the canvas
		    ctx.moveTo(X1horiz, Math.max(Y2, arrowW / 2));
		    ctx.lineTo(X2horiz, Math.max(Y2, arrowW / 2));
		    ctx.stroke();
        }
		
		// line with a "bend"
		else {
			Y3 = (showArrow) ? Y3 - arrowW : Y3;
			
			// top bend
			if(bendType == "Top") {
				Yline = Y1 + lineOffset;
				
				if(direction == "Left-Right") {
					X1vert = (showArrow) ? rightX - lineSize : rightX;
					X2horiz = X1vert;
				}
				else if(direction == "Right-Left") {
					X1vert = (showArrow) ? leftX + (1 * lineSize) : leftX;
					X1horiz = X1vert;
				}
				X2vert = X1vert;
			}
			
			// middle bend
			else if(bendType == "Middle") {
				Yline = Y2;
				
				if(direction == "Left-Right") {
					X1vert = leftX;
					X2vert = (showArrow) ? rightX - lineSize : rightX;
					X2horiz = X2vert + lineOffset;
				}
				else if(direction == "Right-Left") {
					X1vert = rightX;
					X2vert = (showArrow) ? leftX + (1 * lineSize) : leftX;
					X1horiz = X2vert - lineOffset;
				}
			}
			
			// bottom bend
			else if(bendType == "Bottom") {
				Yline = Y3 - lineOffset;
				sideArrowOffset = (showArrow) ? (arrowW / 2) + lineOffset : 0;
				
				if(direction == "Left-Right") {
					X1vert = leftX;
					X2horiz = (showArrow) ? rightX - (2 * lineSize) : X2horiz;
					rightArrow = arrowW / 2;
				}
				else if(direction == "Right-Left") {
					X1vert = rightX;
					X1horiz = (showArrow) ? leftX + (2 * lineSize) : X1horiz;
					leftArrow = arrowW / 2;
				}	
				X2vert = X1vert;		
			}
			
			ctx.beginPath();
			
			// top half of vertical
			ctx.moveTo(X1vert, Y1);
			ctx.lineTo(X1vert, Y2);
			
			// bottom half of vertical
			ctx.moveTo(X2vert, Y2);
			ctx.lineTo(X2vert, Y3 + sideArrowOffset);
			
			// horizontal line
			ctx.moveTo(X1horiz, Yline + sideArrowOffset);
			ctx.lineTo(X2horiz, Yline + sideArrowOffset);
		    ctx.stroke();
		}

		if (showArrow) {				
			// draw arrow
			ctx.beginPath();
			ctx.moveTo(arrowX, Y3 + leftArrow);
			ctx.lineTo(arrowX + arrowW, Y3 + rightArrow);
			ctx.lineTo(arrowX + (arrowW / 2) - rightArrow + leftArrow, Y3 + arrowW);
			ctx.lineTo(arrowX, Y3 + leftArrow);
			ctx.fillStyle = color;
		    ctx.fill();
		}
	}});
