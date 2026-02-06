const generateEmailAndPassword = (name) => {
  const cleanName = name.replace(/\s+/g, "").toLowerCase();

  const first4 = cleanName.substring(0, 4).padEnd(4, "x");

  const email = `${first4}@wingman.com`;

  const last4Digits = Date.now().toString().slice(-4);
  const password = `${first4}${last4Digits}`;

  return { email, password };
};

module.exports = generateEmailAndPassword;