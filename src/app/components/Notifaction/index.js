import React from "react";

const showNotification = ({
  type,
  message = "Error Occurred!",
  description = "Something went wrong. Please try again.",
}) => {
  const notificationStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  const notification = document.createElement("div");
  notification.className = `flex items-center border-l-4 p-4 rounded shadow-md ${notificationStyles[type]} mb-4 fixed top-4 right-4 z-50`;

  notification.innerHTML = `
    <div class="flex-1">
      <p class="font-bold">${message}</p>
      <p>${description}</p>
    </div>
    <button class="text-gray-500 hover:text-gray-700 ml-4 focus:outline-none">✕</button>
  `;

  document.body.appendChild(notification);

  const closeButton = notification.querySelector("button");
  closeButton.addEventListener("click", () => {
    notification.remove();
  });

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

export default showNotification;
