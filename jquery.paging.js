/* =========================================================
 * jquery ajax paging plugin * 
 * =========================================================
 * Ivanenko Danil 
 * ========================================================= 
 * Usage: $("#someDivId").ajaxPaging({settings...}); look example for details
 *
 * Settings:
 * items - total items count
 * itemsPerPage - items per page ))
 * url - used to retrieve data
 * callbackParams - additional url params
 * fillFirstPage - 
 * initialPage - first page to show, default 0
 * callback - run this function after we get data from server
 * coockieName
 *
 */

(function($) {
	
	 var methods = {
			 
			 init: function(options) {
				 
				// Establish our default settings
			        var settings = $.extend({            
			            items		 : 100,
			            itemsPerPage : 10,
			        	url          : null,
			        	callbackParams: null,
			        	fillFirstPage: true,
			        	initialPage  : 0,
			            callback     : null,
			            coockieName  : null
			        }, options);
			        
			        this.data("settings", settings);
			        
			        if(settings.items <= settings.itemsPerPage)
			        	this.hide();
			        
			        this.addClass("text-center pagination");
			        var ul = $("<ul></ul>");
			        this.append(ul);
			        
			        this.attr("page", "1");
			        ul.append('<li class="disabled"><a id="prev" href="#" class="previous-page">&laquo;</a></li>');        
			        for(var i=0; i<settings.items/settings.itemsPerPage; i++){
			        	ul.append("<li class='"+(i==settings.initialPage?"active":"")+"'><a href='#' class='page' id='page"+(i+1)+"'>"+(i+1)+"</a></li>");
			        }        
			        ul.append("<li><a href='#' id='next' class='next-page'>&raquo;</a></li>");       
			        
			        var navBar = this;
			        
			        this.on("click", ".next-page", function(){
			    		var page = parseInt(navBar.attr("page")) + 1;
			    		navBar.attr("page", page);    		
			    		ul.find("li.active").removeClass("active").next().addClass("active");    		
			    		
			    		if(page>1)
			    			ul.find("li:first").removeClass("disabled");
			    		if(page>=settings.items/settings.itemsPerPage)
			    			ul.find("li:last").addClass("disabled");
			    		
			    		var settings = navBar.data("settings");
			    		var params = $.extend({page: (page-1)}, settings.callbackParams);			    		
			    		
			    		$.getJSON(settings.url, params, function(data){
			    			if ( $.isFunction( settings.callback ) ) {
			    		        settings.callback.call( this, data );
			    		    }
			    		});
			    		
			    		return false;
			    	});
			        
			        this.on("click", ".previous-page", function(){
			    		var page = parseInt(navBar.attr("page")) - 1;
			    		navBar.attr("page", page); 
			    		ul.find("li.active").removeClass("active").prev().addClass("active");
			    		
			    		if(page==1)
			    			ul.find("li:first").addClass("disabled");
			    		if(page<settings.items/settings.itemsPerPage)
			    			ul.find("li:last").removeClass("disabled");
			    					    		
			    		var settings = navBar.data("settings");
			    		params = $.extend(params, navBar.data("callbackParams"));			    		
			    		
			    		$.getJSON(settings.url, params, function(data){
			    			if ( $.isFunction( settings.callback ) ) {
			    		        settings.callback.call( this, data );
			    		    }
			    		});
			    		
			    		return false;
			    	});	
			        
			        this.on("click", ".page", function(){
			        	var page = parseInt($(this).html());
			        	navBar.attr("page", page);
			        	var settings = navBar.data("settings");
			        	if(settings.coockieName)
			        		document.cookie = settings.coockieName+'='+page+'; path=/';
			        	ul.find("li.active").removeClass("active");
			        	$(this).parent().addClass("active");
			    		
			    		if(page>1)
			    			ul.find("li:first").removeClass("disabled");
			    		else	
			    			ul.find("li:first").addClass("disabled"); 
			    		
			    		if(page<settings.items/settings.itemsPerPage)
			    			ul.find("li:last").removeClass("disabled");
			    		else
			    			ul.find("li:last").addClass("disabled");
			    					    		
			    		var params = $.extend({page: (page-1)}, settings.callbackParams);			    		
			    		
			    		$.getJSON(settings.url, params, function(data){
			    			if ( $.isFunction( settings.callback ) ) {
			    		        settings.callback.call( this, data );
			    		    }
			    		});
			        	
			        	return false;
			        });
			        
			        if(settings.fillFirstPage == true){
			        	var params = $.extend({page: settings.initialPage}, settings.callbackParams);
			        	params = $.extend(params, navBar.data("callbackParams"));
			        	$.getJSON(settings.url, params, function(data){		
			        		if ( $.isFunction( settings.callback ) ) {        			
			    		        settings.callback.call( this, data );
			    		    }
			        	});
			        }   	
			 },
			 
			 reload: function(urlParams) {
				 this.attr("page", "1");
				 var ul = this.find("ul");
				 ul.find("li.active").removeClass("active");		         
				 ul.find("li:first").addClass("disabled").next().addClass("active");	
				 var settings = this.data("settings");				 
				 
				 if(settings){
					 settings.callbackParams = $.extend(settings.callbackParams, urlParams);
					 this.data("settings", settings);
					 var params = $.extend({page: 0}, settings.callbackParams);
			        	params = $.extend(params, urlParams);
			        	$.getJSON(settings.url, params, function(data){		
			        		if ( $.isFunction( settings.callback ) ) {        			
			    		        settings.callback.call( this, data );
			    		    }
			        	});
				 }				 
			 }
	 };

    $.fn.ajaxPaging = function( method ) {

    	if ( methods[method] ) {
    	    return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Метод с именем ' +  method + ' не существует для jQuery.ajaxPaging' );
	    }

    } //fn.ajaxPaging

}(jQuery));