export const isRequiredField = (validationSchemas, name) => {
  if (Array.isArray(validationSchemas)) {
    const schema = validationSchemas.find((s) => s.fields[name]);

    return schema?.fields[name].exclusiveTests?.required || false;
  }

  return validationSchemas?.fields[name]?.exclusiveTests?.required || false;
};
