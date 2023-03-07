export const stringToByte = (str: any) => {
  const result = str?.map((item) => {
    return item?.charCodeAt(0);
  });
  return result;
};
