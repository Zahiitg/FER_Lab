export default function Home() {
  return (
    // Thẻ div bọc ngoài cùng, chiếm toàn màn hình, màu nền xám nhạt, canh giữa nội dung
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      {/* Khung chứa form đăng nhập */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h1>

        <form className="space-y-4">
          {/* Trường nhập Email / Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email hoặc Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trường nhập Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="button" // Type là button để không reload trang (vì lab không yêu cầu logic)
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
          >
            Đăng nhập
          </button>
        </form>

      </div>
    </main>
  );
}
