import { bannerTours, tourInfo, toursData } from "../mock/mockHome";
const getBannerTours = () => {
  return bannerTours;
  //   return axios.get(`/api/tour`, {});
};

const getNewTours = () => {
  return toursData;
  //  return axios.get(`/api/tour`, {});
};
const getDomestricTours = () => {
  return toursData;
  //  return axios.get(`/api/tour`, {});
};
const getAbroadTours = () => {
  return toursData;
  //  return axios.get(`/api/tour`, {});
};
const getTourInfo = (id) => {
  return tourInfo;
  // return axios.get(`/api/tour?id=${id}`, { id: id });
};

export {
  getBannerTours,
  getNewTours,
  getDomestricTours,
  getAbroadTours,
  getTourInfo,
};
