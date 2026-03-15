import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";

const STORAGE_KEY = "glowbeauty_settings";

const defaultSettings = {
  emailOffers: true,
  orderUpdates: true,
  compactCards: false,
  showRatings: true,
  saveAddressBook: true,
  language: "English"
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      }
    } catch (_error) {
      setSettings(defaultSettings);
    }
  }, [navigate]);

  function toggle(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <section className="page">
      <h2>Settings</h2>
      <p className="notice">Customize your shopping experience and preferences.</p>

      <div className="settings-list">
        <label className="setting-item">
          <input type="checkbox" checked={settings.emailOffers} onChange={() => toggle("emailOffers")} />
          <span>Email offers and discounts</span>
        </label>
        <label className="setting-item">
          <input type="checkbox" checked={settings.orderUpdates} onChange={() => toggle("orderUpdates")} />
          <span>Order status notifications</span>
        </label>
        <label className="setting-item">
          <input type="checkbox" checked={settings.compactCards} onChange={() => toggle("compactCards")} />
          <span>Compact product cards</span>
        </label>
        <label className="setting-item">
          <input type="checkbox" checked={settings.showRatings} onChange={() => toggle("showRatings")} />
          <span>Show rating badges</span>
        </label>
        <label className="setting-item">
          <input type="checkbox" checked={settings.saveAddressBook} onChange={() => toggle("saveAddressBook")} />
          <span>Save address book for faster checkout</span>
        </label>

        <label className="setting-select">
          <span>Language</span>
          <select
            value={settings.language}
            onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </label>
      </div>

      <button className="btn" type="button" onClick={saveSettings}>Save Settings</button>
      {saved && <p className="msg-inline">Settings saved successfully.</p>}
    </section>
  );
}
