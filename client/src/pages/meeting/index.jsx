import React from "react";
import * as Cookies from "js-cookie";

import "./meeting.css";
import GroupCalling from "../../components/GroupCalling";
import { AGORA_APP_ID } from "../../agora.config";
import MemberList from "./memberList.js"

import io from 'socket.io-client'
const socket = io("http://localhost:8080/",{transports: ['websocket', 'polling', 'flashsocket'],
'sync disconnect on unload': true,
});

class Meeting extends React.Component {

  state = {
  members: [],
   score:0,

  }

    componentDidMount() {
      const username = Cookies.get("username");

    //THIS WILL BE HIT WHEN A  MEMBER SENDS A NEW SCORE
    socket.on('updateMemberScores', (data) => {
      this.setState({members:data})
    })

    socket.on('updateLeaderBoard', (data) => {
      this.setState({members:data})
    })

    
    socket.emit("newMember", socket.id, username);

    }
  constructor(props) {
    super(props);
  
    this.videoProfile = Cookies.get("videoProfile").split(",")[0] || "480p_4";
    this.channel = Cookies.get("channel") || "test";
    this.username = Cookies.get("username") || this.makeid(4);
    this.transcode = Cookies.get("transcode") || "interop";
    this.attendeeMode = Cookies.get("attendeeMode") || "video";
    this.baseMode = Cookies.get("baseMode") || "avc";
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert("Get App ID first!");
    }
  }

  render() {

    const increaseScore = (value) => {
      socket.emit("newScore", socket.id, Cookies.get("username"),  value);
    }

    return (
      <div className="wrapper meeting">
        <div className="ag-header">
          <div className="ag-header-lead">
          </div>
          <div className="ag-header-msg">
            Room:&nbsp;<span id="room-name">{this.channel}</span><br/>
            User:&nbsp;<span id="room-name">{this.username}</span>
          </div>
          
        </div>
        
        <div className="ag-main">
          <div className="ag-container">
            <GroupCalling
              videoProfile={this.videoProfile}
              channel={this.channel}
              username={this.username}
              transcode={this.transcode}
              attendeeMode={this.attendeeMode}
              baseMode={this.baseMode}
              appId={this.appId}
              uid={this.username}
              increaseScore={this.increaseScore}
              socket={socket}
            />
          </div>
        </div>
        <MemberList memberList={this.state.members}/>
      </div>
    );
  }

   makeid = (length) => {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
}

export default Meeting;
