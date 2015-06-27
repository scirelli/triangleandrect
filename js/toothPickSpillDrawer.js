"use strict";

if( tarah === undefined ) var tarah = new Object(); //namespace

;(function( $j, tarah ){

    //------------------------------------------------
    // Interface IToothpickBoard 
    //------------------------------------------------
    tarah.IToothpickBoardDrawer = Class.create({
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
    tarah.AToothpickBoardDrawer = Class.create(tarah.IToothpickBoardDrawer,{
        //------------------------------------------------
        //
        //------------------------------------------------
        initialize: function( $super, oCanvasContext, nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt ) {
            $super();
            this.nX           = isNaN(parseInt(nX)) ? tarah.BoardX : parseInt(nX);
            this.nY           = isNaN(parseInt(nY)) ? tarah.BoardY : parseInt(nY);
            this.nWidth       = isNaN(parseInt(nWidth)) ? tarah.BoardWidth : parseInt(nWidth);
            this.nHeight      = isNaN(parseInt(nHeight)) ? tarah.BoardHeight : parseInt(nHeight);
            this.nBoardXCnt   = isNaN(parseInt(nBoardXCnt)) ? tarah.BoardCntX : parseInt(nBoardXCnt);
            this.nBoardYCnt   = isNaN(parseInt(nBoardYCnt)) ? tarah.BoardCntY : parseInt(nBoardYCnt);
            this.nBlockWidth  = this.nWidth/nBoardXCnt;
            this.nBlockHeight = this.nHeight/nBoardYCnt;
            this.sGridStroke  = tarah.sGridStrokeColor;
            this.sToothPickCrossLineStroke = tarah.sToothPickCrossLineStroke;
            this.sToothPickLineStroke = tarah.sToothPickLineStroke;

            if( oCanvasContext instanceof CanvasRenderingContext2D === false ) throw 'CanvasContext must be of type CanvasRenderingContext2D';
            this.ctx = oCanvasContext;
            this.board = null;
        },

        clearBoard: function(){
            this.ctx.clearRect(this.nX,this.nY,this.nWidth,this.nHeight);
        },

        clearCanvas: function(){
            this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        },

        drawGrid: function() {
            var tmpStroke = this.ctx.strokeStyle;
            this.ctx.strokeStyle = this.sGridStroke;

            for( var i=0,l=this.board.aGridLines.length; i<l; i++ ){
                this.ctx.beginPath();
                this.ctx.moveTo( this.board.aGridLines[i].p1.x, this.board.aGridLines[i].p1.y );
                this.ctx.lineTo( this.board.aGridLines[i].p2.x, this.board.aGridLines[i].p2.y );
                this.ctx.stroke();
            }
            this.ctx.strokeStyle = tmpStroke;
        },

        dropToothpicks: function(){
            var tmpStroke = this.ctx.strokeStyle,
                tmpLineWidth = this.ctx.lineWidth;
            this.ctx.lineWidth = 1;
            for( var i=0,l=this.board.aToothPicks.length; i<l; i++ ){
                if( this.board.aToothPicks[i].bCrossesGridLine ){
                    this.ctx.strokeStyle = this.sToothPickCrossLineStroke;
                }else{
                    this.ctx.strokeStyle = this.sToothPickLineStroke;
                }
                this.ctx.beginPath();
                this.ctx.moveTo( this.board.aToothPicks[i].p1.x, this.board.aToothPicks[i].p1.y );
                this.ctx.lineTo( this.board.aToothPicks[i].p2.x, this.board.aToothPicks[i].p2.y );
                this.ctx.stroke();
            }
            this.ctx.strokeStyle = tmpStroke;
            this.ctx.lineWidth = tmpLineWidth;
        },

        play: function(){
            this.clearBoard();
            this.drawGrid();
            this.dropToothpicks();
        },

        setBoard: function( board ){
            if( board instanceof tarah.IToothpickBoard === false ) throw '';
            this.board = board;
        }
    });

    //------------------------------------------------
    // Class for SimpleToothpickBoard 
    //------------------------------------------------
    tarah.SimpleToothpickBoardDrawer = Class.create(tarah.AToothpickBoardDrawer, {
        initialize: function( $super, oCanvasContext, nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt ) {
            $super( oCanvasContext, nX, nY, nWidth, nHeight, nBoardXCnt, nBoardYCnt );
        }
    });
})( jQuery, tarah );
/*
            //Draw vertical lines
            for( var i=1,x1=0,y1=0,x2=0,y2=0; i<this.nBoardXCnt; i++ ){
                x1 = this.nX+(i*this.nBlockWidth);
                y1 = this.nY;
                x2 = x1;
                y2 = this.nY+this.nHeight;
                this.ctx.beginPath();
                this.ctx.moveTo( x1,y1 );
                this.ctx.lineTo( x2, y2 );
                this.ctx.stroke();
            }
            //Draw horizontal lines
            for( var i=1,x1=0,y1=0,x2=0,y2=0; i<this.nBoardYCnt; i++ ){
                x1 = this.nX;
                y1 = this.nY+(i*this.nBlockHeight);
                x2 = this.nX+this.nWidth;
                y2 = y1;
                this.ctx.beginPath();
                this.ctx.moveTo( x1,y1 );
                this.ctx.lineTo( x2, y2 );
                this.ctx.stroke();
            }
            */
