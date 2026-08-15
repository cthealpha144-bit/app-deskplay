async function checkForUpdates() {
  const button = document.getElementById("checkUpdates");

  button.textContent = "Checking...";

  try {
    const result = await window.api.checkForUpdates();

    if (result.status === "up-to-date") {
      button.textContent = `You're up to date — v${result.version}`;
    } else if (result.status === "update-available") {
      button.textContent = `Downloading v${result.version}...`;
    } else {
      button.textContent = "Update check failed";
      console.error(result.message);
    }
  } catch (error) {
    console.error(error);
    button.textContent = "Update check failed";
  }

  setTimeout(() => {
    button.textContent = "Check for Updates";
  }, 4000);
}
