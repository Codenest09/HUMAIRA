/* placeholder.js — generates beautiful default placeholders for photo slots */
(function() {
  'use strict';

  // Available uploaded photos
  window.HUMAIRA_PHOTOS = [
    '1.jpeg',
    '2.jpeg',
    '3.jpeg',
    '4.jpeg',
    '5.jpeg',
    '6.jpeg',
    '7.jpeg',
    '8.jpeg',
    '9.jpeg',
    '10.jpeg',
    '11.jpeg',
    '12.jpeg'
  ];

  // Default slot assignments (5 main slots + 1 favourite)
  window.SLOT_ASSIGNMENTS = {
    1: '1.jpeg',
    2: '2.jpeg',
    3: '3.jpeg',
    4: '4.jpeg',
    5: '5.jpeg',
    favourite: '6.jpeg'
  };

  // Extra photos for memory wall and collage (used beyond the 5 slots)
  window.EXTRA_PHOTOS = [
    '7.jpeg',
    '8.jpeg',
    '9.jpeg',
    '10.jpeg',
    '11.jpeg',
    '12.jpeg'
  ];

})();
