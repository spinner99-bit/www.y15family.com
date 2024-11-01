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

document.addEventListener("DOMContentLoaded", function() {
  // 从 localStorage 获取 username 并显示在输入框中
  const username = localStorage.getItem("username");
  if (username) {
      document.getElementById("username").value = username;
  }

  // 处理表单提交事件
  document.getElementById("requestForm").addEventListener("submit", function(event) {
      event.preventDefault(); // 阻止表单默认提交

      // 检查用户是否已登录
      const username = localStorage.getItem("username");
      if (!username) {
          alert('Anda perlu login terlebih dahulu!'); // 提示用户未登录
          window.location.href = 'login.html'; // 跳转到登录页面
          return; // 退出提交处理
      }

      // 获取 IG 链接内容
      const igLink = document.getElementById("igLink").value;

      // 获取当前日期和时间
      const sendTime = new Date();
      const formattedTime = `${String(sendTime.getDate()).padStart(2, '0')}-${String(sendTime.getMonth() + 1).padStart(2, '0')}-${sendTime.getFullYear()} ${String(sendTime.getHours()).padStart(2, '0')}:${String(sendTime.getMinutes()).padStart(2, '0')}:${String(sendTime.getSeconds()).padStart(2, '0')}`;

      // 构造消息内容
      const message = `<b>New Request At ${formattedTime}</b>\n\n<b>👤 User : ${username}</b>\n\n<b>🔗 Post Link : <u>${igLink}</u></b>`;

      // 发送消息到 Telegram
      const token = '6414565524:AAGY2obKsjvpfyH8rnq4t9OWMPDgKHM8ddI';
      const chatId = '-4529995310'; // 您的群组 ID
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

      fetch(telegramUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML', // 可选：格式化消息
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Message sent:', data);
          alert('Request sent successfully!'); // 通知用户成功
          document.getElementById("requestForm").reset(); // 清空表单
      })
      .catch(error => {
          console.error('Error sending message:', error);
          alert('Failed to send request! Please try again.'); // 通知用户失败
      });
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
