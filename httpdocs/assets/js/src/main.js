window.propFuncs = {

	isVisible__ready: function() {
        
        this.init = function(element, tolerance) {
          
            if(!element || 1 !== element.nodeType) {
                
                return false;
                
            }

            tolerance = tolerance || 0;

            var html = document.documentElement,
                r = element.getBoundingClientRect(),
                h = html.clientHeight,
                w = html.clientWidth;

            if(!!r && (r.bottom - tolerance) >= 0 && r.right >= 0 && (r.top - tolerance) <= h && r.left <= w) {
                
                return true;
                
            }
            
        };

    }

};