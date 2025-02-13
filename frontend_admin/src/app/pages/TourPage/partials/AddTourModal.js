import React, { useEffect, useState } from "react";
import { useFilterContext } from "../../../context/FilterContext";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../../components/Notification";

export default function AddTourModal({ isOpen, onClose, refreshData }) {
  const { locations } = useFilterContext(); // Lấy dữ liệu từ context
  const [tourData, setTourData] = useState({
    tourId: "",
    tourName: "",
    tourType: "",
    description: "",
    duration: "",
    image: null,
  });
  const [Chooselocation, setLocations] = useState([]);

  const [numDays, setNumDays] = useState(1);
  const [days, setDays] = useState([{ image: "", imageDesc: "", dayDesc: "" }]);
  const [prices, setPrices] = useState({
    adultPrice: "",
    childPrice: "",
    infantPrice: "",
  });
  const handleNumDaysChange = (e) => {
    const value = parseInt(e.target.value, 10); // Get the new number of days
    setNumDays(value); // Update the numDays state

    const newDays = [...days]; // Copy the current days array

    if (value > days.length) {
      // If the new number of days is greater, add empty day objects
      while (newDays.length < value) {
        newDays.push({ image: null, imageDesc: "", dayDesc: "" });
      }
    } else {
      // If the new number of days is smaller, remove extra days
      newDays.length = value;
    }

    setDays(newDays); // Update the days state with the new array
  };
  const handleProgramInputChange = (index, field, value) => {
    const newDays = [...days]; // Copy the current days array
    newDays[index][field] = value; // Update the specific field for the given day
    setDays(newDays); // Update the days state with the new array
  };
  const handlePriceChange = (type, value) => {
    setPrices((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  const handleAddLocation = () => {
    setLocations([...Chooselocation, ""]); // Thêm một địa điểm mới với giá trị rỗng
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: value });
  };
  const handleLocationChange = (index, value) => {
    const updatedLocations = [...Chooselocation];
    updatedLocations[index] = value;
    setLocations(updatedLocations);
  };
  const handleRemoveLocation = (index) => {
    const updatedLocations = Chooselocation.filter((_, i) => i !== index);
    setLocations(updatedLocations);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setTourData({ ...tourData, image: file });
  };

  // Validation function
  const validateForm = () => {
    // Check if all required fields are filled
    const isTourDataValid =
      tourData.tourId &&
      tourData.tourName &&
      tourData.tourType &&
      tourData.description &&
      tourData.duration &&
      tourData.image;

    const isPricesValid =
      prices.adultPrice && prices.childPrice && prices.infantPrice;

    const isLocationsValid =
      Chooselocation.length > 0 && Chooselocation.every((location) => location);

    const isDaysValid = days.every(
      (day) => day.image && day.imageDesc && day.dayDesc
    );

    return isTourDataValid && isPricesValid && isLocationsValid && isDaysValid;
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();

      // Thêm thông tin tour
      formData.append("name", tourData.tourName);
      formData.append("code", tourData.tourId);
      formData.append("type", tourData.tourType);
      formData.append("dura", tourData.duration);
      formData.append("descri", tourData.description);
      formData.append("cover_image", tourData.image);

      // Thêm giá vé
      formData.append("prices[adult_price]", prices.adultPrice);
      formData.append("prices[children_price]", prices.childPrice);
      formData.append("prices[infant_price]", prices.infantPrice);

      // Thêm địa điểm
      Chooselocation.forEach((location, index) => {
        formData.append(`locations[${index}][location]`, location);
      });

      // Thêm chương trình tour
      days.forEach((day, index) => {
        formData.append(`programs[${index}][day_number]`, index + 1);
        formData.append(`programs[${index}][program_description]`, day.dayDesc);

        if (day.image) {
          console.log("programimage", day.image);
          // formData.append("programs_images", day.image);
        } else {
          console.warn(`Image for day ${index + 1} is missing.`);
        }
      });

      try {
        const response = await fetch("http://localhost:8080/tours", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Reset tất cả các state
          setTourData({
            tourId: "",
            tourName: "",
            tourType: "",
            description: "",
            duration: "",
            image: null,
          });

          setLocations([]);
          setNumDays(1);
          setDays([{ image: "", imageDesc: "", dayDesc: "" }]);
          setPrices({
            adultPrice: "",
            childPrice: "",
            infantPrice: "",
          });
          Swal.fire({
            icon: "success",
            title: "Thêm tour thành công",

            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            refreshData();
            onClose();
          });
        } else {
          notifyError("Thêm tour thất bại");
        }
      } catch (error) {
        console.error("Error submitting tour:", error);
        notifyError("Đã có lỗi xảy ra, vui lòng thử lại");
      }
    } else {
      notifyError("Vui lòng nhập đủ thông tin ");
    }
  };

  useEffect(() => {
    // Disable "Thêm" button based on validation
    const isValid = validateForm();
  }, [tourData, Chooselocation, days, prices]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center pt-8 place-items-start z-50">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-4/5 p-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b mb-4">
          <h1 className="text-2xl font-semibold">THÊM TOUR</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-auto flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Tour Info */}
          <div className="mb-4">
            <h4 className="text-xl text-blue-500 font-semibold mb-2">
              Thông tin tour
            </h4>
            <div className="flex border border-gray-300 rounded-lg p-2 bg-slate-50 gap-4">
              {/* Content */}
              <div className="overflow-auto flex-1">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {/* Image Upload */}
                  <div className="col-span-2">
                    <h4 className="font-semibold mb-2">Ảnh:</h4>
                    <div className="border border-gray-300 rounded-lg p-2 bg-slate-50">
                      {tourData.image ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(tourData.image)}
                            alt="Tour Preview"
                            className="w-full h-40 object-cover rounded"
                          />
                          <button
                            onClick={() =>
                              setTourData({ ...tourData, image: null })
                            }
                            className="absolute top-2 right-2  bg-gray-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center">Chưa có ảnh</p>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 w-full text-sm"
                      />
                    </div>
                  </div>

                  {/* Tour Information */}
                  <div className="col-span-5">
                    <div className="flex flex-col gap-4">
                      {/* Row 1: Mã tour, Loại tour, Thời gian */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block font-medium">Mã tour:</label>
                          <input
                            type="text"
                            name="tourId"
                            placeholder="MT001"
                            value={tourData.tourId}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div>
                          <label className="block font-medium">
                            Thời gian:
                          </label>
                          <input
                            type="text"
                            name="duration"
                            placeholder="3N2Đ"
                            value={tourData.duration}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block font-medium">
                            Loại tour:
                          </label>
                          <select
                            name="tourType"
                            value={tourData.tourType}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          >
                            {!tourData.tourType && (
                              <option value="" disabled hidden>
                                Chọn loại tour
                              </option>
                            )}
                            <option value="TRONG NƯỚC">TRONG NƯỚC</option>
                            <option value="QUỐC TẾ">QUỐC TẾ</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Tên tour */}
                      <div>
                        <label className="block font-medium">Tên tour:</label>
                        <input
                          type="text"
                          name="tourName"
                          value={tourData.tourName}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      {/* Description */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Mô tả:</h4>
                        <textarea
                          name="description"
                          value={tourData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-2 border rounded"
                          placeholder="Nhập mô tả..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Địa điểm và Giá */}
          <div className="grid grid-cols-2 gap-4 rounded-lg">
            {/* Địa điểm */}
            <div className="mb-4">
              <h4 className="font-semibold text-xl text-blue-500 mb-2">
                Thông tin địa điểm
              </h4>
              <div className="flex flex-col border border-gray-300 rounded-lg p-4 bg-slate-50 gap-4 overflow-y-auto max-h-48">
                {" "}
                {/* Set max height with scroll */}
                {/* Danh sách địa điểm */}
                {Chooselocation.map((location, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={location}
                      onChange={(e) =>
                        handleLocationChange(index, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    >
                      {!location && (
                        <option value="" disabled hidden>
                          Chọn địa điểm
                        </option>
                      )}
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.location_name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveLocation(index)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                {/* Nút thêm địa điểm */}
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                  onClick={handleAddLocation}
                >
                  Thêm địa điểm
                </button>
              </div>
            </div>

            {/* Giá vé */}
            <div className="mb-4">
              <h4 className="font-semibold text-blue-500 text-xl mb-2">
                Thông tin giá tour
              </h4>
              <div className="border border-gray-300 rounded-lg p-2 bg-slate-50">
                <div className="flex flex-col gap-6">
                  {" "}
                  {/* Increased gap between price sections */}
                  <div className="flex items-center gap-4">
                    <label className="w-20  font-medium">Người lớn:</label>
                    <div className="flex items-center gap-2 w-2/3">
                      <input
                        type="number"
                        name="adultPrice"
                        value={prices.adultPrice}
                        onChange={(e) =>
                          handlePriceChange("adultPrice", e.target.value)
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder="Nhập giá"
                        min="0"
                      />
                      <span className="text-yellow-500 font-medium">VND</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20  font-medium">Trẻ em:</label>
                    <div className="flex items-center gap-2 w-2/3">
                      <input
                        type="number"
                        name="childPrice"
                        value={prices.childPrice}
                        onChange={(e) =>
                          handlePriceChange("childPrice", e.target.value)
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder="Nhập giá"
                        min="0"
                      />
                      <span className="text-yellow-500 font-medium">VND</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-20 font-medium">Em bé:</label>
                    <div className="flex items-center gap-2 w-2/3">
                      <input
                        type="number"
                        name="infantPrice"
                        value={prices.infantPrice}
                        onChange={(e) =>
                          handlePriceChange("infantPrice", e.target.value)
                        }
                        className="flex-1 p-2 border rounded"
                        placeholder="Nhập giá"
                        min="0"
                      />
                      <span className="text-yellow-500 font-medium">VND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chương trình tour */}
          <div className="mb-4">
            <h4 className="font-semibold text-blue-500 text-xl">
              Chương trình tour
            </h4>
            <div className="border border-gray-300 rounded-lg p-2    bg-slate-50">
              {/* Input for number of days */}
              <div className="mb-4 flex gap-4 items-center">
                <label className="block font-medium text-lg items-center ">
                  Số lượng ngày:
                </label>
                <input
                  type="number"
                  value={numDays}
                  onChange={handleNumDaysChange}
                  className="p-2 border rounded  "
                  min="1"
                />
              </div>

              {/* Day descriptions */}
              {days.map((day, index) => (
                <div className="border border-gray-300 rounded-lg p-2 mb-4 bg-slate-50">
                  <div key={index} className="mb-4  gap-4">
                    <h5 className="font-semibold">Ngày {index + 1}</h5>
                    <div className="flex flex-row  gap-4">
                      <div className="flex flex-col  w-1/2">
                        {/* Image and image description */}
                        <label className="font-medium">Ảnh:</label>
                        <div className="border border-gray-300 rounded-lg p-2 bg-slate-50">
                          {day.image ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(day.image)} // Preview the selected image
                                alt={`Ảnh ngày ${index + 1}`}
                                className="w-full h-40 object-cover rounded"
                              />
                              <button
                                onClick={() =>
                                  handleProgramInputChange(index, "image", null)
                                } // Remove the image
                                className="absolute top-2 right-2 bg-gray-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center">
                              Chưa có ảnh
                            </p>
                          )}
                          <input
                            type="file"
                            accept="image/*" // Only allow images
                            onChange={(e) =>
                              handleProgramInputChange(
                                index,
                                "image",
                                e.target.files[0]
                              )
                            } // Update state with selected image
                            className="mt-2 w-full text-sm"
                          />
                        </div>

                        <label className="font-medium">Mô tả ảnh:</label>
                        <input
                          type="text"
                          value={day.imageDesc}
                          onChange={(e) =>
                            handleProgramInputChange(
                              index,
                              "imageDesc",
                              e.target.value
                            )
                          }
                          placeholder="Mô tả ảnh"
                          className="p-2 border rounded"
                        />
                      </div>

                      <div className="flex flex-col w-5/6 ">
                        {/* Day description */}
                        <label className="font-medium">
                          Chương trình ngày {index + 1}:
                        </label>
                        <textarea
                          value={day.dayDesc}
                          onChange={(e) =>
                            handleProgramInputChange(
                              index,
                              "dayDesc",
                              e.target.value
                            )
                          }
                          placeholder="Mô tả ngày"
                          rows={5}
                          className="p-2 border rounded h-72 "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded-md"
          >
            Hủy
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
