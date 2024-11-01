// 页面加载完成后执行所有操作
document.addEventListener("DOMContentLoaded", function() {
    // 获取页面元素
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeUserBtn = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("logoutBtn");
    const username = localStorage.getItem("username"); 
    const walletAmount = localStorage.getItem("walletAmount");
    const fileInput = document.getElementById('photoInput');
    fileInput.addEventListener('change', previewPhoto);

    // 检测登录状态
    if (username) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        welcomeUserBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";
        welcomeUserBtn.innerText = `${username}`;

        // 点击 welcomeUser 按钮跳转到 profile.html
        welcomeUserBtn.addEventListener("click", function() {
            window.location.href = "profile.html";
        });

        // 登出按钮功能
        logoutBtn.addEventListener("click", function() {
            // 清除所有用户相关的信息
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("fullName");
            localStorage.removeItem("wanumber");
            localStorage.removeItem("instaID");
            localStorage.removeItem("walletAmount");

            location.reload(); // 刷新页面
        });
    } else {
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
        welcomeUserBtn.style.display = "none";
        logoutBtn.style.display = "none";
    }

    // 侧边栏菜单的切换功能
    document.getElementById('toggleMenu').addEventListener('click', function() {
        const menu = document.getElementById('sideMenu');
        menu.classList.toggle('open');
    });

    document.getElementById('closeMenu').addEventListener('click', function() {
        const menu = document.getElementById('sideMenu');
        menu.classList.remove('open');
    });

    // 下拉菜单的切换功能
    const dropdowns = document.querySelectorAll(".dropdown-btn");
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function(e) {
            e.preventDefault();

            const dropdownContent = this.nextElementSibling;
            const icon = this.querySelector('.bx-chevron-down, .bx-chevron-up');

            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                icon.classList.remove('bx-chevron-up');
                icon.classList.add('bx-chevron-down');
            } else {
                dropdownContent.style.display = "block";
                icon.classList.remove('bx-chevron-down');
                icon.classList.add('bx-chevron-up');
            }
        });
    });

    // 移除 URL 中的 .html 后缀
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('.html')) {
        const newPath = currentPath.slice(0, -5);
        history.replaceState(null, '', newPath);
    }
});

function previewPhoto() {
  const fileInput = document.getElementById('photoInput');
  const previewImage = document.getElementById('photoPreview');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result; // 设置预览图片的src
      previewImage.style.display = 'block'; // 显示预览图片
    };

    reader.readAsDataURL(fileInput.files[0]); // 读取文件
  } else {
    previewImage.style.display = 'none'; // 隐藏预览图片
  }
}

// membersGallery.js
function toggleUpload() {
  const uploadOverlay = document.getElementById('uploadOverlay');
  uploadOverlay.style.display = uploadOverlay.style.display === 'none' ? 'flex' : 'none';
}

window.toggleUpload = toggleUpload; // 将函数绑定到全局对象

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuQLldQ6xbWjuw_yFrk7bgjF8Wengc_lQ",
  authDomain: "y15family.firebaseapp.com",
  databaseURL: "https://y15family-default-rtdb.firebaseio.com",
  projectId: "y15family",
  storageBucket: "y15family.appspot.com",
  messagingSenderId: "434656864137",
  appId: "1:434656864137:web:d7d82745f4bbba673fa358",
  measurementId: "G-69ZHD5ZT57"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.uploadPhoto = async function() {
  // 检查用户是否已登录
  const username = localStorage.getItem('username'); 
  const instaID = localStorage.getItem('instaID'); 
  
  if (!username || !instaID) {
      alert('Sila Log Masuk Akaun Anda Untuk Post !');
      return; // 用户未登录时直接返回
  }
  
  const fileInput = document.getElementById('photoInput');
  const file = fileInput.files[0];
  const uploadBtn = document.getElementById('uploadBtn'); // 获取上传按钮
  
  if (!file) {
      alert('Sila pilih foto anda !');
      return;
  }
  
  // 禁用上传按钮
  uploadBtn.disabled = true;
  uploadBtn.innerText = 'Uploading...';
  
  const storageRef = ref(storage, 'uploads/' + file.name);
  try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(snapshot.ref);

      // 生成唯一的 uploadID
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 10000); // 随机数
      const uploadID = `ID-${timestamp}-${randomNum}`;

      await fetch('https://script.google.com/macros/s/AKfycbxImwdncvOdQWZAOt85BQYzXNXcOz0DpBcKz4-CmpZR_ot5YFAq5AzqsZdgx-aP0f-p/exec', {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `action=uploadPhoto&username=${encodeURIComponent(username)}&instaID=${encodeURIComponent(instaID)}&photoUrl=${encodeURIComponent(photoUrl)}&uploadID=${encodeURIComponent(uploadID)}`
      });
  
      alert('Post foto anda telah berjaya !');
      loadPhotos(); // 刷新图片画廊
  } catch (error) {
      console.error('Upload failed:', error);
      alert('Sila cuba sekali lagi !');
  } finally {
      // 上传完成或失败后启用按钮
      uploadBtn.disabled = false;
      uploadBtn.innerText = 'POST';
  }
};

async function loadPhotos() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxUPPkUrKRcgnau1utszmiBEbb-RJK6q8Fg2gZZHGwI-TMlMvsRBBkEBJFwgYoZgify/exec?action=getPhotos');
    const result = await response.json();

    const photoGallery = document.getElementById('photoGallery');
    photoGallery.innerHTML = '';

    if (result.success) {
      result.data.forEach(photo => {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-card');

        const topSection = document.createElement('div');
        topSection.classList.add('top-section');

        const userIcon = document.createElement('img');
        userIcon.src = 'Element/logo.png';
        userIcon.alt = 'User Icon';
        userIcon.classList.add('user-icon'); // 添加样式类以控制图片大小和样式
        topSection.appendChild(userIcon);

        const username = document.createElement('span');
        username.textContent = photo.username;
        topSection.appendChild(username);

        // 处理 Instagram ID，删除开头的 @ 符号
        let instaID = photo.description;
        if (instaID.startsWith('@')) {
          instaID = instaID.substring(1); // 删除开头的 @ 符号
        }

        const instaIcon = document.createElement('i');
        instaIcon.classList.add('bx', 'bxl-instagram-alt');
        instaIcon.addEventListener('click', () => {
          const instaURL = `https://www.instagram.com/${instaID}/profilecard/?igsh=MTljdzBxdGJ1Nmtzaw==`;
          window.open(instaURL, '_blank');
        });
        topSection.appendChild(instaIcon);
        photoContainer.appendChild(topSection);

        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = 'Uploaded Photo';
        img.classList.add('photo-image');
        img.addEventListener('click', () => {
          showPopup(photo.url);
        });
        photoContainer.appendChild(img);

        const bottomSection = document.createElement('div');
        bottomSection.classList.add('bottom-section');

        const shareIcon = document.createElement('i');
        shareIcon.classList.add('bx', 'bxs-share');
        shareIcon.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        });
        bottomSection.appendChild(shareIcon);

        // 格式化上传日期为 DD-MM-YYYY HH:mm:ss
        const uploadDate = document.createElement('span');
        const dateParts = photo.uploadDate.split(' ');
        const [day, month, year] = dateParts[0].split('-');
        const formattedDateStr = `${year}-${month}-${day}T${dateParts[1]}`; // 转换为标准格式

        const date = new Date(formattedDateStr);
        if (isNaN(date.getTime())) {
          // 如果 date 是无效的，给出默认值或处理逻辑
          uploadDate.textContent = 'Invalid date';
        } else {
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
          uploadDate.textContent = formattedDate;
        }
        bottomSection.appendChild(uploadDate);

        photoContainer.appendChild(bottomSection);
        photoGallery.appendChild(photoContainer);
      });
    } else {
      console.error('Failed to load photos:', result);
      photoGallery.innerHTML = '<p>Please Refresh Again.</p>';
    }
  } catch (error) {
    console.error('Error fetching photos:', error); // 捕捉和显示任何错误
  }
}


document.addEventListener('DOMContentLoaded', loadPhotos);



