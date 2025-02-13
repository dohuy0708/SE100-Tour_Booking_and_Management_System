import React, { useEffect, useState } from "react";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { getBookingData } from "./services/BookingService";
import BookingModal from "./partial/BookingModal.js";
import BookingItemComponent from "./partial/BookingItemComponent.js";
import {
  FilterProvider,
  useFilterContext,
} from "../../context/FilterContext.js";
import { TourProvider } from "../../context/TourContext.js";
import { getBookingStatus } from "../../services/BookingstatusService.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError, notifySuccess } from "../../components/Notification";
// Trang Booking
export default function BookingPage() {
  const [bookingList, setBookingList] = useState([]);
  const [filteredBookingList, setFilteredBookingList] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { tourData } = useFilterContext(); // Lấy dữ liệu từ context
  const [isLoading, setIsLoading] = useState(false);
  const statuses = [
    { id: 1, name: "CHỜ XÁC NHẬN" },
    { id: 2, name: "ĐÃ XÁC NHẬN" },
    { id: 3, name: "ĐÃ HỦY" },
  ];
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(8);
  const fetchData = async () => {
    try {
      //lấy data từ server
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const bookings = await response.json();
      // Map thứ tự ưu tiên
      const priority = {
        "CHỜ XÁC NHẬN": 1,
        "ĐÃ XÁC NHẬN": 2,
        "ĐÃ HỦY": 3,
      };

      // Sắp xếp bookings dựa trên thứ tự ưu tiên
      const sortedBookings = bookings.sort((a, b) => {
        return priority[a.status] - priority[b.status];
      });

      setBookingList(sortedBookings);
      setFilteredBookingList(sortedBookings); // Nếu danh sách lọc cần sắp xếp
      setBookingStatuses(statuses);
      console.log("Bookings", bookings);
    } catch (error) {
      notifyError("Lỗi khi lấy dữ liệu từ server!");
    } finally {
      setIsLoading(false);
    }
  };
  // Dữ liệu status cho trang Booking
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterApply = async (filters) => {
    // Áp dụng lọc và phân trang
    console.log("filter:", filters);

    let filteredList = bookingList;

    // Lọc theo trạng thái
    if (filters.status !== "") {
      filteredList = filteredList.filter((booking) => {
        return booking.status === filters.status;
      });
    }

    // Lọc theo ngày
    if (filters.date !== "") {
      filteredList = filteredList.filter((booking) => {
        // So sánh ngày, cần đảm bảo cả hai đều có cùng định dạng
        const bookingDate = new Date(booking.booking_date)
          .toISOString()
          .split("T")[0]; // Chỉ lấy phần ngày (YYYY-MM-DD)
        const filterDate = new Date(filters.date).toISOString().split("T")[0]; // Định dạng ngày của bộ lọc
        return bookingDate === filterDate;
      });
    }
    // Lọc theo location
    if (filters.location !== "") {
      filteredList = filteredList.filter((booking) => {
        return booking.locations.some(
          (loc) => loc.location_name === filters.location
        );
      });
    }

    setFilteredBookingList(filteredList);
  };

  const handleReset = () => {
    setFilteredBookingList(bookingList);
  };
  // Tính toán số trang dựa trên tổng số booking
  const totalPages = Math.ceil(filteredBookingList.length / recordsPerPage);

  // Chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-mincontent py-6">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        <span className="ml-4 text-lg text-gray-700">Đang tải...</span>
      </div>
    );
  }
  return (
    <FilterProvider>
      <div className="p-0 bg-gray-100">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-gray-700 mb-4">ĐƠN ĐẶT</h1>
        <div className="flex items-center justify-between mb-4">
          <FilterComponent
            onFilterApply={handleFilterApply}
            onReset={handleReset}
            status={bookingStatuses} // Truyền status xuống FilterComponent
          />

          {/* Nút Thêm */}
          <button
            onClick={() => setIsModalOpen(true)} // Open modal
            className="ml-4 px-4 py-2 flex bg-blue-500 gap-2 text-white rounded shadow hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            THÊM MỚI
          </button>

          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            refreshData={fetchData}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {filteredBookingList.length > 0 ? (
            filteredBookingList
              .slice(
                (currentPage - 1) * recordsPerPage,
                currentPage * recordsPerPage
              )
              .map((booking) => (
                <BookingItemComponent
                  key={booking.bookingId}
                  booking={booking}
                  refreshData={fetchData}
                />
              ))
          ) : (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <nav aria-label="Page navigation">
            <ul className="inline-flex items-center">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-l-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m15 6l-6 6l6 6"
                    />
                  </svg>
                </button>
              </li>
              {/* Hiển thị các nút phân trang */}
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 border border-gray-300 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-r-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m9 6l6 6l-6 6"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </FilterProvider>
  );
}
