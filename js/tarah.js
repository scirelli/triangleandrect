"use strict";

if( tarah === undefined ) var tarah = new Object();

;(function( $j, tarah ){
    //---- Getters ----
    if( Object.defineProperties ){//Standard way new browsers 
        //Getters and setters for the control panel of the grapher and the form
        Object.defineProperties(tarah, { 
            "oCanvas":{ //The ID to the chart container
                value:'myCanvas',//The value associated with the property. (data descriptors only). Defaults to undefined. 
                //get : function(){ return value; },  
                //set : function(newValue){ bValue = newValue; },  
                writable:false,//True if and only if the value associated with the property may be changed. (data descriptors only). Defaults to false. 
                enumerable:false,//True if and only if this property shows up during enumeration of the properties on the corresponding object. Defaults to false. 
                configurable:false//True if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. Defaults to false.
            },
            "ffSize"         :{ value:"ffSize" },
            "ffSet"          :{ value:"ffSet" },
            "BoardCntX"      :{ value:8 },
            "BoardCntY"      :{ value:8 },
            "BoardWidth"     :{ value:500 },
            "BoardHeight"    :{ value:500 },
            "BoardX"         :{ value:0 },
            "BoardY"         :{ value:0 },
            "nToothPickCount":{ value:1000 },
            "nRadius"        :{ value:10 },
            "sGridStrokeColor":{ value:"#0000FF" },
            "aGrids"          :{ value:new Array(), writable:true },
            "sToothPickCrossLineStroke": { value:"#FF0000"}, 
            "sToothPickLineStroke" : { value:"#00FF00" }

        });
    } else {//for IE
        //---- Getters ----
        tarah.oCanvas        = 'myCanvas';
        tarah.ffSize         = 'ffSize';
        tarah.ffSet          = 'ffSet';
        tarah.BoardCntX      = 8;
        tarah.BoardCntY      = 8;
        tarah.BoardWidth     = 500;
        tarah.BoardHeight    = 500;
        tarah.BoardX         = 0;
        tarah.BoardY         = 0;
        tarah.nRadius        = 10;
        tarah.sGridStrokeColor = "#0000FF";
        tarah.nToothPickCount = 1000;
        tarah.aGrids          = new Array();
        tarah.sToothPickCrossLineStroke = "#FF0000";
        tarah.sToothPickLineStroke = "#00FF00";
    }
    
    tarah.clearCanvas = function(){
        var c = document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        tarah.aGrids = new Array();
    }

    tarah.setCanvasSize = function( width, height ){
        var c = document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        width  = width  || $j('#' + tarah.formVars.ffCanvasWidth).val();
        height = height || $j('#' + tarah.formVars.ffCanvasHeight).val();
        width = parseInt(width);
        height = parseInt(height);

        tarah.log('Setting Canvas width = ' + width + ', height = ' + height ); 

        ctx.canvas.width = width;
        ctx.canvas.height = height;
    }

    tarah.onResize = function( ){
        tarah.setCanvasSize();
    }

    tarah.onSet = function( ){
        var c = document.getElementById("myCanvas");
        var ctx=c.getContext("2d"),
            gridWidth  = $j('#'+tarah.formVars.ffGridWidth).val(),
            gridHeight = $j('#'+tarah.formVars.ffGridHeight).val(),
            gridCols   = $j('#'+tarah.formVars.ffNumGridColumns).val(),
            gridRows   = $j('#'+tarah.formVars.ffNumGridRows).val(),
            gridX      = $j('#'+tarah.formVars.ffGridPosX).val(),
            gridY      = $j('#'+tarah.formVars.ffGridPosY).val();

        var game = new tarah.SimpleToothpickBoardDrawer(ctx, gridX, gridY, gridWidth, gridHeight, gridCols, gridRows);
        var board = new tarah.SimpleToothpickBoardGame( gridX, gridY,  gridWidth, gridHeight, gridCols, gridRows, $j('#' + tarah.formVars.ffNumLines).val(), $j('#' + tarah.formVars.ffRadius).val());
        board.play();
        game.clearCanvas();
        game.setBoard(board);
        tarah.aGrids.push(game);
        for( var i=0; i<tarah.aGrids.length; i++ ){
            tarah.aGrids[i].play();
            var xs  = tarah.aGrids[i].board.nToothPickXLn;
            var tTooths = tarah.aGrids[i].board.nToothPickCount;
            var nxs = tTooths - tarah.aGrids[i].board.nToothPickXLn;
            tarah.log( 'Number of toothpicks that cross a grid line: ' + xs + '\nNumber of toothpicks that don\'t cross: ' + nxs );
            tarah.log( 'Crosses/total: ' + (xs/tTooths));
        }
    }

    tarah.onSubmit = function( e ){
        e.preventDefault();
        return false;
    }

    tarah.log = function( str ){
        var elm = $j('#' + tarah.formVars.ffOutput);
        var v = elm.val() + str + '\n\n';
        elm.val( v );
    }

    tarah.mouseCoord = function(e){
        var posx = 0;
        var posy = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) 	{
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        // posx and posy contain the mouse position relative to the document
        return {x:posx, y:posy};
    }
})(jQuery, tarah);
