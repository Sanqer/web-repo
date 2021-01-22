import './style.css';
import XonixView from "./mvc/xonixView";
import XonixModel from "./mvc/xonixModel";
import XonixController from "./mvc/xonixController";

new XonixController(new XonixView(), new XonixModel()).init();