'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.validate = true;
options.tableName = 'Spots';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '4 Beverly Park',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 50.96235,
        lng: 49.26534,
        name: 'Richard Nixons Ex-Mansion',
        description: 'Previously owned by Richard Nixon himself, the seven-bedroom, 11-bathroom mansion also offers more traditional amenities for the Los Angeles area, including valley and mountain views, walls of windows that disappear to create an indoor-outdoor environment, a second-level wraparound deck with stairs and a full outdoor kitchen and dining area. Other highlights include two primary suites, a two-bedroom, two-bathroom guest apartment, a glass elevator and a 3,000-square-foot finished garage.',
        price: 10000.00
      },
      {
        ownerId: 1,
        address: '6 Coldwell Lane',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 100.96235,
        lng: 305.26534,
        name: 'Saudi Royal Family Mansion',
        description: 'The residence spans 28,500 square feet in Beverly Park, a celebrity-favored enclave that the likes of Denzel Washington and Adele have called home. The property, together with an adjacent 1.8-acre site, had belonged to the Saudi royal family since the mid-1990s, when they were first built. The open-concept layout features floor-to-ceiling windows that flood the home with natural light, a gourmet kitchen with top-of-the-line appliances, and a sleek master suite with a spa-inspired bathroom. The outdoor space is a true oasis, with an infinity pool, outdoor kitchen, and panoramic views of the city and ocean.',
        price: 11000.00
      },
      {
        ownerId: 2,
        address: '1000 Sunset Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 200.96235,
        lng: 75.26534,
        name: 'Breathtaking Sunset Boulevard Villa',
        description: 'Nestled in the heart of Beverly Hills, this opulent mansion exudes luxury and sophistication. Spanning over 10,000 square feet, it features grand architectural design with soaring ceilings, expansive windows, and exquisite finishes. The mansion boasts multiple living areas, a gourmet kitchen, a private home theater, a lavish master suite with a spa-like bathroom, and numerous guest suites. Outside, the beautifully landscaped grounds include a sparkling pool, a spacious patio for entertaining, and stunning views of the city and hills. This residence offers the ultimate in privacy and exclusivity, embodying the quintessential Beverly Hills lifestyle.',
        price: 20000.00
      },
      {
        ownerId: 2,
        address: '50 Beverly Park Way',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 37.96235,
        lng: 50.26534,
        name: 'Casino Mogul Steve Wynn Mansion',
        description: 'Mansion owned by world renowned casino mogul Steve Wynn. The sprawling 27,150-square-foot estate was originally built by Guess cofounder Maurice Marciano in the early 1990s.',
        price: 13000.00
      },
      {
        ownerId: 3,
        address: '1251 Tower Grove Drive',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 10.96235,
        lng: 30.26534,
        name: 'Secluded Mansion in the Heart of Beverly Hills',
        description: 'The mansion features an elegant marble foyer, multiple grand living spaces, a state-of-the-art chefs kitchen, and a lavish master suite with a private terrace. The outdoor area boasts meticulously landscaped gardens, a stunning pool, and a guest house, perfect for entertaining and relaxing in style.',
        price: 20000.00
      },
      {
        ownerId: 3,
        address: '1000 Louis Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 10.96235,
        lng: 30.26534,
        name: 'Mansion Passed Down By King Louis VI',
        description: 'Situated in the exclusive gated community of Beverly Park, this sprawling mansion epitomizes grandeur. It offers an impressive double-height entry, a luxurious formal dining room, a spacious family room, and an opulent master suite with dual bathrooms and closets. The expansive grounds include a resort-style pool, tennis court, and numerous outdoor lounging areas, providing a serene escape from the hustle and bustle of city life.',
        price: 14000.00
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.truncate = true;
    options.cascade = true;
    options.restartIdentity = true;

    await queryInterface.bulkDelete(options, null, {})

  }
};
