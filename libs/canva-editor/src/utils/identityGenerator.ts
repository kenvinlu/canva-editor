const prefix = 'ca_'; // Prefix
const generateRandomID = (length = 10) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;

  for (let i = prefix.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const isEditorID = (candidate: string, length = 10) => {
  return candidate.startsWith(prefix) && candidate.length === length;
};

export { generateRandomID, isEditorID };
