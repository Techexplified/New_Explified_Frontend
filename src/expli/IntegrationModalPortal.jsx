import React from "react";
import ReactDOM from "react-dom";
import IntegrationModal from "./IntegrationModal";

export default function IntegrationModalPortal(props) {
  return ReactDOM.createPortal(<IntegrationModal {...props} />, document.body);
}
