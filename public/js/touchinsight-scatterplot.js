function ScatterPlot (options) {
    
     var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 30
    };

    
    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.height = options.height - _self.margin.top - _self.margin.bottom;
    
    
     var query = new Query({
        index1: budget,
        operator1: "all",
        logic: "CLEAN",
        index2: gross,
        operator2: "all",         
    });
    
    
    
}