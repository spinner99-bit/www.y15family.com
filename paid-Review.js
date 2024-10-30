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

    document.getElementById('contactForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent form submission
  
      // Collect user inputs
      const locations = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
      const businessInfo = document.getElementById('businessInfo').value;
      const contactInfo = document.getElementById('contactInfo').value;
      const selectedMethod = document.getElementById('selectedMethod').value; // Get selected method
  
      // Validation: Check if at least one location is selected and one contact method
      if (locations.length === 0) {
          alert('Please select at least one location.');
          return;
      }
      if (!selectedMethod) {
          alert('Please select a preferred contact method.');
          return;
      }
  
      // Get the current date and time
      const sendTime = new Date();
  
      // Format the time to DD-MM-YYYY HH:mm:ss
      const formattedTime = `${String(sendTime.getDate()).padStart(2, '0')}-${String(sendTime.getMonth() + 1).padStart(2, '0')}-${sendTime.getFullYear()} ${String(sendTime.getHours()).padStart(2, '0')}:${String(sendTime.getMinutes()).padStart(2, '0')}:${String(sendTime.getSeconds()).padStart(2, '0')}`;
  
      // Construct the message
      const message = `
          Interested Advertising : ${locations.join(', ')}\n\nContact Info : (${selectedMethod}) ${contactInfo}\n\nBusiness Type : ${businessInfo}\n\nSent At : ${formattedTime}
      `;
  
      // Send the message to Telegram
      const token = '6414565524:AAGY2obKsjvpfyH8rnq4t9OWMPDgKHM8ddI';
      const chatId = '-4590911564'; // Your chat ID
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  
      fetch(telegramUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML', // Optional: to format the message with HTML
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Message sent:', data);
          alert('Message sent successfully! Our staff will contact you within 72 hours.'); // Notify user of success
          window.location.reload(); // Refresh the page
      })
      .catch(error => {
          console.error('Error sending message:', error);
          alert('Failed to send message! Please Try Again.'); // Notify user of failure
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