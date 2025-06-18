// utils/renderStars.js
const renderStars = (rating) => {
  const full = Math.round(rating); // округление до целого
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

export default renderStars;
