document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeUserBtn = document.getElementById("welcomeUser");
    const logoutBtn = document.getElementById("logoutBtn");
  
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

document.addEventListener("DOMContentLoaded", function() {
  // 从 localStorage 获取 username 并显示在输入框中
  const username = localStorage.getItem("username");
  if (username) {
      document.getElementById("username").value = username;
  }

  // 处理表单提交事件
  document.getElementById("requestForm").addEventListener("submit", function(event) {
      event.preventDefault(); // 阻止表单默认提交

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

  // 判断用户是否为 admin
  const loggedInUser = localStorage.getItem("username"); // 假设存储了用户名
  if (loggedInUser === "admin") {
      document.getElementById("adminSideBar").style.display = "block";
  }
});