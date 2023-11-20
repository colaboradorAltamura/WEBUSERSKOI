function selectFormValuesHandler({ itemValues, form }) {
  const keys = Object.keys(itemValues);
  keys.forEach((key) => {
    // todos los selects que tengan un valor les modifico el valor a un array de strings con el valor seleccionado
    // de [{label: 'ej lbl', value: 'abracadabra'}, ///] a ['abracadabra']
    // dos posibilidades, si es un multiselect entonces viene un array, caso contrario viene un elemento solo sin array..
    if (itemValues[key] && form.formFields[key]) {
      if (
        form.formFields[key].fieldType === 'select' ||
        form.formFields[key].fieldType === 'entity-searchable-select'
      ) {
        if (Array.isArray(itemValues[key])) {
          if (itemValues[key].length) {
            itemValues[key] = itemValues[key][0].value;
          } else {
            itemValues[key] = null;
          }
        } else {
          itemValues[key] = itemValues[key].value;
        }
      } else if (
        form.formFields[key].fieldType === 'multi-select' ||
        form.formFields[key].fieldType === 'entity-searchable-multi-select'
      ) {
        if (Array.isArray(itemValues[key])) {
          itemValues[key] = itemValues[key].map((item) => {
            return item.value;
          });
        } else {
          itemValues[key] = [itemValues[key].value];
        }
      }
    }
  });

  return itemValues;
}

export default selectFormValuesHandler;
