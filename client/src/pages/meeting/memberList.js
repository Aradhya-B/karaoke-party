import React from "react";
import "./leaderboard.css";
const MessageList = (props) => {
  if (props.memberList.length != 0) {
    props.memberList.map((member) => {
      if (document.querySelector("#ag-item-" + member.name) != null) {
        var el = document.createElement("span");

        //element.style
        el.style =
          "position:absolute; color:white; font-size:50px; top:5px; right:10px;background-color:black; border-radius:10px; padding-left:8px; padding-right:8px; inner-html: ";
        el.innerHTML = `${member.totalScore}`;
        el.style.zIndex = "99";
        document.querySelector("#player_" + member.name).appendChild(el);
      } else {
        console.log(
          "YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO MONKA js  WHY IS IT NULL IT REALLY SHOULDNT BE NULLLLLLLLLLLL"
        );
        return <div></div>;
      }
    });
  }
  return <div></div>;
};

export default MessageList;
