
// export const formdataify = (params) => {
//     const formData = new FormData();
//     Object.keys(params).forEach(key => {
//         if (typeof params[key] == "string") {
//             formData.append(key, params[key]);
//         } else {
//             formData.append(key, JSON.stringify(params[key]));
//         }
//     });
//     return formData;
// };

export function formdataify(data) {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      formData.append(key, value);
    }
  }
  return formData;
}
