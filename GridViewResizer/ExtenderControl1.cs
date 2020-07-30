using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace GridViewResizer
{
    /// <summary>
    /// Summary description for GridViewResizer
    ///             
    /// This source code was adapted from Matt Berseth code:
    ///  http://mattberseth.com/blog/2007/08/creating_a_gridview_with_resiz.html
    ///            most code taken from LavaBlast version  EtienneT  November 8, 2007 00:54 
    ///        http://blog.lavablast.com/post/2007/11/08/ASPNET-GridView-column-resizing.aspx
    ///
    ///        Modified by Rob Gray Feb 2015 to use .NET4 
    ///       Inserted into VS2013 ControlExtender template to work side by side with AjaxControlToolkit 4.7
    /// </summary>
    [
        TargetControlType(typeof(GridView))
    ]
    public class GridViewResizer : ExtenderControl
    {
        public GridViewResizer()
        {
            //
            // TODO: Add constructor logic here
            //

        }
        public bool Enabled { get; set; }

        protected override IEnumerable<ScriptDescriptor>
                GetScriptDescriptors(System.Web.UI.Control targetControl)
        {
            ScriptBehaviorDescriptor descriptor = new ScriptBehaviorDescriptor("GridViewResizer.Resize", targetControl.ClientID);
            yield return descriptor;
        }

        // Generate the script reference
        protected override IEnumerable<ScriptReference>
                GetScriptReferences()
        {
            yield return new ScriptReference("GridViewResizer.Resize.js", this.GetType().Assembly.FullName);
        }
    }
}