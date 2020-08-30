import jwt from 'jsonwebtoken';

function sign(iss, subject, secret) {
  return jwt.sign({ iss, subject }, secret);
}

export default { sign };
