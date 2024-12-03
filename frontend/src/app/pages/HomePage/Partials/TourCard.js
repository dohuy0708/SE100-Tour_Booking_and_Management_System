import React from "react";

function TourCard({ tour }) {
  const { title, startTime, duration, price, seatsLeft, image } = tour;

  return (
    <div className="bg-white rounded shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="font-semibold mt-2">
          <p className="text-lg">
            Bắt đầu: <span className=" text-red">{startTime}</span>
          </p>
          <div className="flex ">
            <p className="text-lg mr-4">
              Thời gian: <span className=" text-red">{duration}</span>
            </p>
            <p className="text-lg">
              Còn chỗ: <span className=" text-red">{seatsLeft}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="font-semibold">
            <p className="  text-lg">Giá từ:</p>

            <span className="text-red  text-2xl">{price} đ</span>
          </div>
          <button className="px-4 py-2 font-semibold bg-red text-white rounded-lg ">
            Đặt chỗ
          </button>
        </div>
      </div>
    </div>
  );
}

export default TourCard;