// src/components/isAdminUser.js

export const isAdminUser = (user) => {
  if (!user) return false;

  return (
    user.email === "admin@pronearby.com" &&
    user.emailVerified === true
  );
};
