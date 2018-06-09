'use strict';

var ADVERTS_COUNT = 8;
var AVATARS_COUNT = 8;
var AVATAR = {
  FILE_PATH: 'img/avatars/user',
  FILE_TYPE: {
    PNG: '.png'
  }
};
var MIN_GUESTS_COUNT = 5;
var MAX_GUESTS_COUNT = 10;
var MIN_ROOMS_COUNT = 1;
var MAX_ROOMS_COUNT = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LOCATION_X = 300;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var MAP_PIN_X_OFFSET = 25;
var MAP_PIN_Y_OFFSET = 70;
var CAPACITY_ROOMS_TEXT = ' комнаты для ';
var CAPACITY_GUESTS_TEXT = ' гостей';
var CHECKIN_TEXT = 'Заезд после ';
var CHECKOUT_TEXT = ', выезд до ';
var PRICE_TEXT = '₽/ночь';

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var adverts = [];

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

var getRandomInteger = function (minValue, maxValue) {
  return Math.round(Math.random() * (maxValue - minValue)) + minValue;
};

var getRandomElement = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

var OfferType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var renderMapPin = function (mapPin) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.style =
    'left: ' + (mapPin.location.x - MAP_PIN_X_OFFSET) + 'px;top: ' +
    (mapPin.location.y - MAP_PIN_Y_OFFSET) + 'px;';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;

  return mapPinElement;
};

var renderFeatures = function (listFeatures) {
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < listFeatures.length; i++) {
    var listItemElement = document.createElement('li');
    listItemElement.classList.add('popup__feature');
    listItemElement.classList.add('popup__feature--' + listFeatures[i]);
    featuresFragment.appendChild(listItemElement);
  }

  return featuresFragment;
};

var renderPhotos = function (listPhotos) {
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < listPhotos.length; i++) {
    var photoElement = popupPhotoTemplate.cloneNode();
    photoElement.src = listPhotos[i];
    photosFragment.appendChild(photoElement);
  }

  return photosFragment;
};

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = mapCard.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = mapCard.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = mapCard.offer.price + PRICE_TEXT;
  mapCardElement.querySelector('.popup__type').textContent = OfferType[mapCard.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent =
    mapCard.offer.rooms + CAPACITY_ROOMS_TEXT +
    mapCard.offer.guests + CAPACITY_GUESTS_TEXT;
  mapCardElement.querySelector('.popup__text--time').textContent =
    CHECKIN_TEXT + mapCard.offer.checkin +
    CHECKOUT_TEXT + mapCard.offer.checkout;
  mapCardElement.querySelector('.popup__features').innerHTML = '';
  mapCardElement.querySelector('.popup__features').appendChild(renderFeatures(mapCard.offer.features));
  mapCardElement.querySelector('.popup__description').textContent = mapCard.offer.description;
  mapCardElement.querySelector('.popup__photos').innerHTML = '';
  mapCardElement.querySelector('.popup__photos').appendChild(renderPhotos(mapCard.offer.photos));
  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

var avatarIndexes = [];
for (var i = 1; i <= AVATARS_COUNT; i++) {
  if (i < 10) {
    avatarIndexes.push('0' + i);
    continue;
  }
  avatarIndexes.push('' + i);
}

avatarIndexes = shuffleArray(avatarIndexes);

var offerTitles = shuffleArray(OFFER_TITLES);

for (i = 0; i < ADVERTS_COUNT; i++) {
  var locationX = getRandomInteger(MIN_LOCATION_X, MAX_LOCATION_X);
  var locationY = getRandomInteger(MIN_LOCATION_Y, MAX_LOCATION_Y);
  var advert = {
    author: {
      avatar: AVATAR.FILE_PATH + avatarIndexes[i] + AVATAR.FILE_TYPE.PNG
    },

    offer: {
      title: offerTitles[i],
      address: locationX + ', ' + locationY,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: getRandomElement(OFFER_TYPES),
      rooms: getRandomInteger(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
      guests: getRandomInteger(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT),
      checkin: getRandomElement(CHECK_TIMES),
      checkout: getRandomElement(CHECK_TIMES),
      features: shuffleArray(FEATURES).slice(0, getRandomInteger(1, FEATURES.length - 1)),
      description: '',
      photos: shuffleArray(PHOTOS)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  adverts.push(advert);
}

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

var mapCardTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

var popupPhotoTemplate = document.querySelector('template')
    .content
    .querySelector('.popup__photo');

var mapPinsElement = document.querySelector('.map__pins');
var mapCardElement = document.querySelector('.map__filters-container');
var mapPinFragment = document.createDocumentFragment();

for (i = 0; i < adverts.length; i++) {
  mapPinFragment.appendChild(renderMapPin(adverts[i]));
}

mapPinsElement.appendChild(mapPinFragment);

var fragmentMapCard = document.createDocumentFragment();

fragmentMapCard.appendChild(renderMapCard(adverts[0]));
mapElement.insertBefore(fragmentMapCard, mapCardElement);
