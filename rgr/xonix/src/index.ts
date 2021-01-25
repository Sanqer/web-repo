import './style.css';
import XonixBuilder from "./mvc/xonixBuilder";

new XonixBuilder().width(96).height(69)
    .cellSize(12)
    .defLivesCount(3)
    .xonixColor("#FFFFFF")
    .traceColor("#FF00FF")
    .ballsColor("#21B111")
    .squareColor("#D91111")
    .groundColor("#6495ED")
    .waterColor("#212121")
    .build()
    .init();