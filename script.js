document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeUserBtn = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("logoutBtn");
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const fullNameSpan = document.getElementById('fullName');
    const wanumberSpan = document.getElementById('wanumber');
    const instaIDSpan = document.getElementById('instaID');
    const editFullNameInput = document.getElementById('editFullName');
    const editWanumberInput = document.getElementById('editWanumber');
    const editInstaIDInput = document.getElementById('editInstaID');
  
    // 检测登录状态
    const username = localStorage.getItem("username"); // 从浏览器存储中获取用户名
    const walletAmount = localStorage.getItem("walletAmount");
  
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
