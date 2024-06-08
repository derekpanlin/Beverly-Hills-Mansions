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
        price: 2000.00
      },
      {
        ownerId: 1,
        address: '6 Coldwell Lane',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 100.96235,
        lng: 305.26534,
        name: 'Luxury Villa With Gorgeous Pool',
        description: 'The residence spans 28,500 square feet in Beverly Park, a celebrity-favored enclave that the likes of Denzel Washington and Adele have called home. The property, together with an adjacent 1.8-acre site, had belonged to the Saudi royal family since the mid-1990s, when they were first built. The open-concept layout features floor-to-ceiling windows that flood the home with natural light, a gourmet kitchen with top-of-the-line appliances, and a sleek master suite with a spa-inspired bathroom. The outdoor space is a true oasis, with an infinity pool, outdoor kitchen, and panoramic views of the city and ocean.',
        price: 2100.00
      },
      {
        ownerId: 2,
        address: '1000 Sunset Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 200.96235,
        lng: 75.26534,
        name: 'Castle With Views of Hollywood',
        description: 'Perched slightly uphill from the bustling nightlife, this castle overlooks the glamour of Tinseltown, offering stunning vistas of Hollywood city and its iconic hills. With six ensuite bedrooms and a seventh sleeping area nestled inside the turret of a tower, guests can enjoy comfortable accommodation. Take advantage of the rooftop Jacuzzi and lounge area, providing a perfect spot to unwind while soaking in the spectacular views. Please note, parties and DJ equipment are not permitted, and street cameras are in place. While the castle, which boasts a century of history, undergoes exterior restoration, no workers will be present during your stay.',
        price: 3000.00
      },
      {
        ownerId: 2,
        address: '50 Beverly Park Way',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 37.96235,
        lng: 50.26534,
        name: 'Japanese Inspired Home With Scintillating Views',
        description: 'Welcome to L.A.! Nestled above the Sunset Strip behind a gated driveway, this romantically private contemporary Japanese-style house boasts unparalleled panoramic views from downtown to the ocean. At the bottom of a dramatic metal staircase is an ultra-chic living room with glass walls that open to a sleek infinity pool and a sunken fire pit. Inside, you will find a spacious master bedroom complete with a Japanese Tatami, a suspended orb fireplace, and breathtaking views overlooking the infinity pool and sprawling cityscape. The master suite features a walk-in shower, a huge bathtub, a steam shower, and heated floors. The gourmet chefs kitchen is perfect for entertaining, with its open floor plan, stainless steel appliances, and built-in wine cooler.',
        price: 1300.00
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
        price: 4000.00
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
        price: 1500.00
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
