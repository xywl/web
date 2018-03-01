$(function() {
    $(window).resize(function(){
        var $windowheight=$(window).outerHeight();
        var $windowwidth=$(window).outerWidth();
        var $navwidth=$('#nav-panel').outerWidth();
    }).trigger('resize');
});
function bigpic(src,obj,data){
	var $oindex=$(obj).data('index');
	
	var $bigpic=$('<div id="warppic"><div class="mode"></div><div class="bigpictitle"></div><div class="bigpic-area"><img src="'+src+'" deg="0" id="bigimg" data-src="'+src+'" data-deg="0" data-index="'+$oindex+'" /></div><div class="iconarea"><div class="lefticon" id="lefticon"></div><div class="righticon" id="righticon"></div></div><div class="previcon"></div><div class="nexticon"></div></div>');
	$('body').append($bigpic);
	if(obj!=undefined){
		var $title=data[$oindex].title;
		$('.bigpictitle').text($title);
	}
	
	$(window).unbind('resize').resize(function(){		
		var $src=$('#bigimg').data('src');		
 		$('<img />').attr('src',$src).one('load', function() {
			var $picwidth=this.width;
			var $picheight=this.height;
			var $maxheight=$(window).height()-100;
			var $maxwidth=$(window).width()-100;
			var newwidth=$picwidth;
			var newheight=$picheight;
			$('.iconarea').css('left',($maxwidth-400)/2);
			if($picheight>=$maxheight)newheight=$maxheight;
			if($picwidth>=$maxwidth)newwidth=$maxwidth;
			$('.bigpic-area').width(newwidth).height(newheight).css({'left':($maxwidth-newwidth+100)/2,'top':($maxheight-newheight+30)/2+10});	
			$('#bigimg').attr('src',$src);
			}).each(function() {
			  if(this.complete) $(this).load();
		});	 		

	}).trigger('resize');
	
	if(obj==undefined || (data.length==1)){
		$('.bigpictitle,.previcon,.nexticon').remove();
	}
	if(data!=undefined){
		$('.nexticon').unbind('click').click(function(){
			var length=data.length;
			var $index=$('#bigimg').data('index');
			var $current=$index+1;
			if($index==length-1)$current=0;
			$('#bigimg').data('src',data[$current].url).data('index',$current);	
			$('.bigpictitle').text(data[$current].title);
			$(window).trigger('resize');
		});
		
		$('.previcon').unbind('click').click(function(){
			var length=data.length;
			var $index=$('#bigimg').data('index');
			var $current=$index-1;
			if($index==0)$current=length-1;
			$('#bigimg').data('src',data[$current].url).data('index',$current);	
			$('.bigpictitle').text(data[$current].title);
			$(window).trigger('resize');
		});
	}	
	$('.mode,.bigpic-area').unbind('click').click(function(){
		$('#warppic').remove();
	});
	
	if( 'MozTransform' in document.documentElement.style || 'WebkitTransform' in document.documentElement.style || 'OTransform' in document.documentElement.style || 'msTransform' in document.documentElement.style|| 'transform' in document.documentElement.style){
		$('#righticon').unbind('click').click(function(){
			var $deg=parseInt($('#bigimg').data('deg'))+45;			
			$('#bigimg').css('transform','rotate('+$deg+'deg)').data('deg',$deg);			
		});
		
		$('#lefticon').unbind('click').click(function(){
			var $deg=parseInt($('#bigimg').data('deg'))-45;			
			$('#bigimg').css('transform','rotate('+$deg+'deg)').data('deg',$deg);			
			
		});		
	}
	else{
		$('.iconarea').hide();
	}	
	
	
}