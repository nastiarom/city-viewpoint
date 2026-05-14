export default function getSeasonClass(season) {
  switch (season.toLowerCase()) {
    case 'весна':
    case 'spring':
      return 'season-spring';
    case 'лето':
    case 'summer':
      return 'season-summer';
    case 'осень':
    case 'autumn':
    case 'fall':
      return 'season-autumn';
    case 'зима':
    case 'winter':
      return 'season-winter';
    default:
      return '';
  }
}