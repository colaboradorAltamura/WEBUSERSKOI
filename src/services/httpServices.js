/* eslint-disable @typescript-eslint/no-unused-vars */
exports.getHttpBearerConfig = function (token) {
  let config = {};
  if (token)
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
        'App-Version': 1,
      },
    };
  else
    config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
        'App-Version': 1,
      },
    };

  return config;
};

exports.getHttpBearerFormDataConfig = function (token) {
  let config = {};
  if (token)
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data; boundary=XXX',

        // Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
        'App-Version': 1,
      },
    };
  else
    config = {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=XXX',

        // Accept: `application/vnd.iman.v1+json, application/json, text/plain, */*`,
        'App-Version': 1,
      },
    };

  return config;
};

exports.listArgsToQueryString = function (args) {
  let filters = null;
  let limit = 1000;
  let offset = 0;

  if (args) filters = args.filters;
  if (args && args.limit) limit = args.limit;
  if (args && args.offset) offset = args.offset;

  let qs = `?offset=${offset}`;

  if (limit) qs += `&limit=${limit}`;

  if (filters && filters.length) {
    filters.forEach((element) => {
      qs += `&filters[${element.key}][${element.operator}]=${element.value}`;
    });
  } else if (filters) {
    Object.keys(filters).forEach((key) => {
      const element = filters[key]; // {"filters[investmentState][$in]":"OPEN"}

      const operator = Object.keys(element)[0];

      const value = element[operator];

      qs += `&filters[${key}][${operator}]=${value}`;
    });
  }

  return qs;
};

exports.listArgsToParams = function (args) {
  if (!args || !args.params || !args.params.length) return '';

  let params = '';

  args.params.forEach((param) => {
    params += `/${param}`;
  });

  return params;
};
