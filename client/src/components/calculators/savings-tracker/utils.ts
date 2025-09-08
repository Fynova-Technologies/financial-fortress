export const getContributionLabel = (t: string) => {
  switch (t) {
    case "daily": return "Daily";
    case "monthly": return "Monthly";
    case "quarterly": return "Quarterly";
    case "annually": return "Annual";
    default: return "Monthly";
  }
};
