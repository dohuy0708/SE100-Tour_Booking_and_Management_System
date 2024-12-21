import React, { useEffect, useState } from "react";
import MyProfile from "./Partials/MyProfile";
import MyBookings from "./Partials/MyBookings";
import ChangePassword from "./Partials/ChangePassword";
import ProfileTab from "./Partials/ProfileTab";
import { getUserInfo } from "../../Services/userService";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = localStorage.getItem("user");
    const fetchUserData = async () => {
      try {
        const data = await getUserInfo(id);
        setUserData(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <MyProfile userData={userData} />;
      case "bookings":
        return <MyBookings />;
      case "changePassword":
        return <ChangePassword />;
      default:
        return <MyProfile userData={userData} />;
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="mx-auto max-w-7xl p-4 flex ">
        {/* Sidebar */}
        <ProfileTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}