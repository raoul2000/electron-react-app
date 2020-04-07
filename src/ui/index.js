import React from "react";
import ReactDOM from "react-dom";
import Form from "./components/Form";
import './styles/styles.css';
const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;