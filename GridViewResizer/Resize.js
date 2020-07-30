
/*
This source code was adapted from Matt Berseth code:
http://mattberseth.com/blog/2007/08/creating_a_gridview_with_resiz.html

most code taken from LavaBlast version  EtienneT  November 8, 2007 00:54           https://github.com/EtienneT
http://blog.lavablast.com/post/2007/11/08/ASPNET-GridView-column-resizing.aspx

Modified by Rob Gray Feb 2015 to use .NET4 
Inserted into VS2013 ControlExtender template to work side by side with AjaxControlToolkit 4.7
*/

Type.registerNamespace("GridViewResizer");

GridViewResizer.Resize = function(element) {
    GridViewResizer.Resize.initializeBase(this, [element]);

    //  Properties
    //  true when a header is currently being resized
    this._isResizing;
    //  a reference to the header column that is being resized
    this._element;
    //  an array of all of the tables header cells
    this._ths;
}

GridViewResizer.Resize.prototype = {
    initialize: function() {
        GridViewResizer.Resize.callBaseMethod(this, 'initialize');
        
        // Add custom initialization here

        //  get all of the th elements from the gridview
        this._ths = this.get_element().getElementsByTagName('TH');

        var args = { behavior: this };

        //  if the grid has at least one th element
        if (this._ths.length > 1) {

            for (i = 0; i < this._ths.length; i++) {
                //  determine the widths
                this._ths[i].style.width = Sys.UI.DomElement.getBounds(this._ths[i]).width + 'px';

                //  attach the mousemove and mousedown events
                if (i < this._ths.length - 1) {
                    $addHandler(this._ths[i], 'mousemove', Function.createCallback(this._onMouseMove, args));
                    $addHandler(this._ths[i], 'mousedown', Function.createCallback(this._onMouseDown, args));
                }
            }

            //  add a global mouseup handler

            $addHandler(document, 'mouseup', Function.createCallback(this._onMouseUp, args));
            //  add a global selectstart handler
            $addHandler(document, 'selectstart', Function.createCallback(this._onSelectStart, args));
        }
        //end custom
    },


    _onMouseMove : function(args, e){    
        if(e.behavior._isResizing){
            //  determine the new width of the header
            var bounds = Sys.UI.DomElement.getBounds(e.behavior._element); 
            var width = args.clientX - bounds.x;
            
            //  we set the minimum width to 1 px, so make
            //  sure it is at least this before bothering to
            //  calculate the new width
            if(width > 1)
            {
                //  get the next th element so we can adjust its size as well
                var nextColumn = e.behavior._element.nextSibling;
                var nextColumnWidth;
                if(width < e.behavior._toNumber(e.behavior._element.style.width)){
                    //  make the next column bigger
                    nextColumnWidth = e.behavior._toNumber(nextColumn.style.width) + e.behavior._toNumber(e.behavior._element.style.width) - width;
                }
                else if(width > e.behavior._toNumber(e.behavior._element.style.width)){
                    //  make the next column smaller
                    nextColumnWidth = e.behavior._toNumber(nextColumn.style.width) - (width - e.behavior._toNumber(e.behavior._element.style.width));
                }   
                
                //  we also don't want to shrink this width to less than one pixel,
                //  so make sure of this before resizing ...
                if(nextColumnWidth > 1){
                    e.behavior._element.style.width = width + 'px';
                    nextColumn.style.width = nextColumnWidth + 'px';
                }
            }
        }   
        else
        {
            //  get the bounds of the element.  If the mouse cursor is within
            //  4px of the border, display the e-cursor -> cursor:e-resize
            var bounds = Sys.UI.DomElement.getBounds(args.target);
            if(Math.abs((bounds.x + bounds.width) - (args.clientX)) <= 4) {
                args.target.style.cursor = 'e-resize';
            }  
            else{
                args.target.style.cursor = '';
            }          
        }         
    },

    _onMouseDown : function(args, e){
        //  if the user clicks the mouse button while
        //  the cursor is in the resize position, it means
        //  they want to start resizing.  Set this._isResizing to true
        //  and grab the th element that is being resized
        if(args.target.style.cursor == 'e-resize') {
            e.behavior._isResizing = true;
            e.behavior._element = args.target;
        }                    
    },
            
    _onMouseUp : function(args, e){
        //  the user let go of the mouse - so
        //  they are done resizing the header.  Reset
        //  everything back
        if(e.behavior._isResizing){
            
            //  set back to default values
            e.behavior._isResizing = false;
            e.behavior._element = null;
            
            //  make sure the cursor is set back to default
            for(i = 0; i < e.behavior._ths.length; i++){   
                e.behavior._ths[i].style.cursor = '';
            }
        }
    },
    
    _onSelectStart : function(args, e){
        // Don't allow selection during drag
        if(e.behavior._isResizing){
            args.preventDefault();
            return false;
        }
    },
    
    _toNumber : function(m) {
        //  helper function to peel the px off of the widths
        return new Number(m.replace('px', ''));
    },


    dispose: function() {        
        //Add custom dispose actions here
        GridViewResizer.Resize.callBaseMethod(this, 'dispose');
    }
}
GridViewResizer.Resize.registerClass('GridViewResizer.Resize', Sys.UI.Behavior);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();