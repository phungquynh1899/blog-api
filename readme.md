# Blog API Project

Dự án blog cá nhân sử dụng MERN Stack (MongoDB, Express.js, React, Node.js)

## Tính năng chính

- Đăng ký, đăng nhập người dùng
- Quản lý bài viết (thêm, sửa, xóa)
- Upload hình ảnh với Cloudinary
- Tương tác (like, comment)
- Theo dõi người dùng khác
- Phân quyền Admin

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- Cloudinary

### Frontend
- React
- Bootstrap
- Axios

## Cài đặt và Chạy dự án

Chi tiết hướng dẫn cài đặt và chạy dự án có trong file [HUONG_DAN_CHAY_DU_AN.txt](./HUONG_DAN_CHAY_DU_AN.txt)

## Tác giả

- Nguyễn Trương Phụng Quỳnh

# blog-api
# Tài liệu hướng dẫn sử dụng 

## Công nghệ

**Server:** Node, Express, MongoDB, JWT


## Các tính năng

- **Xác thực người dùng**: Yêu cầu đăng nhập để tạo, cập nhật và xóa tài khoản.
- **Quản lý bài viết**: Người dùng có thể tạo, cập nhật và xoá bài viết.
- **Quản lý bình luận**: Người dùng có thể thêm, sửa, xóa bình luận trên bài viết.
- **Quản lý danh mục**: Quản trị viên có thể thêm, sửa, xóa danh mục.
- **Bảo mật**: Sử dụng middleware xác thực người dùng trước khi thực hiện các thao tác quan trọng.

## Khởi Chạy Dự Án Cục Bộ

### Clone dự án

```sh
git clone https://github.com/phungquynh1899/blog-api
```

### Truy cập thư mục dự án

```sh
cd my-project
```

### Cài đặt các dependencies

```sh
npm install
```

### Khởi chạy server

```sh
npm run server.js
```

## Biến Môi Trường và Xác Thực API

Một số endpoint yêu cầu xác thực. Ví dụ: để tạo, cập nhật hoặc xóa bài viết, bạn cần đăng ký tài khoản và lấy token truy cập.

Các endpoint yêu cầu xác thực sẽ cần một bearer token được gửi trong tiêu đề `Authorization`.

Ví dụ:

```
Authorization: Bearer YOUR_TOKEN
```

## DANH SÁCH ENDPOINTS
### Người dùng
- [Đăng ký tài khoản](/api/v1/users/register)
- [Đăng nhập](/api/v1/users/login)
- [Đăng xuất](/api/v1/users/logout)
- [Refresh token](/api/v1/users/refreshToken)
- [Xem hồ sơ người dùng](/api/v1/users/viewers/:id)
- [Theo dõi người dùng](/api/v1/users/following/:id)
- [Bỏ theo dõi người dùng](/api/v1/users/unfollowing/:id)
- [Cập nhật mật khẩu](/api/v1/users/update-password)
- [Cập nhật hồ sơ](/api/v1/users/profileUpload)
- [Chặn người dùng](/api/v1/users/blocking/:id)
- [Bỏ chặn người dùng](/api/v1/users/unblocking/:id)
- [Quản trị viên chặn người dùng](/api/v1/admin/block/:id)
- [Quản trị viên bỏ chặn người dùng](/api/v1/admin/unblock/:id)
- [Xóa tài khoản](/api/v1/users/delete)


### Bài viết

- [Tạo bài viết](/api/v1/posts/create)
- [Lấy danh sách bài viết](/api/v1/posts/fetchAllPosts)
- [Lấy chi tiết bài viết](/api/v1/posts/:id)
- [Thích bài viết](/api/v1/posts/like/:id)
- [Bỏ thích bài viết](/api/v1/posts/dislike/:id)
- [Cập nhật bài viết](/api/v1/posts/update/:id)
- [Xem ngày cuối cùng người dùng tạo bài viết ](/api/v1/posts/lastDateUserCreatedPost)
- [Xóa bài viết](/api/v1/posts/delete/:id)

### Bình luận

- [Thêm bình luận](/api/v1/comments/create/:postId)
- [Cập nhật bình luận](/api/v1/comments/update/:commentId)
- [Xóa bình luận](/api/v1/comments/delete/:commentId)

### Danh mục

- [Lấy tất cả danh mục](/api/v1/categories/)
- [Lấy chi tiết danh mục](/api/v1/categories/:id)
- [Tạo danh mục](/api/v1/categories/create)
- [Cập nhật danh mục](/api/v1/categories/update/:id)
- [Xóa danh mục](/api/v1/categories/delete/:id)

# Người dùng 
## Giới thiệu
API này quản lý người dùng, bao gồm đăng ký, đăng nhập, đăng xuất, quản lý tài khoản,...

---

## Danh sách Endpoint

### 1. Đăng ký tài khoản
**Endpoint:** `POST /api/v1/users/register`

- **Mô tả:** Đăng ký tài khoản mới.
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Phản hồi:**
  ```json
 {
    "message": "Registered successfully, please login",
    "status": 201,
    "metadata": 
    {
        "user": 
        {
            "email": "itc@gmail.com"
        }
    }
}
    ```

---

### 2. Đăng nhập
**Endpoint:** `POST /api/v1/users/login`

- **Mô tả:** Xác thực người dùng và cung cấp token.
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "deviceId": "string"
  }
  ```
- **Phản hồi:**
  ```json
{
    "message": "Login successfully",
    "status": 200,
    "metadata": 
    {
        "accountInfo": 
        {
            "_id": "ObjectId",
            "email": "string"
        },
        "accessToken": "string",
        "refreshToken": "string"
    }
}
  ```

---


### 3. Refresh Token
**Endpoint:** `POST /api/v1/users/refreshToken`

- **Mô tả:** Cung cấp access token mới.
- **Yêu cầu xác thực: ** không
- **Body:**
  ```json
  {
    "refreshToken": "string",
    "deviceId": "string"
  }
  ```
- **Phản hồi:**
  ```json
  {
    "accessToken": "string"
  }
  ```

---

### 4. Đăng xuất
**Endpoint:** `POST /api/v1/users/logout`

- **Mô tả:** Đăng xuất khỏi hệ thống.
- **Yêu cầu xác thực:** Có
- **Phản hồi:**
  ```json
  {
    "message": "Logout successfully",
    "metadata": "OK"
  }
  ```

---

### 5. Cập nhật tài khoản
**Endpoint:** `POST /api/v1/users/profileUpdate`
- **Mô tả:** Thay đổi tên, họ và ảnh đại diện lên.
- **Yêu cầu xác thực:** Có
- **Form Body:**
  - File: `profile` (ảnh đại diện, nếu có)
  - lastName: `string`
  - firstName: `string`
-  **Phản hồi:**
  ```json
  {
    "message": `Update user's profile successfully`,
    "metadata": 
    {
        "user": {
            "_id": "string",
            "firstName": "string",
            "lastName": "string",
            "profilePhoto": "string"
        }
    }
  }
  ```
---

### 6. Hồ sơ người dùng
**Endpoint:** `GET /api/v1/users/viewers/:id`
- **Mô tả:** Xem trang cá nhân của người dùng
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `id` (string): ID của người dùng
- **Phản hồi:**
  ```json
  {
    "message": "OK",
    "metadata": 
    {
        "user": {
            "_id": "string",
            "firstName": "string",
            "lastName": "string",
            "profilePhoto": "string"
        }
    }
  }
  ```

---

### 7. Theo dõi và bỏ theo dõi người dùng
**Endpoint theo dõi: ** `GET /api/v1/users/following/:id`
**Endpoint bỏ theo dõi: ** `GET /api/v1/users/unfollowing/:id`
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `id` (string): ID của người dùng
- **Phản hồi:**
  ```json
  {
    "message": "followed/unfollowed successfully",
    "metadata": ""
  }
  ```

---


### 8. Chặn và bỏ chặn người dùng
- **Endpoint chặn người dùng:** `PUT /api/v1/users/blocking/:id`
- **Endpoint bỏ chặn người dùng:** `PUT /api/v1/users/unblocking/:id`
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `id` (string): ID của người dùng

- **Phản hồi:**
  ```json
  {
    "message": "User blocked/unblocked successfully",
    "metadata": ""
  }
  ```
---

### 9. Cập nhật email
**Endpoint:** `PUT /api/v1/users/updateEmail`
- **Yêu cầu xác thực:** Có
- **Body**
```json
{
  "email": "new-mail@gmail.com"
}
```
- **Phản hồi:**
  ```json
  {
    "message": "Email changed successfully",
    "metadata": {
        "user" : {
            "email": "string"
        }
    }
  }
  ```

---
### 10. Cập nhật mật khẩu
**Endpoint:** `PUT /api/v1/users/updatePassword`
- **Yêu cầu xác thực:** Có
- **Body**
```json
{
    "oldPassword": "123456789",
    "newPassword": "987654321"
}
```
- **Phản hồi:**
  ```json
  {
    "message": "Password changed successfully, please re-login",
    "metadata": {
        "user" : {
            "email": "string"
        }
    }
  }
  ```
### 11. Xóa tài khoản
**Endpoint:** `DELETE /api/v1/users/deleteAccount`
- **Yêu cầu xác thực:** Có
- **Phản hồi:**
  ```json
  {
    "message": "Account deleted successfully",
    "metadata": ""
  }

---

### 12. Chặn tài khoản bởi quản trị viên
**Endpoint** `PUT api/v1/users/adminBlocking/:id`
- **Yêu cầu quyền admin:** Có
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `id` (string): ID của người dùng
- **Phản hồi:**
  ```json
  {
    "message": "Admin blocking successfully",
    "metadata": "admin has blocked the user : userId"
  }

---
### 13. Bỏ chặn tài khoản bởi quản trị viên
**Endpoint** `PUT api/v1/users/adminUnblocking/:id`
- **Yêu cầu quyền admin:** Có
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `id` (string): ID của người dùng
- **Phản hồi:**
  ```json
  {
    "message": "Admin unblocking successfully",
    "metadata": "admin has unblocked the user : userId"
  }

---


# Bài viết
## Giới thiệu
API này quản lý bài viết, bao gồm tạo, xoá, sửa bài viết, v.v...

---


### 1. Tạo bài viết
**Endpoint:** `POST /api/v1/posts/create`
- **Mô tả:** Tạo bài viết mới.
- **Yêu cầu xác thực:** Có
- **Form Body:**
  - File: `postPhoto` (ảnh bài viết, nếu có),
  - Title: `string` (tiêu đề bài viết),
  - Description: `string` (nội dung bài viết)
  - Category: `ObjectId` (danh mục bài viết, nếu có)
- **Phản hồi:**
  ```json
 {
    "message": "Post created successfully",
    "status": 201,
    "metadata": {
        "post": {
            "title": "CSS is great",
            "description": "This is description",
            "category": null,
            "numViews": [],
            "likes": [],
            "dislikes": [],
            "comments": [],
            "user": "67aaec549b0759d7f100c002",
            "photo": "",
            "_id": "67b6ed2e1d4b0f862aa3d0d6",
            "createdAt": "2025-02-20T08:51:58.278Z",
            "updatedAt": "2025-02-20T08:51:58.278Z",
            "__v": 0,
            "id": "67b6ed2e1d4b0f862aa3d0d6",
            "numViewsCount": 0,
            "likesCount": 0,
            "dislikesCount": 0,
            "likesPercentage": 0,
            "daysAgo": "Today"
        }
    }
}
`
### 2. Lấy ngày đăng bài cuối cùng
**Endpoint:** `POST /api/v1/posts/lastDateUserCreatedPost`
- **Mô tả:** Trả về ngày đăng bài cuối cùng của người dùng
- **Yêu cầu xác thực:** Có
- **Phản hồi:**
  ```json
  {
   "message": "Last date user created post fetches successfully",
   "metadata": {
     "daysAgo": "Today"
   }
  }
  ```

### 3. Lấy danh sách bài viết
**Endpoint:** `GET /api/v1/posts/fetchAllPosts`
- **Mô tả:** Trả về danh sách tất cả bài viết.
- **Yêu cầu xác thực:** Có
- **Phản hồi:**
  ```json
  {
   "message": "All posts fetched successfully",
   "metadata": 
     [
        {
            "numViews": [],
            "likes": [],
            "dislikes": [],
            "comments": [],
            "_id": "67acb6402a17b1a5f619efb5",
            "title": "Bai so 1",
            "description": "Noi dung bai 1",
            "category": null,
            "user": {
                "_id": "67aaec549b0759d7f100c002",
                "email": "phungquynh2@gmail.com",
                "password": "$2b$10$F28qI8Y5jG8JP8GpQb1lpejgAemNBjjeAsTy3l55E/27Mokm8I/rK",
                "postCount": 5,
                "isBlocked": false,
                "isAdmin": true,
                "role": "Editor",
                "active": true,
                "plan": "Free",
                "userAward": "Bronze",
                "createdAt": "2025-02-11T06:21:08.527Z",
                "updatedAt": "2025-02-20T08:51:58.358Z",
                "__v": 11,
                "profilePhoto": "https://res.cloudinary.com/dciifjajg/image/upload/v1739283624/blog-api/ibuytiyqv3ccziyuojpu.png",
                "follower": [],
                "following": [],
                "posts": [
                    "67acb6402a17b1a5f619efb5",
                    "67b54934247e320f3719844c",
                    "67b54965247e320f37198456",
                    "67b5c30c677703761622dae6",
                    "67b6ed2e1d4b0f862aa3d0d6"
                ],
                "viewers": [
                    "67ab699c2c8514b61454a27a",
                    "67aaec549b0759d7f100c002"
                ],
                "blocked": [],
                "comments": [],
                "fullname": "",
                "initials": "",
                "followerCount": 0,
                "followingCount": 0,
                "viewCount": 2,
                "blockedCount": 0,
                "id": "67aaec549b0759d7f100c002"
            },
            "photo": "",
            "createdAt": "2025-02-12T14:54:56.586Z",
            "updatedAt": "2025-02-12T14:54:56.586Z",
            "__v": 0,
            "id": "67acb6402a17b1a5f619efb5",
            "numViewsCount": 0,
            "likesCount": 0,
            "dislikesCount": 0,
            "likesPercentage": 0,
            "daysAgo": "7 days ago"
        },
        {...}
     ]
  }
  ```

### 4. Like bài viết
**Endpoint:** `GET /api/v1/posts/like/:postID`
- **Mô tả:** Like bài viết theo ID.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `postID` (string): ID của người dùng
- **Phản hồi:**
```json
{
"message": "Post liked successfully",
"status": 200,
"metadata": {
    "numViews": [],
    "likes": [
        "67aaec549b0759d7f100c002"
    ],
    "dislikes": [],
    "comments": [],
    "_id": "67b54934247e320f3719844c",
    "title": "Bai so 1",
    "description": "Noi dung bai 1",
    "category": "67b48a4367c6aeb558c4fc30",
    "user": "67aaec549b0759d7f100c002",
    "photo": "",
    "createdAt": "2025-02-19T03:00:04.166Z",
    "updatedAt": "2025-02-20T09:06:34.241Z",
    "__v": 1,
    "id": "67b54934247e320f3719844c"
  }
}
  ```

### 5. Dislike bài viết
**Endpoint:** `GET /api/v1/posts/dislike/:postID`
- **Mô tả:** Dislike bài viết theo ID.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `postID` (string): ID của người dùng
- **Phản hồi:**
```json
{
  "message":"Post disliked successfully",
  "status":200,
  "metadata":
  {
    "_id":"67b54a32247e320f3719847d",
    "title":"title bai 4",
    "description":"description bai 4",
    "category":"67b48a4367c6aeb558c4fc30",
    "user":"67ab699c2c8514b61454a27a",
    "photo":"https://res.cloudinary.com/dciifjajg/image/upload/v1739971916/blog-api/um83uq4aypa6y0ip5qga.png",
    "createdAt":"2025-02-19T03:04:18.231Z",
    "updatedAt":"2025-02-20T09:07:57.993Z",
    "__v":11,"dislikes":[],
    "likes":["67aaec549b0759d7f100c002"],
    "numViews":["67aaec549b0759d7f100c002"],
    "comments":["67b5e4f5513723d12cd8ecb6"],
    "id":"67b54a32247e320f3719847d"
  }
}
```
### 6. Lấy bài viết theo ID
**Endpoint:** `GET /api/v1/posts/:postID`
- **Mô tả:** Trả về thông tin bài viết theo ID.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `postID` (string): ID của người dùng
- **Phản hồi:**
```json
{
  "message": "Post fetched successfully",
  "status":200,
  "metadata":
  {
    "_id":"67b54a32247e320f3719847d",
    "title":"title bai 4",
    "description":"description bai 4",
    "category":"67b48a4367c6aeb558c4fc30",
    "user":"67ab699c2c8514b61454a27a",
    "photo":"https://res.cloudinary.com/dciifjajg/image/upload/v1739971916/blog-api/um83uq4aypa6y0ip5qga.png",
    "createdAt":"2025-02-19T03:04:18.231Z",
    "updatedAt":"2025-02-20T09:07:57.993Z",
    "__v":11,
    "dislikes":[],"likes":["67aaec549b0759d7f100c002"],
    "numViews":["67aaec549b0759d7f100c002"],
    "comments":["67b5e4f5513723d12cd8ecb6"],
    "id":"67b54a32247e320f3719847d"
  }
}
  ```
### 7. Xóa bài viết
**Endpoint:** `DELETE /api/v1/posts/delete/:postID`

- **Mô tả:** Xóa bài viết theo ID.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
- `postID` (string): ID của người dùng
- **Phản hồi:**
```json
 {
    "message": "Post deleted successfully",
    "status":200,
    "metadata":
    {
      "_id":"67b54a32247e320f3719847d",
      "title":"title bai 4",
      "description":"description bai 4",
      "category":"67b48a4367c6aeb558c4fc30",
      "user":"67ab699c2c8514b61454a27a",
      "photo":"https://res.cloudinary.com/dciifjajg/image/upload/v1739971916/blog-api/um83uq4aypa6y0ip5qga.png",
      "createdAt":"2025-02-19T03:04:18.231Z",
      "updatedAt":"2025-02-20T09:07:57.993Z",
      "__v":11,
      "dislikes":[],
      "likes":["67aaec549b0759d7f100c002"],
      "numViews":["67aaec549b0759d7f100c002"],
      "comments":["67b5e4f5513723d12cd8ecb6"],
      "id":"67b54a32247e320f3719847d"
    }
  }
  ```

### 8. Cập nhật bài viết
**Endpoint:** `PUT /api/v1/posts/update/:postID`

- **Mô tả:** Cập nhật bài viết theo ID.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `postID` (string): ID của người dùng
- **Body:**
  - File: `postPhoto` (ảnh bài viết, nếu có)
  - Title: `string` (tiêu đề bài viết),
  - Description: `string` (nội dung bài viết)
  - Category: `ObjectId` (danh mục bài viết, nếu có)
- **Phản hồi:**
  ```json
  {
   "message": "Post updated successfully",
   "metadata":
   {
    "_id":"67b54a32247e320f3719847d",
    "title":"title bai 4",
    "description":"description bai 4",
    "category":"67b48a4367c6aeb558c4fc30",
    "user":"67ab699c2c8514b61454a27a",
    "photo":"https://res.cloudinary.com/dciifjajg/image/upload/v1739971916/blog-api/um83uq4aypa6y0ip5qga.png",
    "createdAt":"2025-02-19T03:04:18.231Z",
    "updatedAt":"2025-02-20T09:07:57.993Z",
    "__v":11,
    "dislikes":[],
    "likes":["67aaec549b0759d7f100c002"],
    "numViews":["67aaec549b0759d7f100c002"],
    "comments":["67b5e4f5513723d12cd8ecb6"],
    "id":"67b54a32247e320f3719847d"}
  }
  ```
---


# Bình luận
## Giới thiệu
API này cung cấp các chức năng để quản lý bình luận trên hệ thống.
## Yêu cầu chung
- Sử dụng `Bearer Token` để xác thực người dùng.
- Dữ liệu gửi và nhận dưới dạng JSON.
## Danh sách API

### 1. Tạo bình luận
- **Endpoint:** `POST /api/v1/comments/create/:postId`
- **Mô tả:** Cho phép người dùng tạo bình luận trên bài viết.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `postId` (string): ID của bài viết cần bình luận.
- **Body: **
```json
{
    "comment": "Binh luan"
}
```
- **Phản hồi:**
  ```json
    {
      "message":"Comment created successfully",
      "status":201,
      "metadata":
      {
        "post":"67b54a32247e320f3719847d",
        "user":"67aaec549b0759d7f100c002",
        "description":"Binh luan bai 4",
        "_id":"67b6f4a15e7af34aaca9045e",
        "createdAt":"2025-02-20T09:23:45.416Z",
        "updatedAt":"2025-02-20T09:23:45.416Z",
        "__v":0
        }
    }
    ```

### 2. Cập nhật bình luận
- **Endpoint:** `PUT /api/v1/comments/update/:commentId`
- **Mô tả:** Cho phép người dùng chỉnh sửa bình luận của họ.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `commentId` (string): ID của bình luận cần cập nhật.
 - **Phản hồi:**
    ```json
    {
      "message":"Comment updated successfully",
      "status":201,
      "metadata":
      {
        "post":"67b54a32247e320f3719847d",
        "user":"67aaec549b0759d7f100c002",
        "description":"Binh luan bai 4",
        "_id":"67b6f4a15e7af34aaca9045e",
        "createdAt":"2025-02-20T09:23:45.416Z",
        "updatedAt":"2025-02-20T09:23:45.416Z",
        "__v":0
        }
    }
    ```

### 3. Xóa bình luận
- **Endpoint:** `DELETE /api/v1/comments/delete/:commentId`
- **Mô tả:** Cho phép người dùng xóa bình luận của họ.
- **Yêu cầu xác thực:** Có
- **Tham số URL:**
  - `commentId` (string): ID của bình luận cần xóa.
- **Phản hồi:**
    ```json
    {
      "message": "Comment deleted successfully",
      "metadata": ""
    }
    ```
---
# Danh mục
## Giới thiệu
API này cung cấp các chức năng để quản lý danh mục trên hệ thống.
## Yêu cầu chung
- Sử dụng `Bearer Token` để xác thực người dùng.
- Dữ liệu gửi và nhận dưới dạng JSON.
### 1. Lấy danh sách danh mục
- **Endpoint:** `GET /api/v1/categories/`
- **Mô tả:** Lấy danh sách tất cả danh mục.
- **Yêu cầu xác thực:** Không
- **Phản hồi:**
  ```json
  {
    "message":"All categories fetched successfully",
    "status":200,
    "metadata":
    [
      {
        "_id":"67b48a4367c6aeb558c4fc30",
        "user":"67aaec549b0759d7f100c002",
        "title":"Category2",
        "createdAt":"2025-02-18T13:25:23.657Z",
        "updatedAt":"2025-02-18T13:25:23.657Z",
        "__v":0
      }
    ]
  }
  ```

### 2. Lấy thông tin chi tiết danh mục
- **Endpoint:** `GET /api/v1/categories/:id`
- **Mô tả:** Lấy thông tin chi tiết của một danh mục theo ID.
- **Yêu cầu xác thực:** Không
- **Tham số URL:**
  - `id` (string): ID của danh mục cần lấy thông tin.
- **Phản hồi:**
  ```json
  {
    "message":"Category fetched successfully",
    "status":200,
    "metadata":
    {
      "_id":"67b48a4367c6aeb558c4fc30",
      "user":"67aaec549b0759d7f100c002",
      "title":"Category2",
      "createdAt":"2025-02-18T13:25:23.657Z",
      "updatedAt":"2025-02-18T13:25:23.657Z",
      "__v":0
    }
  }
  ```

### 3. Tạo danh mục mới
- **Endpoint:** `POST /api/v1/categories/create`
- **Mô tả:** Cho phép người dùng có quyền tạo danh mục mới.
- **Yêu cầu xác thực:** Có
- **Body:** 
```json
{
  "title": "category 1"
}
```

- **Phản hồi:**
```json
{
 "message":"Category created successfully",
   "status":201,
   "metadata":
   {
     "category":
      {
        "user":"67aaec549b0759d7f100c002",
        "title":"category 1",
        "_id":"67b6f7385e7af34aaca90466",
        "createdAt":"2025-02-20T09:34:48.759Z",
        "updatedAt":"2025-02-20T09:34:48.759Z",
        "__v":0
      }
    }
  }
```

### 4. Cập nhật danh mục
- **Endpoint:** `PUT /api/v1/categories/updateCategory/:id`
- **Mô tả:** Cập nhật thông tin của một danh mục.
- **Yêu cầu xác thực:** Có.
- **Tham số URL:**
  - `id` (string): ID của danh mục cần cập nhật.
- **Phản hồi:**
```json
{
  "message":"Category updated successfully",
  "status":200,
  "metadata":
  {
    "_id":"67b6f7385e7af34aaca90466",
    "user":"67aaec549b0759d7f100c002",
    "title":"Category3",
    "createdAt":"2025-02-20T09:34:48.759Z",
    "updatedAt":"2025-02-20T09:38:51.562Z",
    "__v":0
  }
}
```

### 5. Xóa danh mục
- **Endpoint:** `DELETE /api/v1/categories/deleteCategory/:id`
- **Mô tả:** Xóa một danh mục khỏi hệ thống.
- **Yêu cầu xác thực:** Có.
- **Tham số URL:**
- `id` (string): ID của danh mục cần xóa.
- **Phản hồi:**
```json
{
  "message":"Category deleted successfully",
  "status":200,
  "metadata":
  {
    "_id":"67b6f7385e7af34aaca90466",
    "user":"67aaec549b0759d7f100c002",
    "title":"Category3",
    "createdAt":"2025-02-20T09:34:48.759Z",
    "updatedAt":"2025-02-20T09:38:51.562Z",
    "__v":0
  }
}
```





