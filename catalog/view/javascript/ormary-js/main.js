$(document).ready(function(){

	$('.sort_by').click(function(){
		$(this).next('.clothing_aside').slideToggle();
		iScrollInit();
	});

	$(window).resize(function(){

		if ($(window).width()>991) {
			$('.clothing_aside').show();
		}
		
	});
	

	if ($(window).width()>768) {
		$('.dropdown-toggle').dropdownHover();
	}

	$(window).resize(function() {
		if ($(window).width()>768) {
			$('.dropdown-toggle').dropdownHover();
		}
	});

	/* A FOCUS ON blocks hover */
/*
	$('.orm_focus_on .col-md-4').hover(function(){
		$(this).animate({opacity: "0.7"}, 150);
	},function(){
		$(this).animate({opacity: "1"}, 100);
	});
*/

	/* CLOTHING FILTER TABS */

	$('.filter-clothing-mens').hide();

	$('.womens_tab').click(function(event){
		event.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.filter-clothing-womens').show();
		$('.filter-clothing-mens').hide();
	});
	$('.mens_tab').click(function(event){
		event.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.filter-clothing-mens').show();
		$('.filter-clothing-womens').hide();
	});



	/* Mobile zoom */

	$('#open_zoom').click(function(){
		$(this).hide();
		$('#close_zoom').show();
	});

	$('#close_zoom').click(function(event){
		event.preventDefault();
		$(this).hide();
		$('#open_zoom').show();
	});


	/* MY ORMARY TABS */

	$('.following_designers_to').click(function(event){
		event.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.following_designers').show();
		$('.following_designers').siblings().hide();
	});

	$('.recommended_designers_to').click(function(event){
		event.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.recommended_designers').show();
		$('.recommended_designers').siblings().hide();
	});

	$('.my_orders_to').click(function(event){
		event.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.my_orders').show();
		$('.my_orders').siblings().hide();
	});

	/* ALL DESIGNERS FILTER SUB*/

	$('#orm_des_filter .filter-label').click(function(){
		$(this).toggleClass('activelabel');
		$(this).next('.sub_filter-clothing').toggle();
		$(this).siblings().next('.sub_filter-clothing').hide();

		if($(this).attr('id') == 'c0')
		{
			$('#orm_des_filter label').removeClass('activelabel');
		}
		else
		{
			$('#orm_des_filter label#c0').removeClass('activelabel');
			if(!$(this).hasClass('activelabel'))
			{
				$(this).next('.sub_filter-clothing').find('label').removeClass("activelabel");
			}
		}
		
		var filter = [];
		$("label.activelabel").each(function() {
			filter.push(this.id.substr(1));
		});
		filter.join(',');
		
		if(filter !='')
		{
			filter = '&category=' + filter;	
		}
		
		window.location.href = "/index.php?route=product/manufacturer" + filter;
	});


	$( '#designer_search input' ).on('input', function() {
		name = $(this).val();

		var filter = [];
		$("label.activelabel").each(function() {
			filter.push(this.id.substr(1));
		});
		filter.join(',');
		
/*		if(filter !='')
		{
			filter = '&category=' + filter;	
		}*/
		
		if(name != '')
		{
			$.get("index.php?route=product/manufacturer/getDesignersByName", {designer_name : name, category : filter}, function(data){ 
				$( "#designers-byname-list-wrap" ).html('<div class="row"><div class="col-md-4 col-sm-4 col-xs-6"><ul>'+data+'</ul></div>'); 
			});
			$( "#designers-list-wrap").hide();
		}
		else
		{
			$( "#designers-byname-list-wrap" ).html(''); 	
			$( "#designers-list-wrap").show();	
		}
	});


	/* Product add to cart popup */

	$('.open_add_to_cart_popup').click(function(event){
		event.preventDefault();

		if($("#orm_product select").val() == "")
		{
			$("#orm_product select").addClass("not_filled");	
			$(".available_sizes div.alert_error").show();
		}
		else
		{
			$("#orm_product select").removeClass("not_filled");
			$(".available_sizes div.alert_error").hide();
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: $('#orm_product input[type=\'text\'], #orm_product input[type=\'hidden\'], #orm_product input[type=\'radio\']:checked, #orm_product input[type=\'checkbox\']:checked, #orm_product select, #orm_product textarea'),
			dataType: 'json',
			success: function(json) {
				$('.success, .warning, .attention, information, .error').remove();
				
				if (json['error']) {
				if (json['error']['option']) {
						for (i in json['error']['option']) {
							$('#option-' + i).after('<span class="error">' + json['error']['option'][i] + '</span>');
							alert('<span class="error">' + json['error']['option'][i] + '</span>');
						}
					}
					
					if (json['error']['profile']) {
						$('select[name="profile_id"]').after('<span class="error">' + json['error']['profile'] + '</span>');
					}
				} 
				
				if (json['success']) {
					
					$('#cart').load('index.php?route=module/cart #cart > *', function(){ $('.open_cart_dropdown #cart_header_price').html($('#cart span.total #cart_price').html());});
					
					$('#cart_items_in_cart').html(json['total']['items_count']);
					$('#cart_subtotal').html(json['total']['subtotal_price']);

					/*$('#notification').html('<div class="success" style="display: none;">' + json['success'] + '<img src="catalog/view/theme/default/image/close.png" alt="" class="close" /></div>');
					$('.success').fadeIn('slow');
					$('#cart-total').html(json['total']);
					$('html, body').animate({ scrollTop: 0 }, 'slow'); */
					
				}	
			}
		});
		

		var qty = 1; //parseInt($("#orm_product select#qty option:selected").text());
		
		if(qty == 1)
		{
			$('#cart_popup_header').html("1 item");
		}
		else
		{
			$('#cart_popup_header').html(qty + " items");	
		}
		
		//$('#cart_product_color').html($("#orm_product .filter-colors span.selected").attr('title'));
		$('#cart_product_color').html($("#orm_product #color").attr('title'));
		$('#cart_product_size').html($("#orm_product select#size option:selected").text());
		
		//$('#cart_product_qty').html($("#orm_product select#qty option:selected").text());
		$('#cart_product_qty').html(qty);
		var total_price = parseFloat($("#product_price").text())*qty;
		

		
		$('#cart_product_price_total').html('&pound;' + total_price.toFixed(2));

		
		$('.popup, .add_to_cart_popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.add_to_cart_popup').height()/2;
		var popupPosition = $(window).height()/2;
		$('.add_to_cart_popup').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.add_to_cart_popup').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
		}
	});
	$('.add_to_cart_popup').click(function(event){
		event.stopPropagation();
	});
	$('.popup, .close_popup').click(function(event){
		event.preventDefault();
		$('.add_to_cart_popup, .popup').hide();
	});


	/* Product share with a friend popup */

	$('.open_share_with_friend').click(function(event){
		event.preventDefault();
		$('.popup, .share_with_friend_popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.share_with_friend_popup').height()/2;
		var popupPosition = $(window).height()/2;
		$('.share_with_friend_popup').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.share_with_friend_popup').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	$('.share_with_friend_popup').click(function(event){
		event.stopPropagation();
	});
	$('.popup, .close_popup').click(function(){
		$('.share_with_friend_popup, .popup').hide();
	});


	/* Wardrobe create collection popup */

	$('.open_create_collection').click(function(event){
		event.preventDefault();
		$('.popup, .create_collection').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.create_collection').height()/2;
		var popupPosition = $(window).height()/2;
		$('.create_collection').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.create_collection').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	$('.create_collection').click(function(event){
		event.stopPropagation();
	});
	$('.popup, .close_popup, #create_collection_reject').click(function(){
		$('.create_collection, .popup').hide();
	});
	
	$("#create_collection #collection_name").bind("keypress", function (e) {
		if (e.keyCode == 13) {
			return false;
		}
	});
	$(".add_to_wardrobe_ff").click(function(){
		href = $(this).parent().find('a.link_to_product').attr("href");
		img = $(this).parent().find('a.link_to_product img').attr("src");
		name = $(this).parent().find('div.designer_name').html();
		designer = $(this).parent().find('div.prod_name').html();
		price = $(this).parent().find('div.price').html();

		$(".my_wardrobe ul").prepend('<li><a class="wardrobe_product" href=' + href + '"><img alt="Manon Cape" src="' + img + '"><div class="hover-info"><div class="designer_name">'+ designer +'</div><div class="prod_name">'+ name +'</div><div class="price">'+ price +'</div></div></a></li>');

	});
	/* Wardrobe remove collection popup */

	$('.open_remove_collection').click(function(event){
		event.preventDefault();
		$('.popup, .remove_collection').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.remove_collection').height()/2;
		var popupPosition = $(window).height()/2;
		$('.remove_collection').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.remove_collection').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	$('.remove_collection').click(function(event){
		event.stopPropagation();
	});
	$('.popup, .close_popup, #remove_collection_reject').click(function(){
		$('.remove_collection, .popup').hide();
	});

	/* My Wardrobe view recommended popup */

	$('.view_recommended').click(function(event){
		event.preventDefault();

		$('.related_popup .product img').attr('src', $(this).parent().find('img').attr('src')) 
		$('.related_popup .product img').attr('alt', $(this).parent().find('img').attr('alt')) 
		$('.related_popup .product .designer_name').html($(this).parent().find('.designer_name').html());
		$('.related_popup .product .prod_name').html($(this).parent().find('.prod_name').html());
		$('.related_popup .product .price').html($(this).parent().find('.price').html());
		$('.related_popup .product').attr('id', $(this).attr('id')) 
		$('.related_popup .recommended a.rec_product').remove(); 
		$('.related_popup .recommended span.number').html(0);
		$.ajax({
			url: 'index.php?route=account/wishlist/getWishlistRelatedProduct',
			type: 'post',
			data: {product_id : $(this).attr('id')},
			dataType: 'json',
			success: function(json) {	
										
				if (json['products']) 
				{				
					for (i in json['products']) 
					{
						$('.related_popup .recommended h4').after('<a href="'+ json['products'][i]['href'] +'" class="rec_product"><div class="rec_product_img"><img src="'+ json['products'][i]['thumb'] +'" alt="'+ json['products'][i]['name'] +'"></div><div class="rec_product_info"><div>'+ json['products'][i]['designer'] +'</div><div class="light_font">'+ json['products'][i]['name'] +'</div><div>'+ json['products'][i]['price'] +'</div></div></a>');
						$('.related_popup .recommended span.number').html(json['products'].length);
					}
				} 
			}
		});
		
		$('.related_popup, .popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.related_popup').height()/2;
		var popupPosition = $(window).height()/2;
		$('.related_popup').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.related_popup').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}

	});
	$('.related_popup').click(function(event){
		event.stopPropagation();
	});
	$('.popup, .close_popup').click(function(){
		$('.related_popup, .popup').hide();
	});

	/* JOIN ORMARY POPUPS */

	/* SIGN IN */

	$('.open_sign_in_popup').click(function(event){
		event.preventDefault();
		$('.sign_in_popup, .popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.sign_in_popup').height()/2;
		var popupPosition = $(window).height()/2;
		$('.sign_in_popup').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.sign_in_popup').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
		
		$.ajax({
			url: 'index.php?route=account/register/designersList',
			type: 'post',
			data: {designer_id: 1},
			dataType: 'json',
			success: function(json) {
				$('.wrap_do_you_like .designer').attr('id', json['designer']['id']);
				$('.wrap_do_you_like #designer_name').html(json['designer']['name']);
				$('.wrap_do_you_like #designer_image').attr('src', json['designer']['image']);
				$('.wrap_do_you_like #designer_image').attr('alt', json['designer']['name']);
				$('.wrap_do_you_like .des-img ').attr('id', json['designer']['mid']);
				$('.wrap_do_you_like .designer_goods_slider .swiper-wrapper').html(json['designer']['image_list']);	
				designerGoods();
			}
		});
		
	});
	$('.sign_in_popup').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .sign_in_popup').hide();
	});

	/* SIGN UP */

	$('.open_ormary').click(function(event){
		event.preventDefault();
		$('.sign_up_popup, .popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.sign_up_popup').height()/2;
		var popupPosition = $(window).height()/2;
		$('.sign_up_popup').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.sign_up_popup').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
		
		
		$.ajax({
			url: 'index.php?route=account/register/designersList',
			type: 'post',
			data: {designer_id: 1},
			dataType: 'json',
			success: function(json) {
				$('.wrap_do_you_like .designer').attr('id', json['designer']['id']);
				$('.wrap_do_you_like #designer_name').html(json['designer']['name']);
				$('.wrap_do_you_like #designer_image').attr('src', json['designer']['image']);
				$('.wrap_do_you_like #designer_image').attr('alt', json['designer']['name']);
				$('.wrap_do_you_like .des-img ').attr('id', json['designer']['mid']);
				$('.wrap_do_you_like .designer_goods_slider .swiper-wrapper').html(json['designer']['image_list']);	
				designerGoods();
			}
		});
		
		
	});
	$('.sign_up_popup').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .sign_up_popup').hide();
	});

	/**/

	$('.open_wizard').click(function(event){
		event.preventDefault();
		
		$('.popup, .interested_in').show();
		$('.sign_up_popup').hide();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.interested_in').height()/2;
		var popupPosition = $(window).height()/2;
		$('.interested_in').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.interested_in').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	
	$('.interested_in').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .interested_in').hide();
	});

	/**/

	$("#registration-first-form input[type='checkbox']").click(function(event){
		
		if(this.checked)
		{
			$(this).val('1')
		}
		else
		{
			$(this).val('0');
		}
	});
	
	
	$('.open_wizard2').click(function(event){
		event.preventDefault();
		
		$.ajax({
			url: 'index.php?route=account/register/ajaxValidate',
			type: 'post',
			data: $('#registration-first-form input[type=\'text\'], #registration-first-form input[type=\'password\'], input[type=\'checkbox\'], #registration-first-form input[type=\'hidden\']'),
			dataType: 'json',
			success: function(json) {
				if (json['error'].length != 0) 
				{					
					if(json['error']['name'])
					{
						$('#registration-first-form #name-error').show();	
					}
					else
					{
						$('#registration-first-form #name-error').hide();
					}
					
					if(json['error']['email'])
					{
						$('#registration-first-form #email-error').show();	
					}
					else
					{
						$('#registration-first-form #email-error').hide();
					}
					
					if(json['error']['email_exist'])
					{
						$('#registration-first-form #email-exist-error').show();	
					}
					else
					{
						$('#registration-first-form #email-exist-error').hide();
					}
					
					if(json['error']['password'])
					{
						$('#registration-first-form #password-error').show();	
					}
					else
					{
						$('#registration-first-form #password-error').hide();
					}
					
					if(json['error']['terms'])
					{
						$('#registration-first-form #terms-error').show();	
					}
					else
					{
						$('#registration-first-form #terms-error').hide();
					}
				} 
				else
				{
					$('.sign_up_popup').hide();
					$('.do_you_like, .popup').show();
					var topDistance = $(window).scrollTop();
					var popupHeight = $('.do_you_like').height()/2;
					var popupPosition = $(window).height()/2;
					$('.do_you_like').css('top',topDistance + popupPosition - popupHeight);
					if (popupHeight > popupPosition) {
						$('.do_you_like').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
					}
					//$('.interested_in').hide();
					
					designerGoods();
				}	
			}
		});
		
		
	});
	$('.do_you_like').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .do_you_like').hide();
	});

	
	$('.bottom_btn .like').click(function(event){
		action = $(this).attr("id");
		mid = $('.wrap_do_you_like .designer').attr("id");
		
		if(action == "yes")
		{
			designer_image = $('.wrap_do_you_like #designer_image ').attr("src");
			designer_name = $('.wrap_do_you_like #designer_name ').text();
			designer_id = $('.wrap_do_you_like .des-img ').attr("id");
			output = '<div class="des_following clearfix"><a href="javascript:void(0)"><div class="des-img"><img src="'+ designer_image +'" alt="' + designer_name + '"></div> <span>' + designer_name + '</span><span class="light_font">Designer</span></a><a href="javascript:void(0)" class="light_btn" id="' + designer_id + '">Following</a></div>';
			
			$( ".you_are_following .bottom_btn" ).before( output );
			
			$('.wrap_you_are_following .you_are_following').find('.des_following .light_btn').click(function(){
				$(this).parent().remove();
			});
			
			$('.wrap_you_are_following .you_are_following').find('.des_following .light_btn').hover(function(){$(this).html("Unfollow");}, function(){$(this).html("Following");});
			
		}
		getNextDesigner(mid, action);		
	});
	
	$('.wrap_you_are_following .bottom_btn a').click(function(event){
		event.preventDefault();
		var mids = [];
		$( ".wrap_you_are_following .des_following .light_btn" ).each(function( ) {
			mids.push($(this).attr('id'));
		});
		
/*		$('#orm_registration #following_designers').attr('value', mids.toString());
		$('#orm_registration').submit();*/
		
		$('#registration-first-form #following_designers').attr('value', mids.toString());
		$('#registration-first-form').submit();
		
	});
		
	$('.open_wizard3').click(function(event){
		event.preventDefault();
		$('.you_are_following, .popup').show();
		$('.do_you_like').hide();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.you_are_following').height()/2;
		var popupPosition = $(window).height()/2;
		$('.you_are_following').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.you_are_following').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	$('.you_are_following').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .you_are_following').hide();
	});

	/* Add your shipping address popup */

	$('.open_shipping_address').click(function(event){
		event.preventDefault();
		$('.shipping_address, .popup').show();
		var topDistance = $(window).scrollTop();
		var popupHeight = $('.shipping_address').height()/2;
		var popupPosition = $(window).height()/2;
		$('.shipping_address').css('top',topDistance + popupPosition - popupHeight);
		if (popupHeight > popupPosition) {
			$('.shipping_address').css('maxHeight',popupPosition*2).css('overflow','auto').css('top',topDistance);
		}
	});
	$('.shipping_address').click(function(event){
		event.stopPropagation();
	});
	$('.popup').click(function(){
		$('.popup, .shipping_address').hide();
	});



	$('.save_address').click(function(event){
		event.preventDefault();
		
		//window.location.href = $(this).attr("href");	
		$.ajax({
			url: 'index.php?route=checkout/checkout/saveAddressAjax',
			type: 'post',
			data: $('#save_address_form input, #save_address_form select'),
			dataType: 'json',
			success: function(json) {
				if (json['errors'].length != 0) 
				{
					alert("You should fill all required fields!");
/*					if(json['errors']['firstname'])
					{
						$('#save_address_form #firstname-error').show();	
					}*/
				}
				else
				{
					window.setTimeout( function(){window.location.href = 'index.php?route=checkout/checkout';}, 2000 );
						
				}
			}
		});
		
	});
	

	$('#cart_select_all').click(function (){
		if(this.checked)
		{
			$('.product_select_checkbox').prop('checked', true);	
		}
		else
		{
			$('.product_select_checkbox').prop('checked', false);
		}
	});
	
	$('#cart_remove_selected').click(function (event){
		event.preventDefault();		
		
		$( "div.cart .table_row" ).each(function( index ) {
			if($(this).find("div.checkbox input").prop("checked"))
			{
				$.ajax({
					url: $(this).find('div.edit a').attr("href"),
					type: 'post',
					data: '',
					dataType: 'json',
					success: function(json) {}
				});
			}
			window.setTimeout( function(){window.location.href = 'index.php?route=checkout/cart';}, 1000 );
		});
	});

	$('#cart_move_to_wardrobe_selected').click(function (event){
		event.preventDefault();		
		
		$( "div.cart .table_row" ).each(function( index ) {
			if($(this).find("div.checkbox input").prop("checked"))
			{
				addToWishList($(this).find("div.checkbox input").val());
				$.ajax({
					url: $(this).find('div.edit a').attr("href"),
					type: 'post',
					data: '',
					dataType: 'json',
					success: function(json) {}
				});
			}
			window.setTimeout( function(){window.location.href = 'index.php?route=checkout/cart';}, 1000 );
		});
	});

/* ADD/REMOVE FOLOWERS*/
	
	$('#folow_designer').click(function (){
		if($('#folow_designer > span').attr("class") == 'plus')
		{
			$('#folow_designer > span.plus').text('-');
			$('#folow_designer > span.word').text('Unfollow')
			manufacture_id = $('#folow_designer > span.plus').attr("id");
			$('#folow_designer > span.plus').attr("class", 'minus');
			$.get("index.php", { route : 'account/follow/changeFollow', st : "follow", mid : manufacture_id}, function(data){ $('#follows_count').html(data); });
		}
		else
		{
			$('#folow_designer > span.minus').text('+');
			$('#folow_designer > span.word').text('Follow')
			manufacture_id = $('#folow_designer > span.minus').attr("id");
			$('#folow_designer > span.minus').attr("class", 'plus');
			$.get("index.php", { route : 'account/follow/changeFollow', st : "unfollow", mid : manufacture_id}, function(data){ $('#follows_count').html(data); });
		}
	});

	$('.unfollow_btn > a.unfollow').click(function (){
		manufacture_id =  $(this).attr("id");
		$.get("index.php", { route : 'account/follow/changeFollow', st : "unfollow", mid : manufacture_id}, function(){ location.reload();});
		
	});
	
	$('.follow_btn > a.follow').click(function (){
		manufacture_id =  $(this).attr("id");
		$.get("index.php", { route : 'account/follow/changeFollow', st : "follow", mid : manufacture_id}, function(){ location.reload();});
		
	});
	
	
	/* ---- Catalog Filter -----*/
	$( '.designer-search-wrap > input' ).on('input', function() {
		name = $(this).val();
//	
		if($(this).val() == '' && $('.designer-search-wrap .filter-designers input[checked="checked"]').length > 0)
		{
			$( "ul.filter-designers" ).html('');
			$('#orm_filter input[type="hidden"]').trigger('change');
		}
		$.get("index.php?route=module/category/getDesignersByName", { dname : name}, function(data){ 
			$( "ul.filter-designers" ).html(data); 
	
			$( "ul.filter-designers" ).find("input[type=radio]").change(function(){
				$( '#orm_filter input[name="path"]').trigger('change');
			});
		});
	});
	
/*	$( '.filter-colors li > span' ).click(function() {
		if($(this).hasClass("selected"))
		{
			$(this).removeClass("selected");
			color_id = "";
		}
		else
		{
			$( ".filter-colors li > span" ).removeClass("selected");
			$(this).addClass("selected");
			color_id = $(this).parent().attr("id").substring(2);	
		}
		
		$( "input#color" ).val(color_id).trigger('change');
	});*/
	
	
	$("#orm_filter").bind("keypress", function (e) {
		if (e.keyCode == 13) {
			return false;
		}
	});
	

	$( '#orm_search_word' ).submit(function(event) {
		 event.preventDefault();
		 //$('#orm_filter input[type="hidden"]').trigger('change');
		 var search_phrase = $( "#orm_search_word" ).serialize();
		 window.location.href = "/index.php?route=product/category&path=0&"+search_phrase;
	});
		
	$( '#orm_filter input[type="radio"], #orm_filter input[type="hidden"], #orm_filter select, #orm_sort_filter select, #orm_count_filter select' ).change(function() {
	
		var filter = $( "#orm_filter" ).serialize();
		var sort_filter = $( "#orm_sort_filter" ).serialize();
		var word_filter = $( "#orm_search_word" ).serialize();
                var count_filter = $( "#orm_count_filter" ).serialize();
		sort_filter = sort_filter.replace("-", "&order="); 

		if(window.location.search.toLowerCase().search( 'product/category' ) != -1)
                {
			window.location.href = "index.php?route=product/category&".concat(filter, "&", word_filter, "&", count_filter); //sort_filter, "&",
		}
		
		if(window.location.search.toLowerCase().search( 'product/manufacturer/info' ) != -1)
		{
			window.location.href = "index.php?route=product/manufacturer/info&".concat(filter, "&",  sort_filter, "&", count_filter);
		}
		
	});

});

/* Main slider */
var MainSliderLoop = true;
var newestCarouselLopp = true;

if ($('.orm_main_slider .swiper-slide').length < 2) {
	MainSliderLoop = false;
}

if ($('.orm_newest_carousel .swiper-slide').length < 6) {
	newestCarouselLopp = false;
}

var mySwiper = new Swiper('.orm_main_slider',{
  loop: MainSliderLoop,
  autoplay:6000,
  speed: 1500
})
$('.arrow-left').on('click', function(e){
	e.preventDefault()
	mySwiper.swipePrev()
})
$('.arrow-right').on('click', function(e){
	e.preventDefault()
	mySwiper.swipeNext()
})

/* Newest products */

	var newestCarousel = new Swiper('.orm_newest_carousel',{
		paginationClickable: true,
		slidesPerView: 5,
		loop: newestCarouselLopp,
		autoplay:3500,
		speed: 950
	})

	$('.newest_carousel_prev').on('click', function(e){
		e.preventDefault()
		newestCarousel.swipePrev()
	})
	$('.newest_carousel_next').on('click', function(e){
		e.preventDefault()
		newestCarousel.swipeNext()
	})



$(document).ready(function(){
	$('.orm_carousel_slide').click(function(){
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		var imgsource = $(this).children().children().attr('src');
		$('.product_image img').attr('src',imgsource);
	});
});

/* Designer goods slider */

function designerGoods(){

	var mySwiper3 = new Swiper('.designer_goods_slider',{
		paginationClickable: true,
		slidesPerView: 4,
		loop: true
	})

	 $('.des_slider_left').on('click', function(e){
		e.preventDefault()
		mySwiper3.swipePrev()
	})
	$('.des_slider_right').on('click', function(e){
		e.preventDefault()
		mySwiper3.swipeNext()
	})

}

/**/

$(function() {

	jQuery("#slider").slider({
		min: 0,
	    max: parseInt($('.slider_control #sliderMaxPrice').val()),
	    values: [$('.slider_control #minCost').text() , $('.slider_control #maxCost').text()],
	    range: true,
	    stop: function(event, ui) {
	        jQuery("span#minCost").text(jQuery("#slider").slider("values",0));
	        jQuery("span#maxCost").text(jQuery("#slider").slider("values",1));
			$('#slider_price_low').val(jQuery("#slider").slider("values",0));
			$('#slider_price_top').val(jQuery("#slider").slider("values",1)).trigger('change');
			
	    },
	    slide: function(event, ui){
	        jQuery("span#minCost").text(jQuery("#slider").slider("values",0));
	        jQuery("span#maxCost").text(jQuery("#slider").slider("values",1));
	    }
	});

});


function getNextDesigner(mid, action)
{
	$.ajax({
		url: 'index.php?route=account/register/getNextDesigner',
		type: 'post',
		data: {designer_id: mid, like: action },
		dataType: 'json',
		success: function(json) {
			
			if(json['all_designers'] == true)
			{
				$( ".open_wizard3" ).trigger( "click" );
			}
			else
			{
				$('.wrap_do_you_like .designer').attr('id', json['designer']['id']);
				$('.wrap_do_you_like #designer_name').html(json['designer']['name']);
				$('.wrap_do_you_like #designer_image').attr('src', json['designer']['image']);
				$('.wrap_do_you_like #designer_image').attr('alt', json['designer']['name']);
				$('.wrap_do_you_like .des-img ').attr('id', json['designer']['mid']);
				$('.wrap_do_you_like .designer_goods_slider .swiper-wrapper').html(json['designer']['image_list']);	
				designerGoods();
				if(json['designers_liked_count'] >=3)
				{
					$('.wrap_do_you_like .open_wizard3').show();
				}
			}
			
		}
	});	
}