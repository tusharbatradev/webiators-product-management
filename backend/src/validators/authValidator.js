const validateSignup = ({ username, password }) => {
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return 'Username is required';
  }
  if (username.trim().length < 3 || username.trim().length > 30) {
    return 'Username must be between 3 and 30 characters';
  }
  if (!password || typeof password !== 'string' || password === '') {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

const validateLogin = ({ username, password }) => {
  if (!username || username.trim() === '') return 'Username is required';
  if (!password || password === '') return 'Password is required';
  return null;
};

module.exports = { validateSignup, validateLogin };
