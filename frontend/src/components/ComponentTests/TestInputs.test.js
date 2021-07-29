const checkForNull = require('./checkForNull.js');

test('true input gives true bool', () => {
    expect(checkForNull("new event", "2021-07-29T20:00", "2021-07-30T20:00", "4649 NW 99 Ter, Coral Springs, FL, USA", "hello world!", 10)).toBe(true);
});
  
test('null input gives false bool', () => {
    expect(checkForNull("new event", null, "2021-07-30T20:00", "4649 NW 99 Ter, Coral Springs, FL, USA", "hello world!", 10)).toBe(false);
});

test('no length input gives false bool', () => {
    expect(checkForNull("new event", "", "2021-07-30T20:00", "4649 NW 99 Ter, Coral Springs, FL, USA", "hello world!", 10)).toBe(false);
});