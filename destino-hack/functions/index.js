// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
var request = require('request');

const {
    dialogflow,
    BasicCard,
    Permission,
    Suggestions,
    Carousel,
    List,
    Button,
    Image,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({
    debug: true
});

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
    'indigo taco': {
        title: 'Indigo Taco',
        text: 'Indigo Taco is a subtle bluish tone.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
            accessibilityText: 'Indigo Taco Color',
        },
        display: 'WHITE',
    },
    'pink unicorn': {
        title: 'Pink Unicorn',
        text: 'Pink Unicorn is an imaginative reddish hue.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
            accessibilityText: 'Pink Unicorn Color',
        },
        display: 'WHITE',
    },
    'blue grey coffee': {
        title: 'Blue Grey Coffee',
        text: 'Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.',
        image: {
            url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
            accessibilityText: 'Blue Grey Coffee Color',
        },
        display: 'WHITE',
    },
};

// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const fakeColorCarousel = () => {
    const carousel = new Carousel({
        items: {
            'indigo taco': {
                title: 'Indigo Taco',
                synonyms: ['indigo', 'taco'],
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
                    alt: 'Indigo Taco Color',
                }),
            },
            'pink unicorn': {
                title: 'Pink Unicorn',
                synonyms: ['pink', 'unicorn'],
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
                    alt: 'Pink Unicorn Color',
                }),
            },
            'blue grey coffee': {
                title: 'Blue Grey Coffee',
                synonyms: ['blue', 'grey', 'coffee'],
                image: new Image({
                    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
                    alt: 'Blue Grey Coffee Color',
                }),
            },
        }
    });
    return carousel;
};

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    // Asks the user's permission to know their location, for personalization.
    conv.ask(new Permission({
        context: 'To know your location',
        permissions: 'DEVICE_PRECISE_LOCATION',
    }));
});

//// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
//// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    /*
    console.log("***hola***: %0 ",conv.device.location.coordinates);
    console.error("***hola-e***: %0 ",conv.device.location.coordinates);
    console.error(conv.device.location.coordinates);
    console.log(conv.device.location.coordinates);
    */
    let coordinates = conv.device.location.coordinates;
    if (!permissionGranted) {
        // If the user denied our request, go ahead with the conversation.
        conv.ask('Without the requested location information I am unable to provide suggestions.');
        conv.close("Okay, let's try this again later.");
    } else {
        conv.ask(`I see you are near (lat: ${coordinates.latitude}, long: ${coordinates.longitude})  Centro de Bellas Artes.  Would you like to know about events from there?`);
        conv.ask(new Suggestions('Yes', 'No'));
    }
});

// Create a list
/*
conv.ask(new List({
  title: 'List Title',
  items: {
    // Add the first item to the list
    [SELECTION_KEY_ONE]: {
      synonyms: [
        'synonym of title 1',
        'synonym of title 2',
        'synonym of title 3',
      ],
      title: 'Title of First List Item',
      description: 'This is a description of a list item.',
      image: new Image({
        url: IMG_URL_AOG,
        alt: 'Image alternate text',
      }),
    },
    // Add the second item to the list
    [SELECTION_KEY_GOOGLE_HOME]: {
      synonyms: [
        'Google Home Assistant',
        'Assistant on the Google Home',
    ],
      title: 'Google Home',
      description: 'Google Home is a voice-activated speaker powered by ' +
        'the Google Assistant.',
      image: new Image({
        url: IMG_URL_GOOGLE_HOME,
        alt: 'Google Home',
      }),
    },
    // Add the third item to the list
    [SELECTION_KEY_GOOGLE_PIXEL]: {
      synonyms: [
        'Google Pixel XL',
        'Pixel',
        'Pixel XL',
      ],
      title: 'Google Pixel',
      description: 'Pixel. Phone by Google.',
      image: new Image({
        url: IMG_URL_GOOGLE_PIXEL,
        alt: 'Google Pixel',
      }),
    },
  },
}));*/

/*
function category_make_a_list(category_result){
   var items = {};
   for (var r in category_result){
      var item = {};
      item.title = r.name;
      item.description = r.description;
      item.image = new Image({
         url: r.image.url,
         alt: r.image.alt,
      });
      items.push({[r.name.replace(/[\s\:]/g, "_")] : item});
   };
   return items;
}
*/
function category_make_a_list(category_result) {

    var items = [];
    for (var i = 0; i < category_result.length; i++) {
        var item = {};

        item.title = category_result[i].name;
        item.description = category_result[i].description;
        item.image = new Image({
            url: category_result[i].image.url,
            alt: category_result[i].image.alt
        });


        items.push({
            [category_result[i].name.replace(/[\s\:]/g, "_")]: item
        });
    };
    return items;
};
// music, ballet, comedy, musical.  
app.intent('events_by_category', (conv, {
    event_category
}) => {
    //conv.ask(`You picked ${event_category}. Let me see`);

    return new Promise(function(resolve, reject) {

        var items = [];

        request(`https://localinsider.app/category/${event_category}`, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                //here put what you want to do with the request
                var title = event_category;
                //var items = category_make_a_list(body);
                //console.log("***hola***: %0 ", body);
                //console.log(body);
                //conv.ask("You are here");
                //console.log("***hola***: %0 ",response);
                //console.log(response);
                for(var i=0; i<body.length; i++){ 
                       var item = {};

                    var k = i + 1;
                    item.title = k + " " + body[i].name;
                    item.description = body[i].description;
                    /*          item.image = new Image({
                       url: body[i].image.url,
                       alt: body[i].image.alt
                    });*/
                 

                    var str = k + " " + body[i].name;
                    var newtitle = str.replace(/[\s\:]/g, "_"); 
                    items.push({[newtitle] : item});
                 };
                //ignore//return items;
                conv.ask(`You picked ${event_category}.  Let me see. I have the following events under ${event_category}`); 
                
                conv.ask("here you go", new List({
                  title: title, 
                  items: items,
                })); 
                resolve();
            } else {
                reject();
            };

        });
    });
});

// Handle the Dialogflow follow-up intents
app.intent(['actions_intent_PERMISSION_yes', 'centro-bellas-artes'], (conv) => {
    conv.ask('Today Felito Felix is playing some music.  Would you like to know more?');
    conv.ask(new Suggestions('Yes', 'No', 'What else is there'));
});

app.intent(['actions_intent_PERMISSION_yes_yes'], (conv) => {
    // Create a basic card
    conv.ask(`Here you go.`, new BasicCard({
        text: `El concierto, La Trayectoria, se llevará a cabo en la Sala Sinfónica 
  del Centro de Bellas Artes de Santurce el domingo, 7 de octubre a las 4PM.`,
        // Note the two spaces before '\n' required for
        // a line break to be rendered in the card.
        title: 'Concierto La Trayectoria',
        buttons: new Button({
            title: 'Evento en p&acute;gina de Bellas Artes',
            url: 'https://www.cba.pr.gov/eventos-detalles/felito-felix-2/',
        }),
        image: new Image({
            url: 'https://www.cba.pr.gov/wp-content/uploads/2018/07/felito-80x80.jpg',
            alt: 'Felito Felix La Trayectoria',
        }),
        display: 'CROPPED',
    }));
    conv.ask('I can also talk to you about music, ballet, comedy, musical.  What do you want to know more about?');
});

app.intent(['actions_intent_PERMISSION_yes_no'], (conv) => {
    conv.close(`Okay, Goodbye!`);
});

app.intent(['actions_intent_PERMISSION_yes_what_else_is_there'], (conv) => {
    conv.ask('I can talk to you about music, ballet, comedy, musical.  What do you want to know more about?');
});

app.intent(['actions_intent_PERMISSION_no', 'centro-bellas-artes - no', 'goodbye'], (conv) => {
    conv.close(`Okay, Goodbye!`);
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {
    color
}) => {
    const luckyNumber = color.length;
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
    if (conv.user.storage.userName) {
        // If we collected user name previously, address them by name and use SSML
        // to embed an audio snippet in the response.
        conv.ask(`<speak>${conv.user.storage.userName}, your lucky number is ` +
            `${luckyNumber}.<audio src="${audioSound}"></audio> ` +
            `Would you like to hear some fake colors?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    } else {
        conv.ask(`<speak>Your lucky number is ${luckyNumber}.` +
            `<audio src="${audioSound}"></audio> ` +
            `Would you like to hear some fake colors?</speak>`);
        conv.ask(new Suggestions('Yes', 'No'));
    }
});

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, {
    fakeColor
}) => {
    fakeColor = conv.arguments.get('OPTION') || fakeColor;
    // Present user with the corresponding basic card and end the conversation.
    if (!conv.screen) {
        conv.ask(colorMap[fakeColor].text);
    } else {
        conv.ask(`Here you go.`, new BasicCard(colorMap[fakeColor]));
    }
    conv.ask('Do you want to hear about another fake color?');
    conv.ask(new Suggestions('Yes', 'No'));
});

// Handle the Dialogflow NO_INPUT intent.
// Triggered when the user doesn't provide input to the Action
app.intent('actions_intent_NO_INPUT', (conv) => {
    // Use the number of reprompts to vary response
    const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
    if (repromptCount === 0) {
        conv.ask('Which color would you like to hear about?');
    } else if (repromptCount === 1) {
        conv.ask(`Please say the name of a color.`);
    } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
        conv.close(`Sorry we're having trouble. Let's ` +
            `try this again later. Goodbye.`);
    }
});

// Handle the Dialogflow follow-up intents
app.intent(['favorite color - yes', 'favorite fake color - yes'], (conv) => {
    conv.ask('Which color, indigo taco, pink unicorn or blue grey coffee?');
    // If the user is using a screened device, display the carousel
    if (conv.screen) return conv.ask(fakeColorCarousel());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
