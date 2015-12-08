var currentId = null
var Schema = {}
// Schema for doing validation of Stripe form
Schema.donatePage = new SimpleSchema({
  amount: {
    type: Number,
    min: 1,
    optional: false
  },
  creditCard: {
    type: String,
    autoform: {
      type: 'payments/creditCard'
    },
    custom: PaymentsHelpers.CreditCardValidation
  },
  cvc: {
    type: String,
    autoform: {
      type: 'payments/creditCardCVC'
    },
    custom: PaymentsHelpers.CVCValidation
  },
  expiration: {
    type: String,
    autoform: {
      type: 'payments/creditCardExpiry'
    },
    custom: PaymentsHelpers.CCExpiryValidation
  }
})

function parseAmount() {
  // If amount is 1 or higher, show it (split out commas because they aren't needed) if not, show 1
  var amount = parseFloat($('#amount').val()) >= 1 ? $('#amount').val().split(',').join('') : 1
  // If amount * 50 is over 0, show it if not show 50.
  var kudosTotal = (Math.ceil(amount * 50) > 0) ? Math.ceil(amount * 50) : 50

  //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") to put commas
  Session.set('amount', amount >= 1 ? parseFloat(amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 1)
  Session.set('kudosTotal', kudosTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
}

Template.donate.events({
  'blur': function(e) {
    $('#serverMessage').html("")  // Remove error messages whenever the user clicks on the page
  },
  // Next three events auto-updates amount on input
  'keyup #amount': function(e) {
    parseAmount()
  },
  'mouseup #amount': function(e) {
    parseAmount()
  },
  'change #amount': function(e) {
    parseAmount()
  },
  'click #submit': function(e) {
    e.preventDefault()

    var ccNum = $('#card-num').val().split(' ').join(''),
    cvc = $('#card-cvc').val(),
    exp = $('#card-exp').val().split(' ').join(''),
    amount = $('#amount').val()

    Stripe.card.createToken({
        number: ccNum,
        cvc: cvc,
        exp_month: exp.split('/')[0],
        exp_year: exp.split('/')[1]
    }, function(status, response) {
        stripeToken = response.id
        Meteor.call('chargeCard', stripeToken, amount > 1 ? amount : 1, currentId, function(err, result) {
          if(!err) {
            $('#checkout').modal('hide')
            $('#thankYou').modal('show')
          }
          else {
            $('#serverMessage').html("<b>Something went wrong, your card may have been declined.</b>")
          }
        })
    })
  },
  'hide.bs.modal #thankYou': function(e) {
    window.location.replace('/')  //Redirect
  }
})


Template.donate.onCreated(function() {
  Session.set('disableDonateBanner', true)
  Session.set('amount', 1)
  Session.set('kudosTotal', 50)
})

Template.donate.onRendered(function() {
  window.scrollTo(0, 0)  // Fixes bug where scroll of page navigated from would be replicated
  currentId = Meteor.userId()
  this.autorun(function() {
    $('#card-num').payment('formatCardNumber')
    $('#card-exp').payment('formatCardExpiry')
    $('#card-cvc').payment('formatCardCVC')
  })

  var stripeHeight = $('#stripeBtn').height()  //In px
  $('#indieBtn').height(stripeHeight)
})

Template.donate.onBack(function(details, origin) {
  $('#checkout').modal('hide')
  $('#thankYou').modal('show')
})

Template.donate.onDestroyed(function() {
  Session.set('disableDonateBanner', false)
  $('#checkout').modal('hide')
})

Template.donate.helpers({
  isMobile: function() {
    return Meteor.utilities.isMobile()
  },
  isApple: function() {
    return Darwin.device.match('ios')
  },
  amount: function() {
    return Session.get('amount') ? Session.get('amount') : 1
  },
  kudosTotal: function() {
    return Session.get('kudosTotal') ? Session.get('kudosTotal') : 50
  },
  gestures: {
  	'swiperight .container': function(event, error) {
  		console.log('swipe')
  		window.location.replace('/')
  	},
  	'dragright .container': function(event, error) {
      window.location.replace('/')
  	}
  },
  donatePage: function() {
    return Schema.donatePage
  }
})
