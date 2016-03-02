function InitializeParse(){
  Parse.initialize("Vn3IGfSR9TI5K4qyc4L5GJ1mPMQtK7lq0CzOrfMX", "VSP8xmUhuPaUiPCShdtzrz9a3RSrVUUE3q5BF5yc");    
}

function createEntity(entity, mapArgs){
  var __object = Parse.Object.extend(entity);
var _object = new __object();


$.map( mapArgs, function( value, index ) {
  _object.set(index,value);
});

_object.save(null, {
  success: function(_object) {
    alert('New object created with objectId: ' + _object.id);
  },
  error: function(_object, error) {
    alert('Failed to create new object, with error code: ' + error.message);
  }
});
}

function login(user, pass){   
  Parse.User.logIn(user, pass, {
    success: function(user) {
        window.location.href = "./template/index.html";
    },
    error: function(user, error) { 
      alert("tttt"); } 
  });        
}

function printCardsToUser(rootElement,userID) {
      $("#"+rootElement).html("");
      ListCards(findCardsByUserQuery(userID),$("#"+rootElement), 'name', '');
}
function printEvents(rootElement) { 
  alert("dddr");
      $("#"+rootElement).html("");
      ListEvents(findAllEventsQuery(), $("#"+rootElement), 'Name', '');
}


function ListCards(query, rootElement, printProperty, onClickFunction) {
      query.find({
        success: function(results) {

          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            onClickString = '';
            if(onClickFunction) {
              onClickString = 'onClick='+onClickFunction+'("'+object.id+'")';
            }
            rootElement.append('<li>'+
          '<div class="feat_small_icon"><img src='+object.get('image')+' alt="" title="" style="border-radius: 50%;" /></div>'+
          '<div class="feat_small_details">'+
          '<h4>'+object.get('name')+'</h4>'+
          '<a href="photos.html">'+object.get('description')+'</a>'+
          '</div>'+
          '<div class="view_more"><a id="shareCard" href="shareCard.html?id='+object.id+'"><i class="fa fa-share fa-2x"></i></a>&nbsp;<a href="photos.html"><i class="fa fa-plus-circle fa-2x"></i></a></div>'+
          '</li>');             


          }
        
        },
        error: function(error) {

        }
      });
}


function ListEvents(query, rootElement, printProperty, onClickFunction) {
      query.find({
        success: function(results) {

          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            onClickString = '';
            if(onClickFunction) {
              onClickString = 'onClick='+onClickFunction+'("'+object.id+'")';
            }
            rootElement.append('<li>'+
          '<div class="feat_small_icon"><img src="images/icons/black/team.png" alt="" title="" /></div>'+
          '<div class="feat_small_details">'+
          '<h4>'+object.get('Name')+'</h4>'+
          '<a href="photos.html">'+object.get('description')+'</a>'+
          '</div>'+
          '<div class="view_more"><a href="photos.html"><i class="fa fa-plus-circle"></i></a></div>'+
          '</li>');

          }
        
        },
        error: function(error) {

        }
      });
}


/*


    function printCardsIntoEvents(rootElement,eventID) {
      $("#"+rootElement).empty();
      printList(findCardsByEventQuery(eventID),$("#"+rootElement), 'name', '');

    }

*/

/////////////
// REQUEST TO BBDD
////////////
function findAllEventsQuery() {
  var _event = Parse.Object.extend("Event");
  var query = new Parse.Query(_event);
  return query;
}
/*
function findCardsByEventQuery(eventID) {
  var _event = Parse.Object.extend("Event");
  var thisEvent = new _event();
  thisEvent.id = eventID;

  var _card = Parse.Object.extend("Card");
  var query = new Parse.Query(_card);
  query.equalTo("event", thisEvent);
  return query;
}*/

function findCardsByUserQuery(userID) {
  var _user = Parse.Object.extend("User");
  var thisUser = new _user();
  thisUser.id = userID;

  var _card = Parse.Object.extend("Card");
  var query = new Parse.Query(_card);
  query.equalTo("owner", thisUser);
  return query;
}






















function addOwnerToCard(userID, cardID){
  var Card = Parse.Object.extend("Card");
  var User = Parse.Object.extend("User");
  var userQuery = new Parse.Query(User);
        userQuery.get(userID, {
    success: function(owner) {
      var cardQuery = new Parse.Query(Card);
      cardQuery.get(cardID, {
        success: function(card) {
          var relation = card.relation('owner');
          relation.add(owner);
          card.save(null, {
            success: function(owner) {
            },
            error: function(owner, error) {
            }
          }); 
        },
        error: function(error) {
        }
      });
    }, 
    error: function (error) {
    }
  });
}

function addOwnerToEvent(userID, eventID){
  var Event = Parse.Object.extend("Event");
  var User = Parse.Object.extend("User");
  var userQuery = new Parse.Query(User);
        userQuery.get(userID, {
    success: function(owner) {
      var eventQuery = new Parse.Query(Event);
      eventQuery.get(eventID, {
        success: function(_event) {
          var relation = _event.relation('owner');
          relation.add(owner);
          _event.save(null, {
            success: function(owner) {
            },
            error: function(owner, error) {
            }
          }); 
        },
        error: function(error) {
        }
      });
    }, 
    error: function (error) {
    }
  });
}

function addCardIntoEvent(cardID, eventID){
  var Event = Parse.Object.extend("Event");
  var Card = Parse.Object.extend("Card");
  var intersect = new Parse.Object("CardInEvent");


  var query = new Parse.Query("CardInEvent");
  query.notEqualTo("hash", ""+cardID+""+eventID+"");
  query.find({
    success: function(object) { 
          intersect.save({hash: ""+cardID+""+eventID+""}, {
      success: function(data) {
        var cardQuery = new Parse.Query(Card);
        cardQuery.get(cardID, {
          success: function(card) {
            var relation = intersect.relation('card');
            relation.add(card);
            intersect.save();

            var eventQuery = new Parse.Query(Event);
            eventQuery.get(eventID, {
              success: function(_event) {
                var relation = intersect.relation('event');
                relation.add(_event);
                intersect.save(); 
              },
              error: function(error) { }
            });
          }, 
          error: function (error) { }
        });
      },
      error: function(data, error) { }
    });
    },
    error: function(object, error) {
alert("Dont Save hash In Use");

    }
  });
}