import React from 'react'
const MessageList = (props) => {
    if (props.memberList.length != 0) {
        props.memberList.map((member) => {
            if (document.querySelector('#ag-item-' + member.name) != null) {
                // const existing = document.getElementById(member.name + '_score')
                // if (existing) existing.remove()
                var el = document.createElement('span')

                //element.style
                el.style =
                    'position:absolute; color:white; font-size:25px; top:5px; right:10px;background-color:black; border-radius:10px; padding-left:8px; padding-right:8px; inner-html: '
                el.innerHTML = `${member.score}`
                el.style.zIndex = '99'
                el.id = member.name + '_score'
                document.querySelector('#player_' + member.name).appendChild(el)
            } else {
                return <div></div>
            }
        })
    }
    return <div></div>
}

export default MessageList
