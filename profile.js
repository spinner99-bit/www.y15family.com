const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzw3wYdDmCjljEwQouXdWTg7s2B5Mr8Vqj8SpXxdg8Dp7jkA8OQwEIUuzYjCQjO2utM/exec'; // 替换此链接

document.addEventListener("DOMContentLoaded", function() {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const welcomeUserBtn = document.getElementById("welcomeUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const passwordSpan = document.getElementById('password');
  const fullNameSpan = document.getElementById('fullName');
  const wanumberSpan = document.getElementById('wanumber');
  const instaIDSpan = document.getElementById('instaID');
  const editPasswordInput = document.getElementById('editPassword');
  const editFullNameInput = document.getElementById('editFullName');
  const editWanumberInput = document.getElementById('editWanumber');
  const editInstaIDInput = document.getElementById('editInstaID');

  // 检测登录状态
  const username = localStorage.getItem("username"); // 从浏览器存储中获取用户名
  // const walletAmount = localStorage.getItem("walletAmount");

  if (username) {
    // 如果已登录
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    welcomeUserBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
    welcomeUserBtn.innerText = `${username}`;

    // 点击 welcomeUser 按钮后跳转到 profile.html
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
    // 如果未登录
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

  // 检查是否已登录并加载用户信息
  const loadProfile = function() {
    // 如果未登录，重定向到 login.html
    if (!username) {
      window.location.href = 'login.html';
      return; // 退出函数
    }

    // 从 localStorage 获取用户信息并显示
    const fullName = localStorage.getItem('fullName') || 'N/A';
    const wanumber = localStorage.getItem('wanumber') || 'N/A';
    const instaID = localStorage.getItem('instaID') || 'N/A';
    const password = localStorage.getItem('password') || 'N/A';
    // const walletAmount = localStorage.getItem('walletAmount') || '0'; // 如果为空，默认显示 0

    // 更新用户信息到页面上
    document.getElementById('username').textContent = username || 'N/A';
    document.getElementById('fullName').textContent = fullName;
    document.getElementById('wanumber').textContent = wanumber;
    document.getElementById('instaID').textContent = instaID;
    passwordSpan.textContent = password ? '********' : 'N/A'; // 隐藏显示的密码
    // document.getElementById('walletAmount').textContent = walletAmount;
};

  // 加载用户信息到 profile 页面
  if (window.location.pathname.includes('profile')) {
    loadProfile();
  }

  // 点击编辑按钮，显示编辑输入框
  editProfileBtn.addEventListener('click', function() {
    passwordSpan.style.display = 'none';
    fullNameSpan.style.display = 'none';
    wanumberSpan.style.display = 'none';
    instaIDSpan.style.display = 'none';

    editPasswordInput.style.display = 'inline-block';
    editFullNameInput.style.display = 'inline-block';
    editWanumberInput.style.display = 'inline-block';
    editInstaIDInput.style.display = 'inline-block';

    editPasswordInput.value = localStorage.getItem('password') || ''; // 填入已保存的密码
    editFullNameInput.value = fullNameSpan.textContent;
    editWanumberInput.value = wanumberSpan.textContent;
    editInstaIDInput.value = instaIDSpan.textContent;

    editProfileBtn.style.display = 'none';
    saveProfileBtn.style.display = 'inline-block';
  });

  // 点击保存按钮，保存更新后的信息
  saveProfileBtn.addEventListener('click', async function() {
    const updatedPassword = editPasswordInput.value;
    const updatedFullName = editFullNameInput.value;
    const updatedWanumber = editWanumberInput.value;
    const updatedInstaID = editInstaIDInput.value;

    // 更新 localStorage
    localStorage.setItem('password', updatedPassword);
    localStorage.setItem('fullName', updatedFullName);
    localStorage.setItem('wanumber', updatedWanumber);
    localStorage.setItem('instaID', updatedInstaID);

    // 更新 Google Sheets (通过 Google Apps Script API)
    await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'updateProfile',
        username: localStorage.getItem('username'),
        fullName: updatedFullName,
        wanumber: updatedWanumber,
        instaID: updatedInstaID,
        password: updatedPassword // 传递更新后的密码
      })
    });

    // 更新页面上的显示
    passwordSpan.textContent = '********'; // 重新显示隐藏的密码
    fullNameSpan.textContent = updatedFullName;
    wanumberSpan.textContent = updatedWanumber;
    instaIDSpan.textContent = updatedInstaID;

    passwordSpan.style.display = 'inline-block';
    fullNameSpan.style.display = 'inline-block';
    wanumberSpan.style.display = 'inline-block';
    instaIDSpan.style.display = 'inline-block';

    editPasswordInput.style.display = 'none';
    editFullNameInput.style.display = 'none';
    editWanumberInput.style.display = 'none';
    editInstaIDInput.style.display = 'none';

    saveProfileBtn.style.display = 'none';
    editProfileBtn.style.display = 'inline-block';
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".dropdown-btn");

  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", function (e) {
      e.preventDefault();

      // 切换下拉菜单显示状态
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
});

document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;

  // 检查路径是否以 .html 结尾
  if (currentPath.endsWith('.html')) {
      const newPath = currentPath.slice(0, -5);
      history.replaceState(null, '', newPath);
  }

  // 判断用户是否为 admin
  const loggedInUser = localStorage.getItem("username"); // 假设存储了用户名
  if (loggedInUser === "admin") {
      document.getElementById("adminSideBar").style.display = "block";
  }
});