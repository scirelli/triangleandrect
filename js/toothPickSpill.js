"use strict";

if( tarah === undefined ) var tarah = new Object(); //namespace

;(function( $j, tarah ){
    tarah.Point = Class.create({
        initialize: function(x, y) {
            this.x = parseFloat(x) || 0;
            this.y = parseFloat(y) || 0;
        }
    });

    tarah.Rect = Class.create({
        initialize: function(x, y, w, h) {
            this.x = parseFloat(x) || 0;
            this.y = parseFloat(y) || 0;
            this.w = parseFloat(w) || 0;
            this.h = parseFloat(h) || 0;

        }
    });

    tarah.Line = Class.create({
        initialize: function( x1, y1, x2, y2 ){
            if( x1 instanceof tarah.Point && y1 instanceof tarah.Point ){
                this.p1 = x1;
                this.p2 = y1;
            }else{
                this.p1 = new tarah.Point(x1,y1);
                this.p2 = new tarah.Point(x2,y2);
            }
        }
    });

    //------------------------------------------------
    // Interface IToothpickBoard 
    //------------------------------------------------
    tarah.IToothpickBoard = Class.create({
        //------------------------------------------------
        //
        //------------------------------------------------
        initialize: function( ) {
        },

        clearBoard: function(){
            throw 'Unimplemented Method';
        },

        drawGrid: function() {
            throw 'Unimplemented Method';
        },

        dropToothpicks: function(){
            throw 'Unimplemented Method';
        },

        play: function(){
            throw 'Unimplemented Method';
        }
    });
    
    //------------------------------------------------
    // Abstract Class AToothpickBoard 
    //------------------------------------------------
    tarah.AToothpickBoard = Class.create(tarah.IToothpickBoard,{
        //------------------------------------------------
        //
        //------------------------------------------------
        initialize: function( $super, nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt, nToothpickCnt, nRadius ) {
            $super();
            this.nX              = isNaN(parseFloat(nX)) ? tarah.BoardX : parseFloat(nX);
            this.nY              = isNaN(parseFloat(nY)) ? tarah.BoardY : parseFloat(nY);
            this.nWidth          = isNaN(parseFloat(nWidth)) ? tarah.BoardWidth : parseFloat(nWidth);
            this.nHeight         = isNaN(parseFloat(nHeight)) ? tarah.BoardHeight : parseFloat(nHeight);
            this.nBoardXCnt      = isNaN(parseFloat(nBoardXCnt)) ? tarah.BoardCntX : parseFloat(nBoardXCnt);
            this.nBoardYCnt      = isNaN(parseFloat(nBoardYCnt)) ? tarah.BoardCntY : parseFloat(nBoardYCnt);
            this.nBlockWidth     = this.nWidth/nBoardXCnt;
            this.nBlockHeight    = this.nHeight/nBoardYCnt;
            this.aGridLines      = new Array();
            this.aToothPicks     = new Array();
            this.nToothPickXLn   = 0;
            this.nToothPickCount = isNaN(parseFloat(nToothpickCnt)) ? tarah.nToothPickCount : parseFloat(nToothpickCnt);
            this.nRadius         = isNaN(parseFloat(nRadius)) ? tarah.nRadius: parseFloat(nRadius);;
        },

        clearBoard: function(){
        },

        drawGrid: function() {
            var p1=null, p2=null;
            //Draw vertical lines
            for( var i=1,x1=0,y1=0,x2=0,y2=0; i<this.nBoardXCnt; i++ ){
                x1 = this.nX+(i*this.nBlockWidth);
                y1 = this.nY;
                x2 = x1;
                y2 = this.nY+this.nHeight;
                
                this.aGridLines.push(new tarah.Line( new tarah.Point(x1,y1), new tarah.Point(x2,y2) ) );
            }
            //Draw horizontal lines
            for( var i=1,x1=0,y1=0,x2=0,y2=0; i<this.nBoardYCnt; i++ ){
                x1 = this.nX;
                y1 = this.nY+(i*this.nBlockHeight);
                x2 = this.nX+this.nWidth;
                y2 = y1;

                this.aGridLines.push(new tarah.Line( new tarah.Point(x1,y1), new tarah.Point(x2,y2) ) );
            }
        },

        dropToothpicks: function(){
            var pI = new Array();
            this.aToothPicks = new Array(); 

            for( var i=0; i<this.nToothPickCount; i++ ){
                pI.push( new tarah.Point( Math.rndRange(this.nX, this.nX+this.nWidth), Math.rndRange(this.nY, this.nY+this.nHeight) ) );
            }
            for( var i=0,l=pI.length,x2=0,y2=0,a=0; i<l; i++ ){
                a = Math.rndRange(0.01,2*Math.PI);
                x2 = (pI[i].x + Math.cos(a) * this.nRadius);
                y2 = (pI[i].y + Math.sin(a) * this.nRadius);
                this.aToothPicks.push( new tarah.Line( new tarah.Point(pI[i].x,pI[i].y), new tarah.Point(x2,y2)));
            }
        },
        
        play: function(){
            this.clearBoard();
            this.drawGrid();
            this.dropToothpicks();
        },

        //--- Helpers ---
        //-----------------------------------
        // converts a pixel x coordinate to
        // a grid coordinate
        // @return a grid coordinate. 0 to this.BoardXCnt
        //-----------------------------------
        xtoGridCellX: function( nX ){
            nX = parseFloat(nX);
            return Math.floor((nX - this.nX)/this.nBlockWidth);
        },

        //-----------------------------------
        // converts a pixel y coordinate to
        // a grid coordinate
        // @return a grid coordinate. 0 to this.BoardYCnt
        //-----------------------------------
        ytoGridCellY: function( nY ){
            nY = parseFloat(nY);
            return Math.floor((nY - this.nY)/this.nBlockHeight);
        },

        xytoGridCellXY: function( nX, nY, offset ){
            nX = parseFloat(nX);
            nY = parseFloat(nY);
            offset = parseFloat(offset) || 0.0;
            return new tarah.Point(Math.floor((nX - (this.nX+offset))/(this.nBlockWidth-offset)),
                                   Math.floor((nY - (this.nY+offset))/(this.nBlockHeight-offset)));
        },

        //-----------------------------------
        // converts a pixel x,y coordinate to
        // an array index 
        // @return a array index. 0 to this.BoardXCnt + this.BoardYCnt
        //-----------------------------------
        xyToIndex: function( nX, nY ){
            var cellX = 0, cellY = 0, index=0;
            cellX = this.xtoGridCellX(nX);
            cellY = this.ytoGridCellY(nY);
            index = cellX + (cellY*(this.nBoardXCnt));
            return index;
        },
        
        toString:function(){
            var out = '';
            for( var o in this ){
                if( this.hasOwnProperty(o) ){
                    out += o + ' ' + this[o];
                }
            }
            return out;
        }
    });

    //------------------------------------------------
    // Class for SimpleToothpickBoard 
    //------------------------------------------------
    tarah.SimpleToothpickBoardGame = Class.create(tarah.AToothpickBoard, {
        initialize: function( $super, nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt, nToothpickCnt, nRadius ) {
            $super( nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt, nToothpickCnt, nRadius );
        },

        isTookPickOnGridLine: function( oToothPick ){
            function isOnBorder( cellpnt, pnt ){
                if( pnt instanceof tarah.Point && cellpnt instanceof tarah.Point ){
                    var rect = new tarah.Rect();

                    rect.x = cellpnt.x*this.nBlockWidth + this.nX;
                    rect.y = cellpnt.y*this.nBlockHeight + this.nY;
                    rect.w = rect.x+this.nBlockWidth;
                    rect.h = rect.y+this.nBlockHeight;
                    //Shrink the rectangle to get rid of the boarder
                    rect.x += 1;
                    rect.y += 1;
                    rect.w -= 1;
                    rect.h -= 1;
                    if( pnt.x >= rect.x && pnt.y >= rect.y && pnt.x <= rect.w && pnt.y <= rect.h )
                        return false;
                    return true;
                }
            }
            function isAcrossBorder( cellpnt1, cellpnt2 ){
                if( cellpnt1.x == cellpnt2.x && cellpnt1.y == cellpnt2.y ){
                    return false; 
                }
                return true;
            }

            if( oToothPick instanceof tarah.Line ){
                var rtn = false,
                    cp1 = null,
                    cp2 = null;
                cp1 = this.xytoGridCellXY( oToothPick.p1.x, oToothPick.p1.y );
                cp2 = this.xytoGridCellXY( oToothPick.p2.x, oToothPick.p2.y );
                rtn =        isOnBorder.call(this,cp1, oToothPick.p1);
                rtn = rtn || isOnBorder.call(this,cp2, oToothPick.p2);
                rtn = rtn || isAcrossBorder.call(this, cp1, cp2 );
                return rtn;
            }
            return false;
        },
        
        testGridCross: function(){
            for( var i=0,t=false; i<this.aToothPicks.length; i++ ){
                t = this.isTookPickOnGridLine(this.aToothPicks[i]);
                this.aToothPicks[i].bCrossesGridLine = t;
                if( t ){
                    this.nToothPickXLn++;
                }
            }
        },

        play: function(){
            this.clearBoard();
            this.drawGrid();
            this.dropToothpicks();
            this.nToothPickXLn = 0;
            this.testGridCross();
        }
    });


})( jQuery, tarah );
/*
        private static function getCellCol( x:Number ):Number
        { return Math.floor( (NUM_COLS/GRID_WIDTH) * (x-GRID_X) ); }
        private static function getCellRow( y:Number ):Number // NUM_ROWS/GRID_HEIGHT * MouseY
        { return Math.floor( (NUM_ROWS/GRID_HEIGHT) * (y-GRID_Y) ); }

        private static function colToX( col:Number ):Number
        { return ( BLOCK_WIDTH * col)+GRID_X; }
        private static function rowToY( row:Number ):Number
        { return ( BLOCK_HEIGHT * row ) + GRID_Y; }

        private static function xyToPos( x:Number, y:Number ):Number
        { return y*NUM_COLS + x; }

        private static function posToY( pos:Number ):Number
        { return Math.floor(pos/NUM_ROWS); }
        private static function posToX( pos:Number ):Number
        { return( pos - posToY(pos)*NUM_COLS ); }
*/
