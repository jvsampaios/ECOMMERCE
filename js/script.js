var shoppingCart = (function() {
	cart = [];
	function Item(name, price, count) {
	  this.name = name;
	  this.price = price;
	  this.count = count;
	}
	function saveCart() {
	  //sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
		for(var item in cart){
			document.cookie = `${cart[item].name}=` + cart[item].name +','+ cart[item].price + ',' + cart[item].count;
			//console.log(document.cookie)
		}
	}

	function loadCart() {
	  //cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
		//cart = JSON.parse(document.cookie);
		let cookieArray = document.cookie.split(';')
		for(let i = 0; i< cookieArray.length; i++){
		  let ondeCortar = cookieArray[i].indexOf('=')+1;
			let itemValueArray = cookieArray[i].slice(ondeCortar);
			itemValueArray = itemValueArray.split(',');
			let indItem = {
				name: itemValueArray[0],
				price: itemValueArray[1],
				count: itemValueArray[2]
			}
			cart.push(indItem)
			//console.log(indItem)
		}
	}
	// if (sessionStorage.getItem("shoppingCart") != null) {
	//   loadCart();
	// }
	if (document.cookie) {
		   loadCart();
	}

	var obj = {};
	obj.addItemToCart = function(name, price, count) {
	  for(var item in cart) {
			if(cart[item].name === name) {
				cart[item].count ++;
				saveCart();
				return;
			}
	  }
	  var item = new Item(name, price, count);
	  cart.push(item);
	  saveCart();
	}

	obj.setCountForItem = function(name, count) {
	  for(var i in cart) {
			if (cart[i].name === name) {
				cart[i].count = count;
				break;
			}
	  }
	};

	obj.removeItemFromCart = function(name) {
		for(var item in cart) {
		  if(cart[item].name === name) {
			cart[item].count --;
			if(cart[item].count === 0) {
			  cart.splice(item, 1);
				//retirando o cookie
				let cookieArray = document.cookie.split(';')
				for(let i = 0; i< cookieArray.length; i++){
					console.log(cart[item])
					let ondeCortar = cookieArray[i].indexOf('=')+1;
					let itemValueArray = cookieArray[i].slice(ondeCortar);
					itemValueArray = itemValueArray.split(',');
					if(itemValueArray[0] == name){
						let nomeCookie = cookieArray[i].slice(0, ondeCortar);
				document.cookie = `${nomeCookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
					}
				}
			}
			break;
		  }
	  }
	  saveCart();
	}
	obj.removeItemFromCartAll = function(name) {
		//retirando da string cart
	  for(var item in cart) {
			if(cart[item].name === name) {
				cart.splice(item, 1);
				break;
			}
	  }
		//retirando do cookie
		let cookieArray = document.cookie.split(';')
		for(let i = 0; i< cookieArray.length; i++){
			let ondeCortar = cookieArray[i].indexOf('=')+1;
			let itemValueArray = cookieArray[i].slice(ondeCortar);
			itemValueArray = itemValueArray.split(',');
			if(itemValueArray[0] == name){
				let nomeCookie = cookieArray[i].slice(0, ondeCortar);
				document.cookie = `${nomeCookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
			}
		}
	  saveCart();
	}
  obj.clearCart = function() {
	  cart = [];
		let cookieArray = document.cookie.split(';')
		for(let i = 0; i< cookieArray.length; i++){
			let nomeCookie = cookieArray[i].slice(0, ondeCortar);
			document.cookie = `${nomeCookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
		}
	  saveCart();
	}
  obj.totalCount = function() {
		var totalCount = 0;
		if(document.cookie){
			let cookieArray = document.cookie.split(';')
			totalCount = cookieArray.length
		}
		return totalCount;
	}

	obj.totalCart = function() {
	  var totalCart = 0;
	  for(var item in cart) {
			totalCart += cart[item].price * cart[item].count;
	  }
	  if(totalCart==0){
			return Number(totalCart.toFixed(2)) + "<br>" + " Adicione Produtos ao Carrinho.";
	}
	  return Number(totalCart.toFixed(2));
	}

  obj.listCart = function() {
	  var cartCopy = [];
	  for(i in cart) {
			let item = cart[i];
			itemCopy = {};
			for(p in item) {
				itemCopy[p] = item[p];
			}
			itemCopy.total = Number(item.price * item.count).toFixed(2);
			cartCopy.push(itemCopy)	
	  }
	  return cartCopy;
	}
  
	return obj;
  })();
  
  $('.add-to-cart').click(function(event) {
		event.preventDefault();
		var name = $(this).data('name');
		var price = Number($(this).data('price'));
		shoppingCart.addItemToCart(name, price, 1);
		displayCart();
  });
	
  $('.clear-cart').click(function() {
		shoppingCart.clearCart();
		displayCart();
  });
  
  
  function displayCart() {
		var cartArray = shoppingCart.listCart();
		shoppingCart.totalCount();
		var output = "";
		for(var i in cartArray) {
			output += "<tr>"
			+ "<td>" + cartArray[i].name + "</td>" 
			+ "<td>(" + "Valor Unitário: R$" + cartArray[i].price + ")</td>"
			+ "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
			+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
			+ "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
			+ "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
			+ " = " 
			+ "<td>" + cartArray[i].total + "</td>" 
			+  "</tr>";
	}
	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
  }
  
  
  $('.show-cart').on("click", ".delete-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCartAll(name);
	displayCart();
  })

  $('.show-cart').on("click", ".minus-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCart(name);
	displayCart();
  })

  $('.show-cart').on("click", ".plus-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.addItemToCart(name);
	displayCart();
  })
  
  $('.show-cart').on("change", ".item-count", function(event) {
	 var name = $(this).data('name');
	 var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();
  });
  
  displayCart();

  