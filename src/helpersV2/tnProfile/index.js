export const sortProfExperience = (experience) => {
  let nextExp = [...experience];

  const currentExpIdx = experience.findIndex(
    (el) => !el.end_year || !el.end_month
  );

  if (currentExpIdx >= 0) {
    let firstEl = nextExp.splice(currentExpIdx, 1);
    nextExp = [...firstEl, ...nextExp];
  }

  return nextExp;
};
