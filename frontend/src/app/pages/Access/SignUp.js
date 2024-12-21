import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Để theo dõi bước hiện tại (1: bước 1, 2: bước 2)
  const navigate = useNavigate();

  const handleStep1Submit = () => {
    if (!email || !password || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin đăng ký!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu và nhập lại mật khẩu không trùng khớp!");
      return;
    }

    setStep(2); // Chuyển sang bước 2 sau khi nhập email và mật khẩu
  };

  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !gender || !dob) {
      alert("Vui lòng điền đầy đủ thông tin cá nhân!");
      return;
    }

    setIsLoading(true);
    try {
      // Giả lập đăng ký người dùng
      // Bạn có thể gọi API ở đây để đăng ký người dùng thực sự
      localStorage.setItem("user", email); // Chỉ ví dụ, có thể lưu ID người dùng sau khi đăng ký thành công
      navigate("/"); // Chuyển hướng về trang chính sau khi đăng ký
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ddd]">
      <div className="flex flex-col md:flex-row w-[100%] max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center bg-blue-200 relative">
          <div className="absolute inset-0 opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center">
            <img src="/logoimg.png" alt="Logo" className="h-32" />
            <img src="/logo2.png" alt="Logo" className="h-28 mb-4" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 relative">
          {" "}
          <XMarkIcon
            className="absolute right-4 top-4 h-6 hover:text-main cursor-pointer hover:bg-gray-100"
            onClick={() => {
              navigate("/");
            }}
          />
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                ĐĂNG KÝ
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Vui lòng nhập thông tin email và mật khẩu để tiếp tục!
              </p>
              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email:
                  </label>
                  <input
                    value={email}
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="example@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <input
                    value={password}
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <input
                    value={confirmPassword}
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    className="w-full bg-main text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
                    onClick={handleStep1Submit}
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Thông tin cá nhân
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Vui lòng nhập thông tin cá nhân để hoàn tất đăng ký!
              </p>
              <div className="space-y-6">
                {/* Full Name Input */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ tên:
                  </label>
                  <input
                    value={fullName}
                    type="text"
                    id="fullName"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nguyễn Văn A"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số điện thoại:
                  </label>
                  <input
                    value={phoneNumber}
                    type="text"
                    id="phoneNumber"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="0901234567"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giới tính:
                  </label>
                  <select
                    value={gender}
                    id="gender"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Date of Birth Input */}
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày sinh:
                  </label>
                  <input
                    value={dob}
                    type="date"
                    id="dob"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    className="w-full bg-main text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                  </button>
                </div>
              </div>
            </>
          )}
          {/* Đã có tài khoản? Đăng nhập */}
          <div className="mt-4 text-center">
            <p>
              Đã có tài khoản?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;