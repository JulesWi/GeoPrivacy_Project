module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ou 'node' si les tests n'impliquent pas de DOM
  transform: {
    '^.+\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
