// 页面加载完成后执行所有操作
document.addEventListener("DOMContentLoaded", function() {
  // 获取页面元素
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userStatusIcon = document.querySelector('.siteLogBtn i'); // 获取用户状态图标
  const username = localStorage.getItem("username");
  const walletAmount = localStorage.getItem("walletAmount");

  // 检测登录状态
  if (username) {
      loginBtn.innerHTML = `${username}`; // 将登录按钮的内容更改为用户名
      loginBtn.classList.add('welcomeUser');
      logoutBtn.style.display = "inline-block";

      // 更新图标为已登录状态
      userStatusIcon.classList.remove('bxs-user-x');
      userStatusIcon.classList.add('bxs-user-check');

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
      loginBtn.innerHTML = "LOG MASUK"; // 设置默认内容
      logoutBtn.style.display = "none";

      // 更新图标为未登录状态
      userStatusIcon.classList.remove('bxs-user-check');
      userStatusIcon.classList.add('bxs-user-x');
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
});
