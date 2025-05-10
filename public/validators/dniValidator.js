let dniValidator = (dni) => {
  let dniRegex = /^[0-9]{8}[A-Z]{1}$/;
  return dniRegex.test(dni);
};
export default dniValidator;
