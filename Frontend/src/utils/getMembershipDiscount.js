export const getActiveMembershipDiscount = (user) => {
  if (!user || !user.memberships || user.memberships.length === 0) return 0;

  const active = user.memberships.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );

  return active ? active.discountPercent : 0;
};
