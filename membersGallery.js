// 页面加载完成后执行所有操作
document.addEventListener("DOMContentLoaded", function() {
    // 获取页面元素
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeUserBtn = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("logoutBtn");
    const username = localStorage.getItem("username"); 
    const walletAmount = localStorage.getItem("walletAmount");

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
    const response = await fetch('https://script.google.com/macros/s/AKfycbyrqBT-ewOOM1tgnPK8281SFXdr3kbVomArjUXMWNseFxuQUxx49-FGb8iWlMqXFrgH/exec?action=getPhotos');
    const result = await response.json();
  
    const photoGallery = document.getElementById('photoGallery');
    photoGallery.innerHTML = ''; // 清空现有内容
  
    if (result.success) {
      result.data.forEach(photo => {
        const photoContainer = document.createElement('div'); // 创建一个卡片容器
        photoContainer.classList.add('photo-card'); // 添加样式类
  
        const imgContainer = document.createElement('div'); // 创建图像容器
        const img = document.createElement('img');
        img.src = photo.url; // 使用照片 URL
        img.alt = 'Uploaded Photo';
        img.style.width = '100%'; // 设置图像宽度为100%以适应容器
  
        // 点击照片时弹出图片
        img.addEventListener('click', () => {
          showPopup(photo.url); // 弹出图片
        });
  
        imgContainer.appendChild(img); // 将图像添加到图像容器
        photoContainer.appendChild(imgContainer); // 将图像容器添加到卡片容器
  
        const captionContainer = document.createElement('div'); // 创建描述容器
        const caption = document.createElement('p'); // 创建段落用于描述
        caption.textContent = `IG : ${photo.description}`; // 设置描述和Instagram数据
        caption.style.marginTop = '5px'; // 在描述上方添加一些空间
  
        // 添加点击事件打开 Instagram 链接
        caption.addEventListener('click', () => {
          let instaID = photo.description.startsWith('@') ? photo.description.slice(1) : photo.description;
          const instaURL = `https://www.instagram.com/${instaID}/profilecard/?igsh=MTljdzBxdGJ1Nmtzaw==`;
          window.open(instaURL, '_blank'); // 在新标签页打开链接
        });
  
        captionContainer.appendChild(caption); // 将描述添加到描述容器
        photoContainer.appendChild(captionContainer); // 将描述容器添加到卡片容器
  
        // 将卡片添加到画廊
        photoGallery.appendChild(photoContainer);
      });
    } else {
      photoGallery.innerHTML = '<p>Please Refresh Again.</p>'; // 如果没有照片
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadPhotos); // 页面加载时加载照片
  
  // 弹出窗口显示图片的功能
  function showPopup(url) {
    // 检查是否已有弹窗，避免重复
    if (document.getElementById('popup')) return;
  
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '1000';
  
    // 阻止点击弹窗内的图片时关闭弹窗
    popup.addEventListener('click', hidePopup);
  
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.zIndex = '1001';
  
    // 点击图片时阻止事件冒泡，避免关闭弹窗
    img.addEventListener('click', event => {
      event.stopPropagation();
    });
  
    popup.appendChild(img);
    document.body.appendChild(popup);
  }
  
  // 隐藏弹窗的功能
  function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
      popup.remove();
    }
  }
  
  
