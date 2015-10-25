var currentId = null;
var Schema = {}
Schema.donatePage = new SimpleSchema({
  amount: {
    type: Number,
    min: 1,
    optional: false
  },
  creditCard: {
    type: String,
    autoform: {
      type: "payments/creditCard"
    },
    custom: PaymentsHelpers.CreditCardValidation
  },
  cvc: {
    type: String,
    autoform: {
      type: "payments/creditCardCVC"
    },
    custom: PaymentsHelpers.CVCValidation
  },
  expiration: {
    type: String,
    autoform: {
      type: "payments/creditCardExpiry"
    },
    custom: PaymentsHelpers.CCExpiryValidation
  }
})

Template.donate.onCreated(function () {
  Session.set("disableDonateBanner", true)
  Session.set("amount", 1)
  Session.set("kudosTotal", 50)
});

Template.donate.onRendered(function() {
  currentId = Meteor.userId()
  this.autorun(function(){
    $('#card-num').payment('formatCardNumber');
    $('#card-exp').payment('formatCardExpiry');
    $('#card-cvc').payment('formatCardCVC');
  });
});

Template.donate.onDestroyed(function () {
  Session.set("disableDonateBanner", false)
  $("#checkout").modal("hide")
})

Template.donate.events({
  "keyup #amount": function(e) {
    var amount = parseFloat($("#amount").val()) >= 1 ? $("#amount").val().split(',').join('') : 1
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount >= 1 ? parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 1);
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

  },
  "mouseup #amount": function(e) {
    var amount = parseFloat($("#amount").val()) >= 1 ? $("#amount").val().split(',').join('') : 1
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount >= 1 ? parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 1);
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  },
  "change #amount": function(e) {
    var amount = parseFloat($("#amount").val()) >= 1 ? $("#amount").val().split(',').join('') : 1
    var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

    //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); to put commas
    Session.set("amount", amount >= 1 ? parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 1);
    Session.set("kudosTotal", kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  },
  "click #submit": function(e) {
    e.preventDefault();

    var ccNum = $('#card-num').val().split(" ").join(""),
    cvc = $('#card-cvc').val(),
    exp = $('#card-exp').val().split(" ").join(""),
    amount = $('#amount').val()

    Stripe.card.createToken({
        number: ccNum,
        cvc: cvc,
        exp_month: exp.split('/')[0],
        exp_year: exp.split('/')[1]
    }, function(status, response) {
        stripeToken = response.id;
        Meteor.call('chargeCard', stripeToken, amount > 1 ? amount : 1, currentId);
        $("#checkout").modal("hide")
        $("#thankYou").modal("show")
    });
  },
  "hide.bs.modal #thankYou": function(e) {
    window.location.replace('/');  //Redirect
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
  errors: function() {
    return Session.get("errors")
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
  },
  donatePage: function() {
    return Schema.donatePage;
  }
})
