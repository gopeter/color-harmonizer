var start_items = 6;
var start_values = new Array('0077FF','FF0000','57EECE','F60CF6','2651AD','873838');
var gray;
var global_range = 5;

function addColorItem() {
	var tmp = $('.partial').html();
	$('.app').append(tmp);
}

function getRGBAverage(rgb) {
	// return (0.212 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 3; 	// HDTV	
	// return (0.59 * rgb.r + 0.3 * rgb.g + 0.11 * rgb.b) / 3; 			// Photoshop
	return (0.7 * rgb.r + 0.3 * rgb.g + 0.2 * rgb.b) / 3; 				// Peters Magic
}

function changeColor(color,$obj,range) {

	if (range > 255) {
		alert('Please choose another color');
		return false;
	}

	// set vars
	var range = range;
	var c = 0;	
	var final_color;
	
	console.log('Range for color ' + color.r + ', ' + color.g + ', ' + color.r + ' ' + 'is ' + range);	

	// get ranges
	var r_start = color.r - range;
	if (r_start < 0) r_start = 0;
	
	var r_end = color.r + range;
	if (r_end > 255) r_end = 255;	

	var g_start = color.g - range;
	if (g_start < 0) g_start = 0;	

	var g_end = color.g + range;
	if (g_end > 255) g_end = 255;		

	var b_start = color.b - range;
	if (b_start < 0) b_start = 0;	
		
	var b_end = color.b + range;
	if (b_end > 255) b_end = 255;		

	// get rgb
	var this_gray = Math.round(getRGBAverage(color));

	if (this_gray != gray) {
	
		lets_fetz:
		for (var r = r_start; r <= r_end; r++) {
			for (var g = g_start; g <= g_end; g++) {
				for (var b = b_start; b <= b_end; b++) {			
					var tmp = {r:r, g:g, b:b};
					var avg = Math.round(getRGBAverage(tmp));
					if (avg == gray) {
						var t = tinycolor(tmp);
						$obj.find('.color-preview-new').data('changed','yes').css({'background-color':'rgb('+tmp.r+','+tmp.g+','+tmp.b+')'});
						var hex = t.toHex();
						final_color = hex;
						$obj.find('.hex-new').val(hex);
						break lets_fetz;
					}
					c++;
				}
			}
		}
		
	}
	
	if ($obj.find('.color-preview-new').data('changed') == 'no') {
		range += 5;
		changeColor(color,$obj,range);
	} else {
		console.log('Final color: ' + final_color);
		console.log('##################################################');		
	}


}

function initColorPicker() {
	$('.colorpicker').minicolors({
		change: function(hex, opacity) {
			$(this).closest('.color-item').find('.color-preview-old').css({'background-color':hex});			
		}
	});		
}

$(function(){

	for (i=0;i<start_items;i++) {
		addColorItem();
		
		// set all background-colors and inputs to the default values
		$('.color-item').last().find('.color-preview').css({'background-color':'#' + start_values[i]});
		$('.color-item').last().find('input').val(start_values[i]);		
	}

	$('.app').find('.added').removeClass('added');
	$('.app').find('.delete-field').addClass('hidden');

	$('.add-field').click(function(){
		addColorItem();	
		initColorPicker();		
		return false;		
	});
	
	$(document).on('click', '.delete-field', function() {
		$(this).closest('.color-item').remove();
		return false;
	});	
	
	initColorPicker();
	
	$('.harmonize').click(function() {
	
		$('.color-preview-new').data('changed','no');
	
		var grays = new Array();
		var sum = 0;
		var i = 0;
	
		// find the perfect gray
		$('.app').find('.color-item').each(function() {
				
			var $obj = $(this);
			var obj_color = $obj.find('.color-preview-old').css('background-color');
			
			// create tinycolor object
			var t = tinycolor(obj_color);
			
			// convert to RGB
			var rgb = t.toRgb();

			// add
			sum += getRGBAverage(rgb);
			
			i++;
			

		});
		
		// colors should match this gray
		gray = Math.round(sum / i);
		console.log('Colors grayscale should match this gray: ' + gray);
		console.log('##################################################');				
		
		// get average colors 
		$('.app').find('.color-item').each(function(){
			var $obj = $(this);
			var obj_color = $obj.find('.color-preview-old').css('background-color');

			// create tinycolor object
			var t = tinycolor(obj_color);
			
			// convert to HSL
			var rgb = t.toRgb();

			changeColor(rgb,$obj,global_range);

		});
		
		return false;		
		
	});
		
	
});