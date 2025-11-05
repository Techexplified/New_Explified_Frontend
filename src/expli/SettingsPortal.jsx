// SettingsPortal.jsx
import React from "react";
import ReactDOM from "react-dom";
import SettingsModal from "./SettingsModal";

export default function SettingsPortal(props) {
  return ReactDOM.createPortal(<SettingsModal {...props} />, document.body);
}
