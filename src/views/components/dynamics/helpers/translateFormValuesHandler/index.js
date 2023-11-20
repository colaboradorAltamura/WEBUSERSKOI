import { createNestedObject } from 'src/@core/coreHelper';

function translateFormValuesHandler({ itemValues, form }) {
  const keys = Object.keys(itemValues);
  keys.forEach((key) => {
    // transfiero los valores al campo correspondiente siguiendo la jerarquía informada en targetFields
    if (form.formFields[key] && form.formFields[key].targetFields) {
      const val = itemValues[key];

      // empty obj validation
      if (
        val && // 👈 null and undefined check
        Object.keys(val).length === 0 &&
        Object.getPrototypeOf(val) === Object.prototype
      )
        return;

      createNestedObject(itemValues, form.formFields[key].targetFields, val);
    }
  });

  return itemValues;
}

export default translateFormValuesHandler;
