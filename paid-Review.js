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
