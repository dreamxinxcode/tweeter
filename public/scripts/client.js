/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
};

const data = [{
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];


// Tweet template
const createTweetElement = (tweetObject) => {
  const template = `
    <article class='tweet'>
      <header>
        <div>
          <img id='tweet-profile-image' src="${tweetObject.user.avatars}">
          <h3>${tweetObject.user.name}</h3>
        </div>
        <div>
          <p class='handle'>${tweetObject.user.handle}</p>
        </div>
      </header>
      <p class='tweet-content'>${tweetObject.content.text}</p>
      <footer>
        <p class="timestamp">${moment(tweetObject.created_at).fromNow()}</p>
        <div class="icons">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
    `;
  return template;
};


// Show tweets in reverse chronological order
const renderTweets = (tweets) => {
  for (const tweet in tweets) {
    const $tweetElement = createTweetElement(tweets[tweet]);
    $('#tweets-container').prepend($tweetElement);
  }
};


// For XXS mitigation
const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// When the DOM has fully loaded
$(document).ready(() => {
  const $tweetForm = $('#tweet-form');

  const loadTweets = () => {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
      dataType: 'JSON',
      success: (tweetsResponse) => {
        renderTweets(tweetsResponse);
      },
      error: (error) => {
        console.log(error)
      }
    });
  };

  // Appends an error message above tweet form
  const errorMsg = (message) => {
    $('.new-tweet').prepend(`<div id="error-alert"><i class="fa fa-exclamation-triangle"></i><p>${message}</p><i class="fa fa-exclamation-triangle"></i></div>`);
  };

  // When sumbit button is pressed
  $tweetForm.on('submit', (event) => {
    event.preventDefault();
    const tweetLength = $('#tweet-text').val().length;

    // Check if tweet is valid
    if (!tweetLength) {
      errorMsg('Your tweet muct contain atleast 1 character');
      return;
    } else if (tweetLength > 140) {
      errorMsg('Your tweet must be 140 characters or less');
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'POST',
      data: {
        text: escape($('#tweet-text').val())
      },
    }).then(() => {
      loadTweets();
    });
    $('#tweet-text').val("");
    $('#error-alert').remove();
  });

  loadTweets();
});