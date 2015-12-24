$(function() {

  // Default variables:
  //===================
  var chosenGenre;

  // Define cart model:
  //===================
  var CartModel = $.Model([], 'cart-model');

  // Define views:
  //==============
  var GenreView = $.View({
    element: '#fragranceGenres'
  });
  GenreView.render(['ladies','men','kids']);

  var AvailableFragrancesView = $.View({
    element: '#availableFragrances',
    variable: 'fragrance'
  });

  var FragrancesGenreTitleView = $.View({
    element: '#fragrancesGenreTitle',
    variable: 'title'
  });

  var FragranceDetailView = $.View({
    element: '#fragranceDetail',
    variable: 'chosenFragrance'
  });

  var DetalTitleView = $.View({
    element: '#detailTitle',
    variable: 'title'
  });

  CartView = $.View({
    element: '#purchaseItems',
    model: CartModel,
    variable: 'item'
  });

  var TotalItemsView = $.View({
    element: '#totalItems',
    variable: 'total'
  });

  var TotalCostView = $.View({
    element: '#totalCost',
    variable: 'total'
  });

  var TotalPurchasedItemsViews = $.View({
    element: '#purchaseDetails',
    variable: 'item',
    model: CartModel
  });

  var TotalPurchaseCostView = $.View({
    element: '#confirmTotalCost',
    variable: 'cost'
  });

  // Add to cart:
  //=============
  $('#addToCart').on('tap', function() {
    var fragrance = $(this).data('fragrance');
    CartModel.push(fragrance);
    $.GoToScreen('cart');
    CartModel.sortBy('genre', 'product_title')
    CartView.render();
    var prices = CartModel.pluck('wholesale_price');
    var sum = 0;
    prices.forEach(function(price) {
      sum += parseFloat(price);
    });
    TotalItemsView.render([CartModel.size()]);
    TotalCostView.render([$.currency(sum)]);

    TotalPurchaseCostView.render([$.currency(sum)]);
    $('#backToFragrance').find('span').text(fragrance.product_title);
  });

  // Popup for empty cart:
  //======================
  $.Popup({
    id: "emptyCart",
    title: 'Warning!', 
    message: 'There is nothing in the cart. Please add some items first.', 
    continueButton: 'OK'
  });

  // Go to cart:
  //============
  $('#shoppingCart').on('tap', function() {
    if (!CartModel.hasData()) {
      $('#emptyCart').ShowPopup();
    } else {
      $.GoToScreen('cart');
    }
  });

  // Cancel purchase:
  //=================
  $('#cancelOrder').on('tap', function() {
    CartModel.purge();
    TotalItemsView.empty();
    TotalCostView.empty();
    CartView.empty();
    $.GoBackToScreen('main');
  });

  // Place order:
  //==============
  $('#placeOrder').on('tap', function() {
    $.GoToScreen('confirmation');
    TotalPurchasedItemsViews.render();
    function confirmationNumber() {
      var d = Date.now();
      var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      var randomLetter = charset[Math.floor(Math.random() * charset.length)];
      return randomLetter + 'xx-xxxx-xxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
    $('#confirmationNum').text(confirmationNumber());
  });

  $('#backToCart').on('tap', function() {
    CartModel.purge();
    TotalItemsView.empty();
    TotalCostView.empty();
    CartView.empty();
  });

  // Define Routes:
  //===============
  var FragranzRoutes = $.Router();
  FragranzRoutes.addRoute([
    {
      route: 'fragranceList',
      callback: function(genre) {
        chosenGenre = [];
        fragrances.forEach(function(fragrance) {
          if (fragrance.genre === genre) {
            chosenGenre.push(fragrance)
          }
        });
        AvailableFragrancesView.render(chosenGenre);
        FragrancesGenreTitleView.render([genre]);
        $('#backToGenre span').text(genre);
      }
    },
    {
      route: 'detail',
      callback: function(sku) {
        var chosenFragrance = chosenGenre.filter(function(fragrance) {
          return fragrance.sku === sku;
        });
        FragranceDetailView.render(chosenFragrance);
        DetalTitleView.render([chosenFragrance[0].product_title])
        $('#addToCart').data('fragrance', chosenFragrance[0]);
      }
    }
  ]);

});