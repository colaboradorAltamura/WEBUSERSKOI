function mergeSchemas(...schemas) {
  const [first, ...rest] = schemas;

  const merged = rest.reduce((mergedSchemas, schema) => mergedSchemas.concat(schema), first);

  return merged;
}

export default mergeSchemas;
