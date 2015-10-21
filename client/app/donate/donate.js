var currentId = null;

Template.donate.onCreated(function () {
  Session.set("disableDonateBanner", true)
  Session.set("amount", 1)
  Session.set("kudosTotal", 50)
});

Template.donate.onRendered(function() {
  currentId = Meteor.userId()
});

Template.donate.onDestroyed(function () {
  Session.set("disableDonateBanner", false)
})

Template.donate.events({
  "keyup #amount": function(e) {
    var amount = $("#amount").val().replace(',', '')
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

  },
  "mouseup #amount": function(e) {
    var amount = $("#amount").val().replace(',', '')
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  },
  "change #amount": function(e) {
    var amount = $("#amount").val().replace(',', '')
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  },
  "click #submit": function(e) {
    var ccNum = $('#card-num').val(),
    cvc = $('#card-cvc').val(),
    expMo = $('#card-expMo').val(),
    expYr = $('#card-expYr').val(),
    amount = $('#amount').val()

    Stripe.card.createToken({
        number: ccNum,
        cvc: cvc,
        exp_month: expMo,
        exp_year: expYr,
    }, function(status, response) {
        stripeToken = response.id;
        Meteor.call('chargeCard', stripeToken, amount > 1 ? amount : 1, currentId);
    });
  }
})

Template.donate.helpers({
  isMobile: function () {
    return Darwin.device.match("phone")
  },
  storeItems: function () {
    return store.products
  },
  amount: function() {
    return Session.get("amount") ? Session.get("amount") : 1
  },
  kudosTotal: function() {
    return Session.get("kudosTotal") ? Session.get("kudosTotal") : 50
  },
  gestures:
  {
  	"swiperight .container": function(event, error) {
  		console.log("swipe")
  		window.location.replace("/")
  	},
  	"dragright .container": function(event, error) {
      window.location.replace("/")
  	}
  }
})
